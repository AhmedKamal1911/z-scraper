import React, { Suspense } from "react";
import WorkflowTopbar from "../../../editor/_components/workflow-topbar/workflow-topbar";

import {
  getUserWorkflowExecutionUsecase,
  getUserWorkflowUsecase,
} from "@/lib/dal";
import { notFound } from "next/navigation";
import ExecutionViewer from "./_components/execution-viewer";
import Loader from "../_components/loader";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/workflow/runs/[workflowId]/[executionId]">): Promise<Metadata> {
  const { executionId, workflowId } = await params; // مفيش await هنا

  const execution = await getUserWorkflowExecutionUsecase(executionId);

  if (!execution) {
    return {
      title: "Execution Not Found",
      description: "The requested workflow execution does not exist.",
    };
  }

  const workflow = await getUserWorkflowUsecase(workflowId);

  if (!workflow) {
    return {
      title: "Workflow Not Found",
      description: "The requested workflow does not exist.",
    };
  }

  return {
    title: `Run ${execution.id} · ${workflow.name}`,
    description: `View detailed information and status for workflow run "${execution.id}" (${workflow.name}).`,
  };
}
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
