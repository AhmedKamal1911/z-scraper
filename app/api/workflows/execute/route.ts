import prisma from "@/lib/prisma";
import { FlowNode } from "@/lib/types/flowNode";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/lib/types/workflow";
import { executeWorkflow } from "@/lib/workflow/execute-workflow";
import { TaskRegistry } from "@/lib/workflow/task/task-registry";
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import parser from "cron-parser";
function isValidSecret(secret: string) {
  const SECRET = process.env.TRIGGER_WORKFLOW_KEY_SECRET;
  if (!SECRET) return false;
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(SECRET));
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }
    if (authHeader !== `Bearer ${process.env.TRIGGER_WORKFLOW_KEY_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
      return NextResponse.json(
        { error: "Invalid secret token" },
        { status: 401 }
      );
    }

    const workflowId = req.nextUrl.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing workflowId parameter" },
        { status: 400 }
      );
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    if (!workflow.executionPlan) {
      return NextResponse.json(
        { error: "Workflow has no execution plan" },
        { status: 400 }
      );
    }

    const executionPlan: WorkflowExecutionPlan[] = JSON.parse(
      workflow.executionPlan
    );

    const cron = parser.parse(workflow.cron!);
    const nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) =>
            phase.nodes.map((node) => {
              const flowNode = node as FlowNode;
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phaseNumber,
                node: JSON.stringify(flowNode),
                name: TaskRegistry[flowNode.data.type].label,
              };
            })
          ),
        },
      },
    });

    await executeWorkflow(execution.id, nextRun);

    return NextResponse.json(
      { success: true, message: "Workflow executed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error triggering workflow:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
