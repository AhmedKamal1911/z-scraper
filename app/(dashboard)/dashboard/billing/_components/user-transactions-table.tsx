"use client";

import React from "react";
import { UserTransaction } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ExternalLink } from "lucide-react";
import { formatAmount } from "@/lib/helper-utils/format-amount";
import { formatDate } from "@/lib/helper-utils/dates";

type Props = {
  transactions: UserTransaction[];
};

export default function UserTransactionsTable({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-[400px]:p-12 text-center text-muted-foreground border rounded-xl bg-muted/10 shadow-md overflow-hidden">
        <div className="relative flex items-center justify-center mb-6 w-20 h-20 rounded-full animate-bounce-slow">
          <div className="absolute inset-0 rounded-full bg-primary/35 blur-xl"></div>

          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-primary/15">
            <ArrowLeftRight className="text-primary size-8" />
          </div>
        </div>
        <p className="mb-2 text-xl font-semibold leading-snug">
          No transactions yet
        </p>
        <p className="text-sm max-w-xs leading-relaxed text-muted-foreground">
          You haven’t made any purchases or received credits yet. All your
          transactions will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/15">
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell>{formatAmount(tx.amount, tx.currency)}</TableCell>
              <TableCell>{tx.currency.toUpperCase()}</TableCell>
              <TableCell>
                {tx.invoiceUrl ? (
                  <Button size="icon" variant="ghost" asChild>
                    <a href={tx.invoiceUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="ml-1 size-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
