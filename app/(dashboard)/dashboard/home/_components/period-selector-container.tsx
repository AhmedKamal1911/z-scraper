import PeriodSelector from "./period-selector";
import { Period } from "@/lib/types/analytics";
import { getPeriods } from "@/lib/server/queries/analytics/get-periods";

export default async function PeriodSelectorContainer({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await getPeriods();
  if (periods.length)
    return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
  return null;
}
