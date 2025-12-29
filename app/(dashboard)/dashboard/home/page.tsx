import { Suspense } from "react";
import PeriodSelectorContainer from "./_components/period-selector-container";
import { Period } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "../_components/common/page-header";
import StatsCardsContainer, {
  StatsCardsSkeleton,
} from "./_components/stats-cards-container";

import { getWorkflowExecutionStats } from "@/lib/server/queries/analytics/get-workflow-execution-stats";
import { waitFor } from "@/lib/helper-utils/wait-for";

import ExecutionStatusChart from "./_components/charts/execution-status-chart";

import { getPeriodCreditsUsage } from "@/lib/server/queries/analytics/get-period-credits-usage";
import CreditsUsageChart from "../billing/_components/credits-usage-chart";
type Props = {
  searchParams: Promise<{ month?: string; year?: string }>;
};
export default async function HomePage({ searchParams }: Props) {
  const { month, year } = await searchParams;

  const now = new Date();

  const period: Period = {
    month: Number(month ?? now.getUTCMonth()),
    year: Number(year ?? now.getUTCFullYear()),
  };
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Home" />
        <Suspense fallback={<Skeleton className="w-[180px] h-10" />}>
          <PeriodSelectorContainer selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCardsContainer selectedPeriod={period} />
        </Suspense>

        <Suspense
          fallback={<Skeleton className="w-full h-[360px] sm:h-[394px]" />}
        >
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="w-full h-[360px] sm:h-[394px]" />}
        >
          <PeriodCreditsUsage selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getWorkflowExecutionStats(selectedPeriod);

  return <ExecutionStatusChart data={data} />;
}

async function PeriodCreditsUsage({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getPeriodCreditsUsage(selectedPeriod);
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      desc="Daily credits consumed in selected period"
    />
  );
}
