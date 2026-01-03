"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";

import prisma from "@/lib/prisma";
import { FlowNode } from "@/lib/types/flowNode";

import {
  ExecutionPhaseStatus,
  WorkflowDefinition,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/lib/types/workflow";
import { executeWorkflow } from "@/lib/workflow/execute-workflow";
import { flowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { TaskRegistry } from "@/lib/workflow/task/task-registry";
import { revalidatePath } from "next/cache";

export async function executeWorkflowAction(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("WorkflowId is Required");
  }

  try {
    const workflow = await getUserWorkflowUsecase(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found!");
    }
    let executionPlan: WorkflowExecutionPlan[];
    let workflowDefinition = flowDefinition;
    if (workflow.status === WorkflowStatus.PUBLISHED) {
      if (!workflow.executionPlan) {
        throw new Error("No execution plan found in published workflow!");
      }
      executionPlan = JSON.parse(workflow.executionPlan!);
      workflowDefinition = workflow.definition;
    } else {
      if (!flowDefinition) {
        throw new Error("Flow definition is not defined");
      }

      const parsedFlow: WorkflowDefinition = JSON.parse(flowDefinition);

      const result = flowToExecutionPlan(parsedFlow.nodes, parsedFlow.edges);
      if (result.error) {
        throw new Error("Flow definition not valid!");
      }

      if (!result.executionPlan) {
        throw new Error("No execution plan generated");
      }
      executionPlan = result.executionPlan;
    }
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.MANUAL,
        definition: workflowDefinition,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              const flowNode = node as FlowNode;
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phaseNumber,
                node: JSON.stringify(flowNode),
                name: TaskRegistry[flowNode.data.type].label,
              };
            });
          }),
        },
      },
      select: {
        id: true,
        phases: true,
      },
    });
    if (!execution) {
      throw new Error("Failed to create workflow execution!");
    }
    executeWorkflow(execution.id);
    revalidatePath(`/dashboard/workflow/runs/${workflowId}/${execution.id}`);
    return execution.id;
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while executing your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
