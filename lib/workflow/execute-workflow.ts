import "server-only";
import prisma from "../prisma";

import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowTask,
} from "../types/workflow";

import { ExecutionPhase } from "@prisma/client";
import { FlowNode } from "../types/flowNode";
import { TaskRegistry } from "./task/task-registry";
import { TaskExecutorRegistry } from "./task-executor/executor-registry";
import { Environment, ExecutionEnv } from "../types/executor";
import { NodeTaskInputType } from "../types/nodeTask";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "../types/log";
import { createLogCollector } from "../execution-logger";

type WorkflowExecutionWithPhasesType = Awaited<
  ReturnType<typeof getWorkflowExecutionWithPhases>
>;
export async function executeWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await getWorkflowExecutionWithPhases(executionId);
  const executionEnv: Environment = { phases: {} };
  const edges: Edge[] = JSON.parse(execution.definition).edges;
  await initializeWorkflowExecution({
    executionId,
    workflowId: execution.workflowId,
    nextRunAt,
  });
  await initializeExecutionPhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const { success, creditsConsumed: phaseCredits } =
      await executeWorkflowPhase({
        phase,
        environment: executionEnv,
        edges,
        userId: execution.userId,
      });

    creditsConsumed += phaseCredits;
    if (!success) {
      executionFailed = true;

      break;
    }
  }

  await finalizeWorkflowExecution({
    executionId,
    executionFailed,
    workflowId: execution.workflowId,
    creditsConsumed,
  });
  await cleanupEnv(executionEnv);
  // After the workflow finishes (successfully or with failure),
  // we clean up the execution environment.
  // This includes tearing down any resources that were created
  // during execution—such as browser instances, cached data,
  // temporary objects, or in-memory state stored in the Environment.
  //
  // cleanupEnv ensures no leftover processes or memory leaks remain
  // after the workflow run completes.
}

async function initializeWorkflowExecution({
  executionId,
  workflowId,
  nextRunAt,
}: {
  executionId: string;
  workflowId: string;
  nextRunAt?: Date;
}) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

async function initializeExecutionPhaseStatuses(
  execution: WorkflowExecutionWithPhasesType
) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution({
  executionId,
  executionFailed,
  workflowId,
  creditsConsumed,
}: {
  executionId: string;
  executionFailed: boolean;
  workflowId: string;
  creditsConsumed: number;
}) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;
  console.dir({ finalStatus, executionId, creditsConsumed }, { depth: null });
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed: creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {
      console.error(error);
    });
}

async function executeWorkflowPhase({
  environment,
  phase,
  edges,
  userId,
}: {
  phase: ExecutionPhase;
  environment: Environment;
  edges: Edge[];
  userId: string;
}) {
  const startedAt = new Date();
  const node: FlowNode = JSON.parse(phase.node);
  const logCollector = createLogCollector();
  setupEnvironmentForPhase({ node, environment, edges });
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  let success = await decrementCredits({
    logCollector,
    amount: creditsRequired,
    userId,
  });
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    success = await executePhase({
      node,
      environment,
      logCollector,
    });
  }
  const outputs = environment.phases[node.id].outputs;
  await phaseFinalize({
    phaseId: phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed,
  });
  return { success, creditsConsumed };
}
async function executePhase({
  environment,
  node,
  logCollector,
}: {
  node: FlowNode;
  environment: Environment;
  logCollector: LogCollector;
}) {
  const runFunction = TaskExecutorRegistry[node.data.type];
  if (!runFunction) {
    logCollector.error(`not found executor for ${node.data.type}`);
    return false;
  }
  const executionEnvironment: ExecutionEnv<WorkflowTask> =
    createExecutionEnvironment({
      node,
      environment,
      logCollector,
    });
  return await runFunction(executionEnvironment);
}

function setupEnvironmentForPhase({
  environment,
  node,
  edges,
}: {
  node: FlowNode;
  environment: Environment;
  edges: Edge[];
}) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };

  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === NodeTaskInputType.BROWSER_INSTANCE) continue;
    const inputVal = node.data.inputs[input.name];
    if (inputVal) {
      environment.phases[node.id].inputs[input.name] = inputVal;
    }

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error("missing edge for input");
      continue;
    }

    const outputVal =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputVal;

    // Resolve input dependencies for the current node.
    // We look for an edge whose target is this node and whose targetHandle
    // matches the current input name. This tells us which node provides the value
    // for this input.
    // If no edge is found, it means the input is not connected, so we skip it.
    //
    // Once we find the connected edge, we read the output value produced by the
    // source node at the sourceHandle, then assign that value as the input for
    // the current node in the execution environment.
  }
}

function createExecutionEnvironment({
  node,
  environment,
  logCollector,
}: {
  node: FlowNode;
  environment: Environment;
  logCollector: LogCollector;
}): ExecutionEnv<WorkflowTask> {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    setPage: (page: Page) => (environment.page = page),
    getPage: () => environment.page,
    log: logCollector,
  };
}

async function phaseFinalize({
  logCollector,
  outputs,
  phaseId,
  success,
  creditsConsumed,
}: {
  phaseId: string;
  success: boolean;
  outputs: Record<string, string>;
  logCollector: LogCollector;
  creditsConsumed: number;
}) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      executionLogs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function getWorkflowExecutionWithPhases(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow execution not found");
  }

  return execution;
}

async function cleanupEnv(env: Environment) {
  if (env.browser) {
    await env.browser
      .close()
      .catch((error) => console.error(`can't close browser ,reason :${error}`));
  }

  // After the workflow finishes (successfully or with failure),
  // we clean up the execution environment.
  // This includes tearing down any resources that were created
  // during execution—such as browser instances, cached data,
  // temporary objects, or in-memory state stored in the Environment.
  //
  // cleanupEnv ensures no leftover processes or memory leaks remain
  // after the workflow run completes.
}

async function decrementCredits({
  logCollector,
  userId,
  amount,
}: {
  logCollector: LogCollector;
  userId: string;
  amount: number;
}) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: {
          gte: amount,
        },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    logCollector.error("insufficient balance");
    return false;
  }
}
