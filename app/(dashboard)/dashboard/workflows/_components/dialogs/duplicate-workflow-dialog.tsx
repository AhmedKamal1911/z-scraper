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
import { Copy, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { DuplicateWorkflowInputs } from "@/lib/validation/workflow";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

export default function DuplicateWorkflowDialog({
  hidden = false,
  form,
  onSubmit,
  open,
  setOpen,
  isPending,
}: {
  hidden?: boolean;
  form: UseFormReturn<DuplicateWorkflowInputs>;
  onSubmit: (values: DuplicateWorkflowInputs) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn("capitalize", hidden && "hidden")}
        >
          <Copy size={16} />
          {"Duplicate"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-[370px]:p-2">
        <CustomDialogHeader title="Duplicate" icon={Copy} />

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
        Duplicate dialog
      </DialogDescription>
    </Dialog>
  );
}
