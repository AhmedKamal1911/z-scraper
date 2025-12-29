"use server";

import {
  isErrorType,
  isPrismaError,
} from "@/lib/helper-utils/error-type-guards";
import { getPublicUrl } from "@/lib/helper-utils/get-public-url";
import { requireAuth } from "@/lib/helper-utils/require-auth";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPackage, PackageId } from "@/lib/types/billing";

export async function purchaseCreditsAction(pkgId: PackageId): Promise<string> {
  try {
    const session = await requireAuth();
    const selectedPackage = getCreditsPackage(pkgId);
    if (!selectedPackage) {
      throw new Error("Invalid credits package selected.");
    }
    const priceId = selectedPackage.priceId;
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      invoice_creation: {
        enabled: true,
      },
      success_url: getPublicUrl("/dashboard/billing"),
      cancel_url: getPublicUrl("/dashboard/billing"),
      metadata: {
        userId: session.userId,
        pkgId,
      },
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
    });
    if (!stripeSession.url) {
      throw new Error("Unable to create checkout session. Please try again.");
    }
    return stripeSession.url;
  } catch (error) {
    if (isPrismaError(error)) {
      throw new Error(
        "We couldn't prepare your purchase at the moment. Please try again later."
      );
    }
    if (isErrorType(error)) {
      throw new Error(error.message);
    }

    throw new Error(
      "Unexpected error occurred while starting checkout. Please try again."
    );
  }
}
