import React, { Suspense } from "react";
import WorkflowTopbar from "../../../editor/_components/workflow-topbar/workflow-topbar";

import { getUserWorkflowExecutionUsecase } from "@/lib/dal";
import { notFound } from "next/navigation";
import ExecutionViewer from "./_components/execution-viewer";
import Loader from "../_components/loader";

export default async function ExecutionViewerPage({
  params,
}: PageProps<"/dashboard/workflow/runs/[workflowId]/[executionId]">) {
  const { executionId, workflowId } = await params;
  return (
    <div className="min-h-[calc(100vh-70px)]">
      <WorkflowTopbar
        title="workflow run details"
        subTitle={`RUN ID: ${executionId}`}
        workflowId={workflowId}
        hideButtons
      />

      <Suspense fallback={<Loader />}>
        <ExecutionViewerWrapper executionId={executionId} />
      </Suspense>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await getUserWorkflowExecutionUsecase(executionId);
  if (!workflowExecution) return notFound();
  return <ExecutionViewer initialData={workflowExecution} />;
}
