import PageHeader from "../_components/common/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CreditsPackages from "./_components/credits-packages";

import { BalanceCard } from "./_components/balance-card";
import { CreditsUsageCard } from "./_components/credits-usage-card";
import { TransactionsHistoryCard } from "./_components/transactions-history-card";
export const dynamic = "force-dynamic";
export default function BillingPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Billing" />
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPackages />
      <Suspense fallback={<Skeleton className="h-[300px]" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense
        fallback={<Skeleton className="w-full h-[360px] sm:h-[394px]" />}
      >
        <TransactionsHistoryCard />
      </Suspense>
    </div>
  );
}
