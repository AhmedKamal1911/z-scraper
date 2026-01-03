"use client";

import { useDuplicateWorkflow } from "@/hooks/use-duplicate-workflow";
import DuplicateWorkflowDialog from "./duplicate-workflow-dialog";

export function DesktopDuplicateWorkflowDialog({
  workflowId,
}: {
  workflowId: string;
}) {
  const { form, isPending, onSubmit, open, setOpen } =
    useDuplicateWorkflow(workflowId);
  return (
    <DuplicateWorkflowDialog
      form={form}
      isPending={isPending}
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    />
  );
}
