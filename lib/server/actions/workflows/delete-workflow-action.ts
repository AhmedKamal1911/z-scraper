"use server";

import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import { requireAuth } from "@/lib/helper-utils/require-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteWorkflowAction(workflowId: string) {
  try {
    const { userId } = await requireAuth();
    await prisma.workflow.delete({
      where: {
        userId: userId,
        id: workflowId,
      },
    });
    revalidatePath("/workflows");
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while deleting your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
