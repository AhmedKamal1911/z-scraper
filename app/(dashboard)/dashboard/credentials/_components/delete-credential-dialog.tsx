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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCredentialAction } from "@/lib/server/actions/credentials/delete-credential-action";

import { onlineManager, useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  credentialName: string;
};

export default function DeleteCredentialDialog({ credentialName }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: deleteCredentialAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Credential Deleted Successfully", { id: credentialName });
      setConfirmText("");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: credentialName });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <Trash size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4">
            <span>
              This action cannot be undone. This will permanently delete your
              credential
              <strong className="mx-1 text-destructive">
                &quot;{credentialName}&quot;
              </strong>
              and remove all its data from our servers.
            </span>

            <span className="text-sm text-muted-foreground">
              To confirm, please type
              <strong className="mx-1 text-destructive">
                &quot;{credentialName}&quot;
              </strong>{" "}
              below.
            </span>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${credentialName}" to confirm`}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              confirmText !== credentialName || deleteMutation.isPending
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (!onlineManager.isOnline()) {
                toast.error("Check network connection", { id: credentialName });
                return;
              }
              toast.loading("Deleting credential...", { id: credentialName });
              deleteMutation.mutate(credentialName);
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
