import "server-only";
import Stripe from "stripe";
import { getCreditsPackage, PackageId } from "../types/billing";
import prisma from "../prisma";
import { stripe } from "./stripe";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    console.log("Missing user id @HANDLE-checkout-session", event.metadata);
    throw new Error("Missing user id");
  }
  const { userId, pkgId } = event.metadata;
  if (!userId) {
    console.log("Missing user id @HANDLE-checkout-session", userId);
    throw new Error("Missing user id");
  }
  if (!pkgId) {
    console.log("Missing pkg id @HANDLE-checkout-session", pkgId);
    throw new Error("Missing pkg id");
  }
  const purchasePackage = getCreditsPackage(pkgId as PackageId);
  if (!purchasePackage) {
    console.log(
      "Purchase package not found @HANDLE-checkout-session",
      purchasePackage
    );
    throw new Error("Purchase package not found");
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: { userId, credits: purchasePackage.credits },
    update: { credits: { increment: purchasePackage.credits } },
  });
  console.log("USER BALANCE UPSERT SUCCESS @HANDLE-checkout-session");

  const transaction = await prisma.userTransaction.create({
    data: {
      userId,
      stripeId: event.id,
      amount: event.amount_total!,
      currency: event.currency!,
      description: `${purchasePackage.name} - ${purchasePackage.credits} credits`,
    },
  });
  console.log(
    "USER TRANSACTION CREATED SUCCESS @HANDLE-checkout-session",
    transaction
  );
  if (event.invoice && typeof event.invoice === "string") {
    const invoice = await stripe.invoices.retrieve(event.invoice);
    const invoiceUrl = invoice.hosted_invoice_url || null;

    if (invoiceUrl) {
      console.log(
        "TRANSACTION INVOICE URL CREATED SUCCESS @HANDLE-checkout-session",
        invoiceUrl
      );
      await prisma.userTransaction.update({
        where: { id: transaction.id },
        data: { invoiceUrl },
      });
      console.log(
        "TRANSACTION INVOICE URL ADDED SUCCESS @HANDLE-checkout-session",
        invoiceUrl
      );
    }
  }
}
