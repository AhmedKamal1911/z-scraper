import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function ExecutionDetailBox({
  value,
  icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center text-sm px-2 py-3">
      <div className=" flex items-center gap-2 capitalize">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize">{value}</div>
    </div>
  );
}
