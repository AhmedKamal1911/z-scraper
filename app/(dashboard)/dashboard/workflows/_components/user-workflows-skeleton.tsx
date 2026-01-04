import { Skeleton } from "@/components/ui/skeleton";

export default function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[166px] w-full bg-gray-200" />
      ))}
    </div>
  );
}
