import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Stripe from 'stripe';
import { toProduct } from '../../data/products';
import {
  createCheckoutAccessCookie,
  createCheckoutAccessToken,
} from '../../utils/checkout-session-access';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const MAX_QUANTITY = 10;
const siteUrl = process.env.SITE_URL || 'https://wemakekidsclub.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const products = (await getCollection('products')).map(({ id, data }) =>
      toProduct({ ...data, slug: id }),
    );
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

    const quantitiesByProduct = new Map<
      string,
      { product: (typeof products)[number]; quantity: number }
    >();

    for (const item of requestedItems) {
      if (
        typeof item !== 'object' ||
        item === null ||
        !('productId' in item) ||
        typeof item.productId !== 'string' ||
        !('quantity' in item) ||
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_QUANTITY
      ) {
        return Response.json({ error: `Each item must have a quantity between 1 and ${MAX_QUANTITY}` }, { status: 400 });
      }

      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        return Response.json({ error: 'One or more products are invalid' }, { status: 400 });
      }

      const quantity = (quantitiesByProduct.get(product.id)?.quantity ?? 0) + item.quantity;
      if (quantity > MAX_QUANTITY) {
        return Response.json({ error: `Each item is limited to ${MAX_QUANTITY} per order` }, { status: 400 });
      }
      quantitiesByProduct.set(product.id, { product, quantity });
    }

    const validCatalogItems = Array.from(quantitiesByProduct.values());

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'revolut_pay'],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'gbp' },
            display_name: 'Free UK launch delivery (dispatches in 3-5 working days)',
          },
        },
      ],
      line_items: validCatalogItems.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.product.name,
            images: [new URL(item.product.image, siteUrl).toString()],
            metadata: { productId: item.product.id }
          },
          unit_amount: item.product.price,
        },
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 0,
          maximum: MAX_QUANTITY,
        },
      })),
      success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/store/cart`,
    });

    const token = createCheckoutAccessToken(
      session.id,
      session.expires_at,
      import.meta.env.STRIPE_SECRET_KEY,
    );
    return Response.json(
      { url: session.url, sessionId: session.id },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Set-Cookie': createCheckoutAccessCookie(token, session.expires_at),
        },
      },
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    return Response.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
