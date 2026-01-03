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
import { KeyRound, LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCredentialAction } from "@/lib/server/actions/credentials/create-credential-action";
import { useForm } from "react-hook-form";
import {
  createCredentialSchema,
  CredentialsInputs,
} from "@/lib/validation/credential";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  buttonText?: string;
};

export default function CreateCredentialDialog({ buttonText }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CredentialsInputs>({
    resolver: zodResolver(createCredentialSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCredentialAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Credential created successfully", {
        id: "create-credential",
      });

      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: "create-credential" });
    },
  });

  const onSubmit = useCallback(
    (values: CredentialsInputs) => {
      if (!onlineManager.isOnline()) {
        toast.error("Check network connection", { id: "create-credential" });
        return;
      }
      toast.loading("Creating credential...", { id: "create-credential" });
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
        <Button className="capitalize cursor-pointer">
          {buttonText ?? "Add Credential"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-[370px]:p-2">
        <CustomDialogHeader
          title="Create Credential"
          subTitle="Add credentials to securely connect your services"
          icon={KeyRound}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. API Key" />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter a unique name for your credential.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What will this credential be used for?"
                      className="max-h-[150px]"
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Provide a short description to help identify this
                    credential.
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
                "Create Credential"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>

      <DialogDescription className="sr-only">
        Create credential dialog
      </DialogDescription>
    </Dialog>
  );
}
