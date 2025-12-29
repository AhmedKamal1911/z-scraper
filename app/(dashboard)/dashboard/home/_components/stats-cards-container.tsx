import { getStatsCardsData } from "@/lib/server/queries/analytics/get-stats-cards-data";
import { Period } from "@/lib/types/analytics";
import StatsCard from "./stats-card";
import { CirclePlay, Coins, Waypoints } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper-utils/wait-for";

export default async function StatsCardsContainer({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getStatsCardsData(selectedPeriod);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <StatsCard
        icon={CirclePlay}
        title={"workflow executions"}
        value={data.workflowExecutions}
      />
      <StatsCard
        icon={Waypoints}
        title={"phase executions"}
        value={data.phaseExecutions}
      />
      <div className="md:col-span-2 lg:col-span-1">
        <StatsCard
          icon={Coins}
          title={"credits consumed"}
          value={data.creditsConsumed}
        />
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <Skeleton className="h-32" />

      <Skeleton className="h-32" />

      <div className="md:col-span-2 lg:col-span-1">
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
