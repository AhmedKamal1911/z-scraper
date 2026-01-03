"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { datesToDurationString } from "@/lib/helper-utils/dates";
import { getWorkflowExecutions } from "@/lib/server/queries/workflows/get-workflow-executions";

import { useQuery } from "@tanstack/react-query";
import ExecutionStatusIndicator from "./execution-status-indicator";
import { WorkflowExecutionStatus } from "@/lib/types/workflow";
import { Coins, Hourglass } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>;

export default function ExecutionsTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  const router = useRouter();
  const data = query.data || [];

  return (
    <div className="relative w-full overflow-x-auto h-[80vh] rounded-xl border shadow-lg bg-background">
      <div className="max-h-full overflow-y-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <TableRow>
              <TableHead className="font-semibold text-sm">Id</TableHead>
              <TableHead className="font-semibold text-sm">Status</TableHead>
              <TableHead className="font-semibold text-sm">Consumed</TableHead>
              <TableHead className="font-semibold text-right text-xs">
                Started at
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-16 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-3 opacity-75">
                    <Hourglass size={32} />
                    <p className="text-base font-medium">
                      No workflow executions yet
                    </p>
                    <p className="text-xs">
                      Runs will appear here when triggered.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data.map((execution) => {
              const duration = datesToDurationString({
                completedAt: execution.completedAt,
                startedAt: execution.startedAt,
              });

              const startedAt =
                execution.startedAt &&
                formatDistanceToNow(execution.startedAt, {
                  addSuffix: true,
                });

              return (
                <TableRow
                  key={execution.id}
                  className="cursor-pointer transition-colors hover:bg-muted/25"
                  onClick={() =>
                    router.push(
                      `/dashboard/workflow/runs/${execution.workflowId}/${execution.id}`
                    )
                  }
                >
                  {/* ID */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{execution.id}</span>
                      <div className="text-muted-foreground text-xs flex items-center gap-1">
                        <span>Triggered by</span>
                        <Badge className="px-1.5 py-0.5" variant="outline">
                          {execution.trigger}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <ExecutionStatusIndicator
                          status={execution.status as WorkflowExecutionStatus}
                        />
                        <span className="font-semibold capitalize">
                          {execution.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4.5">
                        {duration}
                      </span>
                    </div>
                  </TableCell>

                  {/* Credits */}
                  <TableCell>
                    <div className="flex gap-2 bg-muted/60 p-2 rounded-lg w-fit">
                      <Coins className="text-primary size-6" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm">
                          {execution.creditsConsumed}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          credits
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* StartedAt */}
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {startedAt}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
