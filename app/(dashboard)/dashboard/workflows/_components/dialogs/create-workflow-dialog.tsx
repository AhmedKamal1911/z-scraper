"use client";
import CustomDialogHeader from "@/components/common/custom-dialog-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Layers, LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createWorkflowSchema,
  WorkflowInputs,
} from "@/lib/validation/workflow";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createWorkflowAction } from "@/lib/server/actions/workflows/create-workflow-action";

type Props = {
  buttonText?: string;
};

export default function CreateWorkflowDialog({ buttonText }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<WorkflowInputs>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: (workflow) => {
      toast.success("Workflow Created", { id: "create-workflow" });
      router.push(`/dashboard/workflow/editor/${workflow.id}`);
    },
    onError: (error) => {
      toast.error(error.message, { id: "create-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: WorkflowInputs) => {
      if (!onlineManager.isOnline()) {
        toast.error("Check network connection", { id: "create-workflow" });
        return;
      }
      toast.loading("Creating workflow...", { id: "create-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="capitalize">
          {buttonText ?? "Create Workflow"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-[370px]:p-2">
        <CustomDialogHeader
          title="Create Workflow"
          subTitle="Start building your workflow"
          icon={Layers}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Workflow name" />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter a unique name for your workflow.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your workflow"
                      className="max-h-[150px]"
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Provide a brief description of what your workflow does.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="capitalize w-full"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin size-6" />
              ) : (
                "proceed"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>

      <DialogDescription className="sr-only">
        Create workflow dialog
      </DialogDescription>
    </Dialog>
  );
}
