"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types/workflow";

import { revalidatePath } from "next/cache";
import parser from "cron-parser";
export async function updateWorkflowCronAction({
  workflowId,
  cron,
}: {
  workflowId: string;
  cron: string;
}) {
  try {
    const workflow = await getUserWorkflowUsecase(workflowId);

    if (!workflow)
      throw new Error("Workflow you are trying to update his cron not found!");
    if (workflow.status === WorkflowStatus.DRAFT) {
      throw new Error("Only published workflows can be scheduled.");
    }
    const interval = parser.parse(cron);
    await prisma.workflow.update({
      where: { id: workflow.id, userId: workflow.userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
    revalidatePath("/dashboard/workflows");
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while updating your workflow cron."
      );
    }
    if (isErrorType(error)) {
      console.log(error);
      throw new Error(error.message);
    }

    throw new Error("Internal Server Error");
  }
}
