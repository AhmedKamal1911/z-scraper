import "server-only";
import Stripe from "stripe";
import { getCreditsPackage, PackageId } from "../types/billing";
import prisma from "../prisma";
import { stripe } from "./stripe";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("Missing user id");
  }
  const { userId, pkgId } = event.metadata;
  if (!userId) {
    throw new Error("Missing user id");
  }
  if (!pkgId) {
    throw new Error("Missing user id");
  }
  const purchasePackage = getCreditsPackage(pkgId as PackageId);
  if (!purchasePackage) {
    throw new Error("Purchase package not found");
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: { userId, credits: purchasePackage.credits },
    update: { credits: { increment: purchasePackage.credits } },
  });

  console.log("after upsert userbalance");

  const transaction = await prisma.userTransaction.create({
    data: {
      userId,
      stripeId: event.id,
      amount: event.amount_total!,
      currency: event.currency!,
      description: `${purchasePackage.name} - ${purchasePackage.credits} credits`,
    },
  });
  console.log("after transaction create");
  if (event.invoice && typeof event.invoice === "string") {
    const invoice = await stripe.invoices.retrieve(event.invoice);
    const invoiceUrl = invoice.hosted_invoice_url || null;

    if (invoiceUrl) {
      await prisma.userTransaction.update({
        where: { id: transaction.id },
        data: { invoiceUrl },
      });
      console.log("after update user transaction");
    }
  }
}
