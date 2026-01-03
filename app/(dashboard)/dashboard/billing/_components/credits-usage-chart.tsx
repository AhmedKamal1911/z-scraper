"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getWorkflowExecutionStats } from "@/lib/server/queries/analytics/get-workflow-execution-stats";
import { ChartColumnIncreasing } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type Props = {
  data: Awaited<ReturnType<typeof getWorkflowExecutionStats>>;
  title: string;
  desc: string;
};

const chartConfig = {
  success: {
    label: "Success",
    color: "var(--chart-1)",
  },
  failed: {
    label: "Failed",
    color: "var(--destructive)",
  },
};
export default function CreditsUsageChart({ data, title, desc }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg min-[400]:text-2xl font-bold flex items-center gap-2">
          <ChartColumnIncreasing className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[260px]">
          <BarChart data={data} accessibilityLayer margin={{ top: 20 }}>
            <CartesianGrid />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.8}
              dataKey={"success"}
              stackId={"a"}
            />

            <Bar
              dataKey="failed"
              stroke="var(--destructive)"
              fill="var(--destructive)"
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
