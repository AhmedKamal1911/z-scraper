"use server";
import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import { requireAuth } from "@/lib/helper-utils/require-auth";
import prisma from "@/lib/prisma";

export async function getUserTransactionsHistory() {
  try {
    const session = await requireAuth();
    const transactions = await prisma.userTransaction.findMany({
      where: { userId: session.userId },
      orderBy: {
        date: "desc",
      },
    });
    return transactions;
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while fetching your transactions."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
