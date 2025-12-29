import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";
import { Period } from "../types/analytics";

export function datesToDurationString({
  completedAt,
  startedAt,
}: {
  completedAt: Date | null | undefined;
  startedAt: Date | null | undefined;
}) {
  if (!startedAt || !completedAt) return null;

  const timeElapsed = completedAt.getTime() - startedAt.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed}ms`;
  }
  const duration = intervalToDuration({ start: 0, end: timeElapsed });
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

export function periodToDateRange(period: Period) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));
  return { startDate, endDate };
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
