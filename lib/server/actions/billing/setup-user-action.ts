"use server";

import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import { requireAuth } from "@/lib/helper-utils/require-auth";
import prisma from "@/lib/prisma";
export async function setupUserAction() {
  try {
    const session = await requireAuth();

    const balance = await prisma.userBalance.findUnique({
      where: { userId: session.userId },
    });
    if (!balance) {
      await prisma.userBalance.create({
        data: {
          userId: session.userId,
          credits: 100,
        },
      });
    }
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "Sorry, something went wrong while setting up your account. Please try again."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }
    throw new Error("Internal Server Error");
  }
}
