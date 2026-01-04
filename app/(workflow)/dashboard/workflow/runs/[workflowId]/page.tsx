import { getWorkflowExecutions } from "@/lib/server/queries/workflows/get-workflow-executions";
import WorkflowTopbar from "../../editor/_components/workflow-topbar/workflow-topbar";
import { Suspense } from "react";
import { Inbox } from "lucide-react";

import ExecutionsTable from "./_components/executions-table";
import Loader from "./_components/loader";
import { Metadata } from "next";
import { getUserWorkflowUsecase } from "@/lib/dal";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/workflow/editor/[workflowId]">): Promise<Metadata> {
  const { workflowId } = await params;
  const workflow = await getUserWorkflowUsecase(workflowId);

  if (!workflow) {
    return {
      title: "Workflow Not Found",
      description: "The requested workflow does not exist.",
    };
  }

  return {
    title: `${workflow.name} · Runs`,
    description: `View all executions and runs for workflow "${workflow.name}".`,
  };
}
export default async function ExecutionsHistoryPage({
  params,
}: PageProps<"/dashboard/workflow/editor/[workflowId]">) {
  const { workflowId } = await params;
  return (
    <div className="min-h-[calc(100vh-70px)]">
      <WorkflowTopbar
        title="all runs"
        subTitle="List of all workflow runs"
        workflowId={workflowId}
        hideButtons
      />

      <Suspense fallback={<Loader />}>
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const workflowExecutions = await getWorkflowExecutions(workflowId);

  if (!workflowExecutions || workflowExecutions.length === 0) {
    return (
      <div className="flex flex-col gap-3 h-[calc(100vh-70px)] items-center justify-center text-muted-foreground">
        <div className="flex items-center justify-center p-5 bg-accent/20 rounded-full">
          <Inbox className="size-12 text-primary" />
        </div>
        <p className="text-lg font-semibold">No executions found</p>
        <p className="text-sm">This workflow has no runs yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <ExecutionsTable
        workflowId={workflowId}
        initialData={workflowExecutions}
      />
    </div>
  );
}
