"use client";
import { Workflow } from "@prisma/client";
import { useState } from "react";
import DeleteWorkflowDialog from "./dialogs/delete-workflow-dialog";
import WorkflowMenu from "./workflow-menu";

export default function WorkflowOptions({ workflow }: { workflow: Workflow }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        workflowId={workflow.id}
        workflowName={workflow.name}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />

      <WorkflowMenu
        workflow={workflow}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
}
