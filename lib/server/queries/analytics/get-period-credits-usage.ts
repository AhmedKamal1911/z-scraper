"use server";
import { periodToDateRange } from "@/lib/helper-utils/dates";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import { requireAuth } from "@/lib/helper-utils/require-auth";
import prisma from "@/lib/prisma";
import { Period } from "@/lib/types/analytics";
import { ExecutionPhaseStatus } from "@/lib/types/workflow";

import { eachDayOfInterval, format } from "date-fns";
const dateFormat = "yyyy-MM-dd";
type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;
export async function getPeriodCreditsUsage(period: Period) {
  try {
    const { userId } = await requireAuth();

    const dateRange = periodToDateRange(period);
    const executionPhases = await prisma.executionPhase.findMany({
      where: {
        userId,
        startedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
        status: {
          in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
        },
      },
    });
    const stats: Stats = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    })
      .map((date) => format(date, dateFormat))
      .reduce((acc: Stats, date) => {
        acc[date] = {
          success: 0,
          failed: 0,
        };
        return acc;
      }, {});

    executionPhases.forEach((phase) => {
      const date = format(phase.startedAt!, dateFormat);
      if (phase.status === ExecutionPhaseStatus.COMPLETED) {
        stats[date].success += phase.creditsConsumed || 0;
      }
      if (phase.status === ExecutionPhaseStatus.FAILED) {
        stats[date].failed -= phase.creditsConsumed || 0;
      }
    });
    const resultData = Object.entries(stats).map(([date, data]) => ({
      date,
      ...data,
    }));
    return resultData;
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while getting your phases credits consumed."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
