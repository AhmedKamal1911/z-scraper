import { duplicateWorkflowAction } from "@/lib/server/actions/workflows/duplicate-workflow-action";
import {
  DuplicateWorkflowInputs,
  duplicateWorkflowSchema,
} from "@/lib/validation/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useDuplicateWorkflow(workflowId: string) {
  const [open, setOpen] = useState(false);
  const form = useForm<DuplicateWorkflowInputs>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
      name: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Workflow Duplicated", { id: "duplicate-workflow" });
      setOpen((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message, { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: DuplicateWorkflowInputs) => {
      if (!onlineManager.isOnline()) {
        toast.error("Check network connection", { id: "duplicate-workflow" });
        return;
      }
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return { open, form, isPending, onSubmit, setOpen };
}
