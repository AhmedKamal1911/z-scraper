import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import CountUpWrapper from "../../_components/common/count-up-wrapper";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;
};
export default function StatsCard({ icon, title, value }: Props) {
  const StatIcon = icon;
  return (
    <Card className="relative overflow-hidden gap-2 min-h-[126px]">
      <CardHeader>
        <CardTitle className="capitalize text-xl">{title}</CardTitle>
        <StatIcon
          size={120}
          className="stroke-primary text-muted-foreground absolute -bottom-4 -right-8 opacity-15"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <CountUpWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
}
