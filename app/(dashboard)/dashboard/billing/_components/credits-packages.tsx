"use client";
import { Store, Check, Sparkles, CreditCard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { creditsPackagesList, PackageId } from "@/lib/types/billing";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { purchaseCreditsAction } from "@/lib/server/actions/billing/purchase-credits-action";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/lib/helper-utils/format-amount";

export default function CreditsPackages() {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>(
    PackageId.MEDIUM
  );
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: purchaseCreditsAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: (sessionUrl) => {
      router.push(sessionUrl);
      toast.success("Checkout session created successfully!", {
        description: "You will be redirected to complete your payment.",
        id: "purchase-credits",
      });
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "purchase-credits",
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Store className="size-6 text-primary" />
          Credits Packages
        </CardTitle>
        <CardDescription>
          Choose the package that fits your usage
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selectedPackage}
          onValueChange={(v: PackageId) => setSelectedPackage(v)}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {creditsPackagesList.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;

            const badge =
              pkg.id === PackageId.MEDIUM
                ? "Most Popular"
                : pkg.id === PackageId.LARGE
                ? "Best Value"
                : null;

            return (
              <Label
                key={pkg.id}
                htmlFor={pkg.id}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all",
                  "hover:-translate-y-1 hover:shadow-lg",
                  isSelected
                    ? "border-primary bg-linear-to-b from-primary/5 to-transparent ring-2 ring-primary/30"
                    : "hover:border-primary/50"
                )}
              >
                <RadioGroupItem
                  value={pkg.id}
                  id={pkg.id}
                  className="sr-only"
                />

                {badge && (
                  <div className="absolute -top-3">
                    <Badge className="gap-1 px-3 py-1">
                      <Sparkles className="size-3" />
                      {badge}
                    </Badge>
                  </div>
                )}

                <h3 className="text-lg font-semibold">{pkg.name}</h3>

                <p className="font-semibold text-muted-foreground">
                  {pkg.credits.toLocaleString()} credits
                </p>

                <div className="text-3xl font-bold">
                  {formatAmount(pkg.price)}
                </div>
                <p className="text-xs text-muted-foreground">
                  One-time purchase
                </p>

                {isSelected && (
                  <Check className="absolute right-4 top-4 size-5 text-primary" />
                )}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="cursor-pointer"
          disabled={mutation.isPending}
          onClick={() => {
            if (!onlineManager.isOnline()) {
              toast.error("Check network connection", {
                id: "purchase-credits",
              });
              return;
            }
            toast.loading("Redirecting you to secure checkout…", {
              id: "purchase-credits",
            });
            mutation.mutate(selectedPackage);
          }}
        >
          <CreditCard className="size-5" />
          {mutation.isPending ? "Purchasing..." : "Purchase credits"}
        </Button>
      </CardFooter>
    </Card>
  );
}
