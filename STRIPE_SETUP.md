# Stripe Checkout and Order Email Setup

The store creates Stripe Checkout Sessions on the server from the product
catalog in Tina CMS. It does not use Stripe.js or the Stripe publishable key,
and you do not need to create products or prices separately in Stripe.

## Configuration

Set these variables in the deployment environment (Vercel Project Settings >
Environment Variables):

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Required for Checkout Sessions and to verify the payment status shown on the thank-you page. Use a test-mode key for testing and a live-mode key for real payments. |
| `STRIPE_WEBHOOK_SECRET` | Required for order confirmation emails. Verifies webhook requests; use a separate `whsec_...` secret for each webhook endpoint and Stripe mode. |
| `RESEND_API_KEY` | Required for order confirmation emails. Authenticates SMTP sending through Resend. |
| `SEND_EMAIL_FROM` | Required for order confirmation emails. Sender address, for example `We Make Kids Club <orders@wemakekidsclub.com>`. The domain must be verified in Resend. |

`SITE_URL` is optional. The checkout route defaults to
`https://wemakekidsclub.com`. Set it when testing a deployment on another
domain so Stripe returns to that deployment after checkout.

`STRIPE_PUBLISHABLE_KEY` is not currently used by the store checkout. The
server creates the Checkout Session and redirects the customer to Stripe.

For local development, copy `.env.example` to `.env` and use test-mode values.
Never commit `.env` or expose secret keys in browser code.

## Test before accepting live payments

Use a Vercel Preview deployment or local development with Stripe test-mode
credentials before enabling live payments:

1. Set `STRIPE_SECRET_KEY` to a test-mode secret key.
2. Set `RESEND_API_KEY` and a verified `SEND_EMAIL_FROM` address if you want to
   test order confirmation emails.
3. Configure a test-mode webhook endpoint and use its signing secret as
   `STRIPE_WEBHOOK_SECRET`.
4. If testing on a Preview deployment, set `SITE_URL` to that deployment's URL.
5. Complete a test checkout using a Stripe test card, such as
   `4242 4242 4242 4242`, with any future expiry date and CVC.
6. Confirm the order on the Stripe Dashboard, the thank-you page, and the
   recipient's email inbox. Check Vercel function logs and Stripe Workbench
   webhook deliveries if something fails.

For local webhook testing, install and authenticate the Stripe CLI, then run:

```bash
stripe listen --forward-to localhost:4321/api/stripe-webhook
```

Use the `whsec_...` value printed by the CLI as the local
`STRIPE_WEBHOOK_SECRET`. This is not the same secret as a Dashboard endpoint's
signing secret.

## Configure the production webhook

The webhook sends the purchase confirmation email. Without it, checkout can
still redirect to the thank-you page, but the server will not send the order
email.

1. Deploy the site and confirm the production domain is serving the current
   version.
2. In Stripe Workbench, create an event destination for **Your account** with
   the endpoint URL `https://wemakekidsclub.com/api/stripe-webhook`.
3. Select **Snapshot** as the payload format. The current handler uses Stripe's
   snapshot event parser; it does not handle thin events.
4. Subscribe to `checkout.session.completed` and
   `checkout.session.async_payment_succeeded`.
5. Reveal and copy the endpoint's `whsec_...` signing secret into the
   production `STRIPE_WEBHOOK_SECRET` variable in Vercel.
6. Add the live `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, and verified
   `SEND_EMAIL_FROM` as Vercel production environment variables. Set `SITE_URL`
   to `https://wemakekidsclub.com` if using a different redirect domain.
7. Redeploy so the production functions receive the new environment variables.

Test and live mode have separate Stripe API keys and webhook signing secrets.
Create the webhook destination in the matching mode and never mix test and live
credentials. Stripe webhook secrets are per endpoint.

## Live smoke test

After the live keys and live webhook secret are configured and redeployed:

1. Visit `/store`, add a product, and check out with a real payment method.
   Live-mode Checkout charges real money.
2. Confirm Stripe records the payment and the webhook delivery succeeds.
3. Confirm the thank-you page verifies the payment and the order email arrives.
4. If the purchase was only a smoke test, refund it from Stripe.

For a no-charge end-to-end test against a deployed site, use a Preview
deployment with test-mode Stripe keys and a test-mode webhook instead.

## Store catalog

Products are managed in Tina CMS under **Store Products**. Prices are entered
in pence (for example, `2499` for £24.99). Checkout uses the server-side catalog
for names and prices, so changes take effect after the site is redeployed. Keep
an existing product ID unchanged to preserve saved cart items.

## Other site emails and forms

Newsletter and party-enquiry forms also use `RESEND_API_KEY` and
`SEND_EMAIL_FROM`. Newsletter subscriptions additionally require the Google
Sheets service-account configuration used by `src/utils/sheet.ts`:
`GCP_SERVICE_ACCOUNT_EMAIL`, `GCP_PRIVATE_KEY`, `GCP_PROJECT_ID`,
`GOOGLE_SHEETS_ID`, and `WRITE_GOOGLE_SHEETS_RANGE`. `RECAPTCHA_SECRET_KEY` is
optional in the current form handlers; when set, form submissions must include
a valid reCAPTCHA token.
