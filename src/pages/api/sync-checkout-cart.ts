import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import {
  CHECKOUT_ACCESS_COOKIE,
  verifyCheckoutAccessToken,
} from '../../utils/checkout-session-access';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const checkoutSessionIdPattern = /^cs_(test|live)_[A-Za-z0-9]+$/;

export const GET: APIRoute = async ({ url, cookies }) => {
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId || !checkoutSessionIdPattern.test(sessionId)) {
    return Response.json({ error: 'A valid Checkout Session ID is required' }, { status: 400 });
  }
  if (
    !verifyCheckoutAccessToken(
      cookies.get(CHECKOUT_ACCESS_COOKIE)?.value,
      sessionId,
      import.meta.env.STRIPE_SECRET_KEY,
    )
  ) {
    return Response.json({ error: 'Checkout session access could not be verified' }, { status: 403 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    });
    if (session.status !== 'open' || session.mode !== 'payment') {
      return Response.json({ error: 'This checkout session is no longer open' }, { status: 404 });
    }

    const items = (session.line_items?.data ?? []).flatMap((item) => {
      const product = item.price?.product;
      if (
        typeof product !== 'object' ||
        'deleted' in product ||
        !product.metadata.productId ||
        !item.quantity ||
        item.quantity < 1
      ) {
        return [];
      }

      return [{ productId: product.metadata.productId, quantity: item.quantity }];
    });

    return Response.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not sync cart from Stripe Checkout:', error);
    return Response.json({ error: 'Could not sync your cart from checkout' }, { status: 500 });
  }
};
