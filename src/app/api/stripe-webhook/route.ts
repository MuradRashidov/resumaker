import { env } from "@/env";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text(); // Ham veriyi al
    const sig = req.headers.get("stripe-signature") as string;
    if (!sig) {
      return new Response("No signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
      //console.log("Stripe event received: ", event.type, event.data.object);
      switch (event.type) {
        case "checkout.session.completed":
          await handleSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionCreatedOrUpdated(
            (event.data.object as Stripe.Subscription).id
          );
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      return new Response("Received", { status: 200 });
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook error: ${err.message}`, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    throw new Error("userId is missing in session metadata");
  }
//  (await clerkClient()).users.updateUserMetadata(userId, {
//    privateMetadata:{
//       stripeCustomerId: session.customer as string,
//    }
//  })
 await (
  await clerkClient()
).users
.updateUserMetadata(userId, {
  privateMetadata: {
    stripeCustomerId: session.customer as string,
  },
});
console.log("stripeCustomerId-------------------------2", session.customer);

} 

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
 if (subscription.status === "active" || subscription.status === "trialing" || subscription.status === "past_due") {
    await prisma.userSubscription.upsert({
      where:{userId:subscription.metadata?.userId as string},
      create:{
        userId:subscription.metadata?.userId as string,
        stripeCustomerId:subscription.customer as string,
        stripeSubscriptionId:subscription.id,
        stripePriceId:subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCancelAtPeriodEnd:subscription.cancel_at_period_end,
      },
      update:{
        stripePriceId:subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCancelAtPeriodEnd:subscription.cancel_at_period_end,
      },

    })
 } else {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    })
 }
}
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    })
}
