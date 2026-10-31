import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { products } from '../../data/products';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: { lineItems?: unknown };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Request body must be valid JSON' }, { status: 400 });
    }
    const requestedItems: unknown = body?.lineItems;

    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
      return Response.json({ error: 'At least one product is required' }, { status: 400 });
    }

    const catalogItems = requestedItems.map((item: unknown) => {
      if (
        typeof item !== 'object' ||
        item === null ||
        !('productId' in item) ||
        typeof item.productId !== 'string'
      ) {
        return undefined;
      }

      return products.find((product) => product.id === item.productId);
    });

    if (catalogItems.some((item) => item === undefined)) {
      return Response.json({ error: 'One or more products are invalid' }, { status: 400 });
    }
    const validCatalogItems = catalogItems.filter(
      (item): item is (typeof products)[number] => item !== undefined,
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: validCatalogItems.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            metadata: { productId: item.id }
          },
          unit_amount: item.price,
        },
        quantity: 1,
      })),
      success_url: `${process.env.SITE_URL || 'https://wemakekidsclub.com'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'https://wemakekidsclub.com'}/store/cart`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return Response.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
