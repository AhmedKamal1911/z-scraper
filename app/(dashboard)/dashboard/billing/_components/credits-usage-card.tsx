import { getPeriodCreditsUsage } from "@/lib/server/queries/analytics/get-period-credits-usage";
import CreditsUsageChart from "./credits-usage-chart";

export async function CreditsUsageCard() {
  const period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await getPeriodCreditsUsage(period);
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      desc="Daily credits consumed this month"
    />
  );
}
