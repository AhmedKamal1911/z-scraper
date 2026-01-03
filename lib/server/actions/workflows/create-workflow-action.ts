"use server";

import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import prisma from "@/lib/prisma";
import { NodeTaskType } from "@/lib/types/nodeTask";
import { WorkflowDefinition, WorkflowStatus } from "@/lib/types/workflow";
import {
  createWorkflowSchema,
  WorkflowInputs,
} from "@/lib/validation/workflow";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { auth } from "@clerk/nextjs/server";

export async function createWorkflowAction(inputs: WorkflowInputs) {
  const { success, data } = createWorkflowSchema.safeParse(inputs);
  if (!success) {
    throw new Error("Invalid Form Data");
  }
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthnticated!");
  }

  const initialWorkflow: WorkflowDefinition = {
    edges: [],
    nodes: [createFlowNode(NodeTaskType.LAUNCH_BROWSER)],
    viewport: { x: 0, y: 0, zoom: 1 },
  };
  try {
    const isWorkflowExist = await prisma.workflow.findFirst({
      where: {
        name: data.name,
        userId: userId,
      },
    });
    if (isWorkflowExist) {
      throw new Error("Workflow Already Exist!");
    }

    const result = await prisma.workflow.create({
      data: {
        userId,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialWorkflow),
        ...data,
      },
    });
    return { id: result.id };
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while creating your workflow."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
