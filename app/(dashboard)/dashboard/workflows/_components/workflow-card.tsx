import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { WorkflowExecutionStatus, WorkflowStatus } from "@/lib/types/workflow";
import { Workflow } from "@prisma/client";
import {
  Clock,
  Coins,
  CornerDownRight,
  FileText,
  MoveRight,
  PlayCircle,
  ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import WorkflowOptions from "./workflow-options";
import RunWorkflowBtn from "./run-workflow-btn";
import SchedulerDialog from "./dialogs/scheduler-dialog";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/(workflow)/dashboard/workflow/runs/[workflowId]/_components/execution-status-indicator";
import { DesktopDuplicateWorkflowDialog } from "./dialogs/desktop-duplicate-workflow-dialog";

type Props = {
  workflow: Workflow;
};

const statusColors: Record<WorkflowStatus, string> = {
  DRAFT: "bg-yellow-500/20 text-yellow-600",
  PUBLISHED: "bg-primary/20 text-primary",
};

export default function WorkflowCard({ workflow }: Props) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card
      className={cn("rounded-sm", {
        "pb-0": Boolean(workflow.lastRunAt || workflow.nextRunAt) && !isDraft,
      })}
    >
      <CardContent className="p-3 flex justify-between items-center gap-3">
        <div className="flex gap-2 min-[400px]:gap-4">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full size-7 min-[400px]:size-10 ${
              statusColors[workflow.status as WorkflowStatus]
            }`}
          >
            {isDraft ? (
              <FileText className="size-4 min-[400px]:size-6" />
            ) : (
              <PlayCircle className="size-4 min-[400px]:size-6" />
            )}
          </div>

          <div
            className={cn(`flex flex-col gap-2`, isDraft && "justify-center")}
          >
            <div className="flex items-center gap-3 min-[400px]:gap-4">
              <TooltipWrapper content={workflow.description}>
                <CardTitle className="min-[400px]:text-xl">
                  <Link
                    href={`/dashboard/workflow/editor/${workflow.id}`}
                    className="hover:underline"
                  >
                    {workflow.name}
                  </Link>
                </CardTitle>
              </TooltipWrapper>

              <Badge
                className={cn(
                  "capitalize rounded-sm  font-semibold text-xs",
                  isDraft ? "bg-yellow-500/90" : "bg-green-600/90"
                )}
              >
                {isDraft ? "draft" : "published"}
              </Badge>
            </div>
            {!isDraft && (
              <ScheduleSection
                cron={workflow.cron}
                workflowId={workflow.id}
                creditsConsumption={workflow.creditsCost}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 max-[960px]:hidden">
            {!isDraft && <RunWorkflowBtn workflowId={workflow.id} />}

            <Link
              className={buttonVariants({
                variant: "ghost",
                className: `flex items-center gap-2 capitalize`,
              })}
              href={`/dashboard/workflow/editor/${workflow.id}`}
            >
              <ShuffleIcon size={16} />
              edit
            </Link>
            <DesktopDuplicateWorkflowDialog workflowId={workflow.id} />
          </div>
          <WorkflowOptions workflow={workflow} />
        </div>
      </CardContent>
      {!isDraft && <LastRunDetails workflow={workflow} />}
    </Card>
  );
}
function ScheduleSection({
  creditsConsumption,
  cron,
  workflowId,
}: {
  creditsConsumption: number;
  cron: string | null;
  workflowId: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CornerDownRight className="size-4 text-muted-foreground" />
      <SchedulerDialog cronValue={cron} workflowId={workflowId} />
      <div className="flex gap-2 items-center">
        <MoveRight className="size-4 text-muted-foreground" />
        <TooltipWrapper content="Full Run Credit Consumption">
          <div className="flex items-center gap-2">
            <Badge
              variant={"outline"}
              className="space-x-2 text-muted-foreground rounded-sm"
            >
              <Coins className="size-4" />
              <span className="text-sm">{creditsConsumption}</span>
            </Badge>
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const { lastRunAt, lastRunStatus, id, lastRunId, nextRunAt } = workflow;

  if (!lastRunAt || !lastRunStatus) {
    return (
      <div className="px-3 py-2 flex items-center gap-2 text-xs sm:text-sm capitalize bg-accent">
        No runs yet
      </div>
    );
  }

  const timeToNextRun = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const timeAgo = formatDistanceToNow(lastRunAt, { addSuffix: true });

  return (
    <div className="px-3 py-2 flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm capitalize bg-accent">
      <Link
        className="flex items-center gap-2"
        href={`/dashboard/workflow/runs/${id}/${lastRunId}`}
      >
        <ExecutionStatusIndicator
          status={lastRunStatus as WorkflowExecutionStatus}
        />
        <span>Last run:</span>
        <ExecutionStatusLabel
          status={lastRunStatus as WorkflowExecutionStatus}
        />
        ({timeAgo})
      </Link>
      {timeToNextRun && (
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          <Clock className="size-4" />
          Next run: {timeToNextRun}
        </div>
      )}
    </div>
  );
}
