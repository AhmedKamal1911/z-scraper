import {
  Calendar,
  CircleDashed,
  Clock,
  Coins,
  GitGraph,
  Loader,
} from "lucide-react";
import { ExecutionDetailBox } from "./execution-details-box";
import { ExecutionWithPhases } from "./execution-viewer";
import PhaseStatusBadge from "./phase-status-badge";
import { ExecutionPhaseStatus } from "@/lib/types/workflow";
import { formatDistanceToNow } from "date-fns";

import CountUpWrapper from "@/app/(dashboard)/dashboard/_components/common/count-up-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function ExecutionViewerAside({
  execution,
  selectedPhase,
  setSelectedPhase,
  isRunning,
  duration,
  creditsConsumed,
}: {
  execution: ExecutionWithPhases;
  selectedPhase: string | null;
  setSelectedPhase: (phaseId: string) => void;
  isRunning: boolean;
  duration: string | null;
  creditsConsumed: number;
}) {
  return (
    <>
      <aside className="shrink-0 sticky top-[70px] w-[350px] max-md:hidden lg:w-[440px]  border-r-2 border-separate flex flex-col h-[calc(100vh-70px)] overflow-y-auto bg-sidebar">
        <div className="p-3">
          <ExecutionDetailBox
            icon={CircleDashed}
            label="status"
            value={
              <div className="flex gap-2 items-center">
                <PhaseStatusBadge
                  status={execution?.status as ExecutionPhaseStatus}
                />

                {execution?.status}
              </div>
            }
          />
          <ExecutionDetailBox
            icon={Calendar}
            label="started at"
            value={
              <span>
                {execution?.startedAt
                  ? formatDistanceToNow(new Date(execution.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />

          <ExecutionDetailBox
            icon={Clock}
            label="duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionDetailBox
            icon={Coins}
            label="credits consumed"
            value={<CountUpWrapper value={creditsConsumed} />}
          />
        </div>

        <div className="border-y border-separate p-2 flex items-center justify-center gap-2 capitalize text-muted-foreground text-md font-semibold">
          <GitGraph />
          <span>phases</span>
        </div>
        <div className="p-3 flex flex-col gap-1">
          {execution?.phases.map((phase, i) => (
            <Button
              className="w-full justify-between text-start h-fit cursor-pointer"
              variant={selectedPhase === phase.id ? "secondary" : "sidebarItem"}
              key={i}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge className="size-7 rounded-sm font-semibold text-lg">
                  {i + 1}
                </Badge>
                <p className="flex-1 font-semibold">{phase.name}</p>
              </div>
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>

      <Sidebar desktopClassName="md:hidden" className="border-l">
        {/* Header / Execution details */}
        <SidebarHeader className="border-b">
          <ExecutionDetailBox
            icon={CircleDashed}
            label="status"
            value={
              <div className="flex items-center gap-2">
                <PhaseStatusBadge
                  status={execution?.status as ExecutionPhaseStatus}
                />
                <span className="capitalize">{execution?.status}</span>
              </div>
            }
          />

          <ExecutionDetailBox
            icon={Calendar}
            label="started at"
            value={
              execution?.startedAt
                ? formatDistanceToNow(new Date(execution.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />

          <ExecutionDetailBox
            icon={Clock}
            label="duration"
            value={duration ?? <Loader className="size-4 animate-spin" />}
          />

          <ExecutionDetailBox
            icon={Coins}
            label="credits consumed"
            value={<CountUpWrapper value={creditsConsumed} />}
          />
        </SidebarHeader>

        {/* Phases */}
        <SidebarContent className="p-2">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <GitGraph className="size-4" />
            <span className="uppercase tracking-wide">Phases</span>
          </div>

          <div className="flex flex-col gap-1">
            {execution?.phases.map((phase, i) => (
              <Button
                className="w-full justify-between text-start h-fit cursor-pointer"
                variant={
                  selectedPhase === phase.id ? "secondary" : "sidebarItem"
                }
                key={i}
                onClick={() => {
                  if (isRunning) return;
                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge className="size-7 rounded-sm text-base font-semibold">
                    {i + 1}
                  </Badge>
                  <span className="font-medium">{phase.name}</span>
                </div>

                <PhaseStatusBadge
                  status={phase.status as ExecutionPhaseStatus}
                />
              </Button>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
