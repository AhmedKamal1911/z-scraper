"use client";

import { executeWorkflowAction } from "@/lib/server/actions/workflows/execute-workflow-action";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRunWorkflow(workflowId: string) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: executeWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: (executionId) => {
      toast.success("Workflow Is Running", { id: workflowId });
      router.replace(`/dashboard/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: (e) => {
      toast.error(e.message, { id: workflowId });
    },
  });

  const runWorkflow = () => {
    if (!onlineManager.isOnline()) {
      toast.error("Check network connection", { id: workflowId });
      return;
    }
    toast.loading("Scheduling run...", { id: workflowId });
    mutation.mutate({ workflowId });
  };

  return {
    runWorkflow,
    isRunning: mutation.isPending,
  };
}
