"use client";

import CustomDialogHeader from "@/components/common/custom-dialog-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateWorkflowCronAction } from "@/lib/server/actions/workflows/update-workflow-cron-action";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { Calendar, Clock, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import { cn } from "@/lib/utils";
import parser from "cron-parser";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { removeWorkflowCronScheduleAction } from "@/lib/server/actions/workflows/remove-workflow-cron-schedule-action";
export default function SchedulerDialog({
  workflowId,
  cronValue,
}: {
  workflowId: string;
  cronValue: string | null;
}) {
  const [cron, setCron] = useState(cronValue || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");
  const scheduleMutation = useMutation({
    mutationFn: updateWorkflowCronAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Schedule updated successfully.", { id: "schedule-cron" });
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "schedule-cron",
      });
    },
  });
  const removeScheduleMutation = useMutation({
    mutationFn: removeWorkflowCronScheduleAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Schedule removed successfully.", {
        id: "remove-schedule",
      });
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "remove-schedule",
      });
    },
  });

  useEffect(() => {
    try {
      parser.parse(cron);
      const readableCronStr = cronstrue.toString(cron);

      setValidCron(true);

      setReadableCron(readableCronStr);
    } catch (error) {
      console.error(error);
      setValidCron(false);
    }
  }, [cron]);
  const workflowHasValidCron = cronValue && cronValue.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(cronValue!);
  return (
    <Dialog>
      <TooltipWrapper
        content={
          workflowHasValidCron && readableSavedCron
            ? readableSavedCron
            : "No Scheduled Cron!"
        }
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="link"
            className={cn(
              "text-sm p-0 h-auto cursor-pointer capitalize text-orange-500",
              workflowHasValidCron && "text-primary"
            )}
          >
            <div className="flex items-center gap-1">
              {workflowHasValidCron ? (
                <Clock className="size-3" />
              ) : (
                <TriangleAlert className="size-3" />
              )}
              <span>{workflowHasValidCron ? "Cron set" : "Set schedule"}</span>
            </div>
          </Button>
        </DialogTrigger>
      </TooltipWrapper>

      <DialogContent className="px-0">
        <CustomDialogHeader
          title="schedule workflow execution"
          icon={Calendar}
        />
        <div className="p-5 space-y-4">
          <DialogDescription className="TEXT-MUTED">
            Specify a cron expression to schedule periodic workflow execution.
            AllTimes are in UTC
          </DialogDescription>
          <Input
            placeholder="E.G. * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />

          <div
            className={cn(
              "rounded-sm p-2 text-sm border flex items-center gap-2 capitalize",
              validCron
                ? "border-green-500/50 bg-green-50 text-green-700"
                : "border-red-500/50 bg-red-50 text-red-700"
            )}
          >
            <span>{validCron ? readableCron : "Invalid cron expression"}</span>
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="flex justify-center">
                <Button
                  variant={"destructive"}
                  className="capitalize"
                  disabled={
                    scheduleMutation.isPending ||
                    removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    if (!onlineManager.isOnline()) {
                      toast.error("Check network connection", {
                        id: workflowId,
                      });
                      return;
                    }
                    toast.loading("Removing schedule...", {
                      id: "remove-schedule",
                    });
                    removeScheduleMutation.mutate({
                      workflowId,
                    });
                    setCron("");
                  }}
                >
                  {removeScheduleMutation.isPending
                    ? "removing current schedule..."
                    : "remove current schedule"}
                </Button>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-4 gap-2 ">
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              disabled={
                scheduleMutation.isPending ||
                !validCron ||
                removeScheduleMutation.isPending
              }
              onClick={() => {
                if (!onlineManager.isOnline()) {
                  toast.error("Check network connection", {
                    id: "schedule-cron",
                  });
                  return;
                }
                toast.loading("Saving schedule...", { id: "schedule-cron" });
                scheduleMutation.mutate({
                  workflowId,
                  cron,
                });
              }}
            >
              {scheduleMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
