import { Button } from "@/components/ui/button";
import { updateWorkflowAction } from "@/lib/server/actions/workflows/update-workflow-action";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Check } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function SaveWorkflowEditsBtn({
  workflowId,
}: {
  workflowId: string;
}) {
  const { toObject } = useReactFlow();

  const saveActionMutation = useMutation({
    mutationFn: updateWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Workflow Updated Successfully.", {
        id: workflowId,
      });
    },
    onError: (e) => {
      toast.error(e.message, { id: workflowId });
    },
  });

  return (
    <Button
      disabled={saveActionMutation.isPending}
      variant={"outline"}
      className="font-semibold"
      onClick={() => {
        if (!onlineManager.isOnline()) {
          toast.error("Check network connection", { id: workflowId });
          return;
        }
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow Edits...", {
          id: workflowId,
        });
        saveActionMutation.mutate({
          workflowId: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <Check className="size-5 stroke-primary" />

      {saveActionMutation.isPending ? "Saving..." : "Save"}
    </Button>
  );
}
