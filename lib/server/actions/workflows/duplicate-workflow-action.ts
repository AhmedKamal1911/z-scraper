"use server";

import { getUserWorkflowUsecase } from "@/lib/dal";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import prisma from "@/lib/prisma";

import { WorkflowStatus } from "@/lib/types/workflow";
import {
  DuplicateWorkflowInputs,
  duplicateWorkflowSchema,
} from "@/lib/validation/workflow";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflowAction(inputs: DuplicateWorkflowInputs) {
  const { success, data } = duplicateWorkflowSchema.safeParse(inputs);
  if (!success) {
    throw new Error("Invalid Form Data");
  }

  try {
    const sourceWorkflow = await getUserWorkflowUsecase(data.workflowId);
    if (!sourceWorkflow) {
      throw new Error("Workflow Not Found");
    }
    const workflowWithSameName = await prisma.workflow.findFirst({
      where: {
        name: data.name,
      },
    });
    if (sourceWorkflow.name === data.name || workflowWithSameName) {
      throw new Error(`Workflow with name "${data.name}" already exists.`);
    }

    await prisma.workflow.create({
      data: {
        userId: sourceWorkflow.userId,
        status: WorkflowStatus.DRAFT,
        definition: sourceWorkflow.definition,
        name: data.name,
        description: data.description,
      },
    });

    revalidatePath("/dashboard/workflows");
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while duplicating your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
