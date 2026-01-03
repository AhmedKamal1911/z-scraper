"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Coins, Loader } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import CountUpWrapper from "@/app/(dashboard)/dashboard/_components/common/count-up-wrapper";
import { getUserAvailableCredits } from "@/lib/server/queries/billing/get-user-available-credits";

export default function UserAvailableCreditsBadge() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: getUserAvailableCredits,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const displayValue = isLoading ? (
    <Loader className="size-5 animate-spin" />
  ) : data ? (
    <CountUpWrapper value={data} />
  ) : (
    "0"
  );

  return (
    <Link
      href="/dashboard/billing"
      className={cn(
        "w-full space-x-2",
        buttonVariants({
          variant: "ghost",
          className: "h-fit! p-1!",
        })
      )}
    >
      <div className="flex items-center justify-center bg-primary/10 p-2 rounded-lg">
        <Coins className="size-5 text-primary" />
      </div>
      <div className="flex flex-col gap-1 leading-tight">
        <span className="text-xs text-muted-foreground">Available Credits</span>
        <span className="font-bold">{displayValue}</span>
      </div>
    </Link>
  );
}
