import type { APIRoute } from "astro";
import Stripe from "stripe";
import { sendEmail } from "../../utils/emails";

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const POST: APIRoute = async ({ request }) => {
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET configuration");
    return Response.json({ error: "Webhook is not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature:", error);
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return Response.json({ received: true });
  }

  try {
    const completedSession = event.data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(completedSession.id, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return Response.json({ received: true, paid: false });
    }

    if (session.metadata?.order_confirmation_email_sent === "true") {
      return Response.json({ received: true, alreadySent: true });
    }

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    if (!customerEmail) {
      console.error(`Paid Checkout Session ${session.id} has no customer email`);
      return Response.json({ received: true, emailSent: false });
    }

    const currency = session.currency ?? "gbp";
    const items = session.line_items?.data ?? [];
    const itemRows = items
      .map((item) => {
        const name = escapeHtml(item.description ?? "Store item");
        const quantity = item.quantity ?? 1;
        const amount = formatAmount(item.amount_total ?? 0, currency);
        return `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${name} × ${quantity}</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">${amount}</td></tr>`;
      })
      .join("");
    const total = formatAmount(session.amount_total ?? 0, currency);

    await sendEmail({
      to: customerEmail,
      subject: "Your We Make Kids Club order is confirmed",
      headers: { "Resend-Idempotency-Key": `order-confirmation/${session.id}` },
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#252525;line-height:1.6">
          <h1 style="color:#2c5f2d">Thank you for your order!</h1>
          <p>We've received your payment. Here are your order details:</p>
          <table style="width:100%;border-collapse:collapse">
            <tbody>${itemRows}</tbody>
            <tfoot><tr><th style="padding-top:12px;text-align:left">Total paid</th><th style="padding-top:12px;text-align:right">${total}</th></tr></tfoot>
          </table>
          <p style="margin-top:24px">Your payment reference is <strong>${escapeHtml(session.id)}</strong>.</p>
          <p>We'll be in touch with any updates about your order.</p>
          <p>We Make Kids Club</p>
        </div>
      `,
    });

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        order_confirmation_email_sent: "true",
      },
    });

    return Response.json({ received: true, emailSent: true });
  } catch (error) {
    console.error("Stripe order confirmation failed:", error);
    return Response.json({ error: "Order confirmation failed" }, { status: 500 });
  }
};
