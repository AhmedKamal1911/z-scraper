import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getUserAvailableCredits } from "@/lib/server/queries/billing/get-user-available-credits";
import CountUpWrapper from "../../_components/common/count-up-wrapper";
import { Coins } from "lucide-react";

export async function BalanceCard() {
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
