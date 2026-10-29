# Stripe API Keys Setup

## Getting Your Stripe Account

1. Go to [Stripe.com](https://stripe.com) and create an account (free)
2. Once logged in, navigate to **Developers** > **API keys**

## Add Your API Keys

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_YourPublishableKeyHere
STRIPE_SECRET_KEY=sk_live_YourSecretKeyHere
STRIPE_WEBHOOK_SECRET=whsec_YourWebhookSigningSecretHere
RESEND_API_KEY=re_YourResendApiKeyHere
SEND_EMAIL_FROM=We Make Kids Club <orders@your-verified-domain.com>
SITE_URL=https://wemakekidsclub.com
```

`SEND_EMAIL_FROM` must use a sender domain verified in Resend. The Stripe webhook signing secret is separate from your Stripe API keys.

## Test Mode vs Live Mode

### Development (Test Mode)
- Use `pk_test_` and `sk_test_` keys
- Test with Stripe test cards: 4242 4242 4242 4242
- Test transactions won't charge real money
- Visit your Stripe Dashboard to find test keys

### Production (Live Mode)
- Use `pk_live_` and `sk_live_` keys
- Will process real payments
- Make sure your website URL matches your domain in Stripe settings

## Important Notes

1. **Never commit `.env` to Git** - Add it to `.gitignore` if not already
2. **Keep keys secure** - Store environment variables securely
3. **Webhooks (Optional)**: For order status updates, you'll need webhook configuration in Stripe Dashboard
4. **Test thoroughly**: Always test in test mode before going live

## Testing

- Use [Stripe Test Cards](https://stripe.com/docs/testing#cards) for testing
- Common test card: `4242 4242 4242 4242`, any future date, any CVC
- Verify email notifications are working (check Stripe Dashboard settings)

## Managing Store Products

Products are managed in Tina CMS under **Store Products**. From `/admin`, you can add,
edit, remove, and reorder products. Prices are entered in pence (for example, `2499`
for £24.99), and product images can be selected from the CMS media library. Keep an
existing product ID unchanged to preserve saved cart items. Tina saves these changes
to the repository; redeploy the site for product and price changes to take effect.

## Purchase Confirmation Webhook

The app sends an order confirmation email through Resend after Stripe confirms a Checkout Session is paid. Configure the webhook so Stripe can notify the app:

1. In Stripe Dashboard, open **Developers** > **Webhooks** and add an endpoint for `https://wemakekidsclub.com/api/stripe-webhook`.
2. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
3. Reveal the endpoint's signing secret and set it as `STRIPE_WEBHOOK_SECRET` in the production environment. Also set `RESEND_API_KEY` and a verified `SEND_EMAIL_FROM` address.
4. Redeploy after setting the environment variables.

For local testing, install and authenticate the Stripe CLI, then run:

```bash
stripe listen --forward-to localhost:4321/api/stripe-webhook
```

Use the `whsec_...` secret printed by the CLI as your local `STRIPE_WEBHOOK_SECRET`. Stripe retries failed deliveries; the handler verifies signatures, checks payment status, and uses Resend idempotency to avoid duplicate confirmations.

## Next Steps After Setup

1. Visit `/store` to browse products
2. Add items to cart and test checkout flow
3. Check your Stripe Dashboard for successful orders
4. Configure webhook URL in Stripe Dashboard (optional but recommended)
