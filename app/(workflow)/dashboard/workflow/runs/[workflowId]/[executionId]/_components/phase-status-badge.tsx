import { ExecutionPhaseStatus } from "@/lib/types/workflow";
import {
  CircleCheck,
  CircleDashedIcon,
  CircleX,
  LoaderCircle,
} from "lucide-react";

export default function PhaseStatusBadge({
  status,
}: {
  status: ExecutionPhaseStatus;
}) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon className="stroke-muted-foreground size-5" />;

    case ExecutionPhaseStatus.RUNNING:
      return <LoaderCircle className="animate-spin stroke-yellow-500 size-5" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleX className="stroke-destructive size-5" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheck className="stroke-green-500 size-5" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
