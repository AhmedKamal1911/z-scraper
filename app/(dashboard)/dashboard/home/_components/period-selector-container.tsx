import PeriodSelector from "./period-selector";
import { Period } from "@/lib/types/analytics";
import { waitFor } from "@/lib/helper-utils/wait-for";
import { getPeriods } from "@/lib/server/queries/analytics/get-periods";

export default async function PeriodSelectorContainer({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await getPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}
