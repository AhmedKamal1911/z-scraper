"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";

import prisma from "@/lib/prisma";
import { WorkflowDefinition, WorkflowStatus } from "@/lib/types/workflow";
import { flowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { calculateWorkflowCost } from "@/lib/workflow/helpers";

import { revalidatePath } from "next/cache";

export async function publishWorkflowAction({
  workflowId,
  definition,
}: {
  workflowId: string;
  definition: string;
}) {
  try {
    const workflow = await getUserWorkflowUsecase(workflowId);

    if (!workflow)
      throw new Error("Workflow you are trying to publish is not found!");
    if (workflow.status !== WorkflowStatus.DRAFT) {
      throw new Error("Only draft workflows can be published.");
    }
    const flow: WorkflowDefinition = JSON.parse(definition);
    const result = flowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("Flow Definition Not Valid");
    }
    if (!result.executionPlan) {
      throw new Error("No Execution Plan Generated");
    }
    const creditsCost = calculateWorkflowCost(flow.nodes);
    await prisma.workflow.update({
      where: { id: workflow.id, userId: workflow.userId },
      data: {
        definition,
        executionPlan: JSON.stringify(result.executionPlan),
        creditsCost,
        status: WorkflowStatus.PUBLISHED,
      },
    });
    revalidatePath(`/dashboard/workflow/editor/${workflowId}`);
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while publishing your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
