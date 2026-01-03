"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types/workflow";

import { revalidatePath } from "next/cache";

export async function unpublishWorkflowAction({
  workflowId,
}: {
  workflowId: string;
}) {
  try {
    const workflow = await getUserWorkflowUsecase(workflowId);

    if (!workflow)
      throw new Error("Workflow you are trying to unpublish is not found!");
    if (workflow.status === WorkflowStatus.DRAFT) {
      throw new Error("Only published workflows can be unpublished.");
    }

    await prisma.workflow.update({
      where: { id: workflow.id, userId: workflow.userId },
      data: {
        executionPlan: null,
        status: WorkflowStatus.DRAFT,
        creditsCost: 0,
      },
    });
    revalidatePath(`/dashboard/workflow/editor/${workflowId}`);
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while unpublishing your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
