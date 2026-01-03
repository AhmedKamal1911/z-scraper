"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types/workflow";

import { revalidatePath } from "next/cache";

export async function removeWorkflowCronScheduleAction({
  workflowId,
}: {
  workflowId: string;
}) {
  try {
    const workflow = await getUserWorkflowUsecase(workflowId);

    if (!workflow)
      throw new Error("The workflow you are trying to modify was not found.");
    if (workflow.status === WorkflowStatus.DRAFT) {
      throw new Error("Only published workflows can have a schedule removed.");
    }

    await prisma.workflow.update({
      where: { id: workflow.id, userId: workflow.userId },
      data: {
        cron: null,
        nextRunAt: null,
      },
    });

    revalidatePath("/dashboard/workflows");
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error("Failed to remove schedule. Please try again.");
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }

    throw new Error(
      "Something went wrong while removing the schedule. Please try again."
    );
  }
}
