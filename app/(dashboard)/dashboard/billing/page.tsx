import { getUserAvailableCredits } from "@/lib/server/queries/billing/get-user-available-credits";
import PageHeader from "../_components/common/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountUpWrapper from "../_components/common/count-up-wrapper";
import { ArrowLeftRight, Coins } from "lucide-react";
import CreditsPackages from "./_components/credits-packages";
import CreditsUsageChart from "./_components/credits-usage-chart";
import { getPeriodCreditsUsage } from "@/lib/server/queries/analytics/get-period-credits-usage";
import { waitFor } from "@/lib/helper-utils/wait-for";
import { getUserTransactionsHistory } from "@/lib/server/queries/billing/get-user-transactions-history";
import UserTransactionsTable from "./_components/user-transactions-table";

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

async function BalanceCard() {
  const userBalance = await getUserAvailableCredits();
  return (
    <Card className="gap-2 bg-linear-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-4 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <CountUpWrapper value={userBalance} />
            </p>
          </div>
          <Coins
            size={140}
            className="text-primary opacity-20 absolute bottom-0 end-0"
          />
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  );
}

async function CreditsUsageCard() {
  await waitFor(3000);
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
async function TransactionsHistoryCard() {
  await waitFor(3000);

  const transactions = await getUserTransactionsHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="size-6 text-primary" />
          Transactions History
        </CardTitle>
        <CardDescription>
          Take a look on your transactions and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserTransactionsTable transactions={transactions} />
      </CardContent>
    </Card>
  );
}
