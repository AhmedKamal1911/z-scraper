"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deleteWorkflowAction } from "@/lib/server/actions/workflows/delete-workflow-action";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
};
export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Props) {
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: deleteWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Workflow Deleted Successfully", { id: workflowId });
      setConfirmText("");
    },
    onError: (error) => {
      toast.error(error.message, { id: workflowId });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4">
            <span>
              {" "}
              This action cannot be undone. This will permanently delete your
              workflow
              <strong className="mx-1 text-destructive">
                &quot;{workflowName}&quot;
              </strong>
              and remove all its data from our servers.
            </span>

            <span className="text-sm text-muted-foreground">
              To confirm, please type
              <strong className="mx-1 text-destructive">
                &quot;{workflowName}&quot;
              </strong>{" "}
              below.
            </span>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${workflowName}" to confirm`}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (!onlineManager.isOnline()) {
                toast.error("Check network connection", { id: workflowId });
                return;
              }
              toast.loading("Deleting workflow...", { id: workflowId });
              deleteMutation.mutate(workflowId);
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
