import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserTransactionsHistory } from "@/lib/server/queries/billing/get-user-transactions-history";
import { ArrowLeftRight } from "lucide-react";
import UserTransactionsTable from "./user-transactions-table";

export async function TransactionsHistoryCard() {
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
