import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { unpublishWorkflowAction } from "@/lib/server/actions/workflows/unpublish-workflow-action";

export default function UnPublishWorkflowBtn({
  workflowId,
}: {
  workflowId: string;
}) {
  const mutation = useMutation({
    mutationFn: unpublishWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",

    onSuccess: () => {
      toast.success("Workflow UnPublished Successfully", {
        id: workflowId,
      });
    },

    onError: (error) => {
      toast.error(error.message, {
        id: workflowId,
      });
    },
  });
  return (
    <Button
      variant={"outline"}
      className=" capitalize"
      disabled={mutation.isPending}
      onClick={() => {
        if (!onlineManager.isOnline()) {
          toast.error("Check network connection", { id: workflowId });
          return;
        }
        toast.loading("UnPublishing Workflow...", {
          id: workflowId,
        });
        mutation.mutate({
          workflowId,
        });
      }}
    >
      <Archive className="text-destructive" />
      {mutation.isPending ? "unpublishing..." : "unpublish"}
    </Button>
  );
}
