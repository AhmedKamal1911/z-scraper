import { getPublicUrl } from "@/lib/helper-utils/get-public-url";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types/workflow";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflowSafely(workflow.id);
  }

  return NextResponse.json({ triggered: workflows.length });
}

function triggerWorkflowSafely(workflowId: string) {
  const url = getPublicUrl(`/api/workflows/execute?workflowId=${workflowId}`);

  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TRIGGER_WORKFLOW_KEY_SECRET}`,
    },
    cache: "no-store",
  }).catch((e: Error) =>
    console.error("error while triggering workflow", workflowId, e.message)
  );
}
