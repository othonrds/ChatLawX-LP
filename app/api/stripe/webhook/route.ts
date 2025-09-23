import { headers } from 'next/headers';
import { getStripe } from '@/_lib/stripe/server';
import { env } from '@/_lib/env';
import { createLogger, getRequestIdFromHeaders } from '@/_lib/_observability/logger';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const requestId = getRequestIdFromHeaders(new Headers(req.headers));
  const logger = createLogger(requestId);
  const stripe = getStripe();
  const sig = headers().get('stripe-signature');
  if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
    logger.warn('stripe_webhook_missing_sig_or_secret');
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    logger.error('stripe_webhook_construct_error', { message: err.message });
    return new Response('Webhook Error', { status: 400 });
  }

  logger.info('stripe_webhook_event', { type: event.type, id: event.id });

  return new Response('ok', { status: 200 });
}

