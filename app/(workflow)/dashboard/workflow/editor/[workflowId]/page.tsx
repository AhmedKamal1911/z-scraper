import { getUserWorkflowUsecase } from "@/lib/dal";

import { notFound } from "next/navigation";
import EditorBox from "../_components/editor-box";

import type { Metadata } from "next";

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
    title: workflow.name,
    description: `Edit and manage workflow "${workflow.name}"`,
  };
}

export default async function EditorPage({
  params,
}: PageProps<"/dashboard/workflow/editor/[workflowId]">) {
  const { workflowId } = await params;
  const workflow = await getUserWorkflowUsecase(workflowId);
  if (!workflow) return notFound();

  return <EditorBox workflow={workflow} />;
}
