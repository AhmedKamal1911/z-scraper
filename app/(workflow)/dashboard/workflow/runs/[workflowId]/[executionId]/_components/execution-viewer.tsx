"use client";

import { Badge } from "@/components/ui/badge";

import { getUserWorkflowExecutionWithPhases } from "@/lib/queries/workflow/get-user-workflow-execution-with-phases";
import { getWorkflowExecution } from "@/lib/server/queries/workflows/get-workflow-execution";
import { WorkflowExecutionStatus } from "@/lib/types/workflow";

import { useQuery } from "@tanstack/react-query";
import { Clock, DollarSign, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import { datesToDurationString } from "@/lib/helper-utils/dates";
import { getPhasesTotalCost } from "@/lib/helper-utils/get-phases-total-cost";
import { getWorkflowPhaseDetails } from "@/lib/server/queries/workflows/get-workflow-phase-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ExecutionViewerAside } from "./execution-viewer-sidebar";

export type ExecutionWithPhases = Awaited<
  ReturnType<typeof getUserWorkflowExecutionWithPhases>
>;
type Props = {
  initialData: ExecutionWithPhases;
};

export default function ExecutionViewer({ initialData }: Props) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    queryFn: async () => getWorkflowExecution(initialData!.id),
    initialData,
    refetchOnWindowFocus: false,
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 3000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase, query.data?.status],
    enabled: selectedPhase !== null,
    refetchOnWindowFocus: false,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
  });
  const duration = datesToDurationString({
    completedAt: query.data?.completedAt,
    startedAt: query.data?.startedAt,
  });
  const creditsConsumed = getPhasesTotalCost({
    phases: query.data?.phases || [],
  });

  const isRunning =
    query.data?.status === WorkflowExecutionStatus.RUNNING ||
    phaseDetails.isFetching;
  const isPhaseFetching = phaseDetails.isFetching;
  useEffect(() => {
    if (selectedPhase !== null) return;

    const phases = query.data?.phases ?? [];
    if (phases.length === 0) return;

    const key = isRunning ? "startedAt" : "completedAt";

    const sorted = phases
      .filter((p) => p[key])
      .toSorted((a, b) => (a[key]! > b[key]! ? -1 : 1));

    if (sorted.length > 0) {
      setSelectedPhase(sorted[0].id);
    }
  }, [isRunning, query.data?.phases, selectedPhase]);

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <ExecutionViewerAside
          isRunning={isRunning}
          duration={duration}
          creditsConsumed={creditsConsumed}
          selectedPhase={selectedPhase}
          setSelectedPhase={setSelectedPhase}
          execution={query.data}
        />
        <div className="flex-1 overflow-hidden bg-background p-0 py-3 border-r border-r-muted">
          {isRunning || isPhaseFetching ? (
            <ExecutionRunningLoader />
          ) : (
            !selectedPhase && !isPhaseFetching && <NoPhaseSelected />
          )}
          {!isRunning &&
            !isPhaseFetching &&
            selectedPhase &&
            phaseDetails.data && (
              <div className="container">
                <div className="flex flex-col gap-3">
                  <div className="flex-wrap flex items-center gap-2">
                    <Badge
                      variant={"outline"}
                      className="capitalize gap-3 text-sm sm:text-md h-fit p-2"
                    >
                      <div className="flex gap-1">
                        <DollarSign
                          size={20}
                          className="stroke-muted-foreground"
                        />
                        <span>credits</span>
                      </div>
                      <span>{phaseDetails.data.creditsConsumed}</span>
                    </Badge>
                    <Badge
                      variant={"outline"}
                      className="capitalize gap-3 text-sm sm:text-md h-fit p-2"
                    >
                      <div className="flex gap-1">
                        <Clock size={20} className="stroke-muted-foreground" />
                        <span>duration</span>
                      </div>
                      <span>{duration}</span>
                    </Badge>
                    <SidebarTrigger
                      variant={"default"}
                      className="md:hidden"
                      size={"icon"}
                    />
                  </div>

                  <ParamsViewer
                    title="inputs"
                    subTitle="phase related inputs"
                    paramsJson={phaseDetails.data.inputs}
                  />
                  <ParamsViewer
                    title="outputs"
                    subTitle="phase related outputs"
                    paramsJson={phaseDetails.data.outputs}
                  />
                  {phaseDetails.data.executionLogs.length !== 0 && (
                    <LogsViewer logs={phaseDetails.data.executionLogs} />
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </SidebarProvider>
  );
}

function ParamsViewer({
  title,
  subTitle,
  paramsJson,
}: {
  title: string;
  subTitle: string;
  paramsJson: string | null;
}) {
  const inputs = paramsJson ? JSON.parse(paramsJson) : undefined;

  return (
    <Card className="pt-0 shadow-lg overflow-hidden capitalize">
      <CardHeader className="border-b bg-secondary/30 max-[300px]:p-3 py-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subTitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="max-[400px]:px-2 py-3">
        <div className="flex flex-col gap-3">
          {!inputs || Object.keys(inputs).length === 0 ? (
            <p className="text-sm font-medium text-muted-foreground">
              No params in this phase
            </p>
          ) : (
            Object.entries(inputs).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <p className="text-sm text-muted-foreground sm:w-1/3">{key}</p>

                <Input readOnly className="sm:w-2/3" value={String(value)} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function LogsViewer({ logs }: { logs: ExecutionLog[] }) {
  return (
    <Card className="pt-0 w-full flex flex-col shadow-lg overflow-hidden capitalize">
      <CardHeader className="border-b bg-secondary/30 py-3">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Logs related to this phase
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="whitespace-nowrap min-w-[650px]">
            <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur text-muted-foreground text-sm">
              <TableRow>
                <TableHead className="w-[190px]">Time</TableHead>
                <TableHead className="w-20">Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No logs available
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="text-muted-foreground hover:bg-muted/10 transition"
                  >
                    <TableCell className="text-xs p-1 pl-2">
                      {log.timestamp.toISOString()}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "uppercase text-xs font-bold p-1 pl-2",
                        log.logLevel === "error" && "text-destructive",
                        log.logLevel === "info" && "text-primary"
                      )}
                    >
                      {log.logLevel}
                    </TableCell>

                    <TableCell className="text-sm p-1 pl-2 max-w-[600px] whitespace-normal">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function NoPhaseSelected() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
      <MousePointerClick className="size-8 text-primary" />
      <p className="text-xl italic font-bold capitalize">
        no phase selected yet
      </p>
      <span className="text-sm text-muted-foreground">
        Select a phase to view its details.
      </span>
    </div>
  );
}
function ExecutionRunningLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <span className="text-sm capitalize text-muted-foreground animate-pulse">
          run is in progress, please wait...
        </span>
      </div>
    </div>
  );
}
