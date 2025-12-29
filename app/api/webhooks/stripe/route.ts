import { handleCheckoutSessionCompleted } from "@/lib/stripe/handle-checkout-session-completed";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature: string = (await headers()).get("stripe-signature")!;
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        handleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("stripe webhook error", error);
    return new NextResponse("stripe webhook error", { status: 400 });
  }
}
