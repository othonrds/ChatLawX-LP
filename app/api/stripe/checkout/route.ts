import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/_lib/env';
import { getStripe } from '@/_lib/stripe/server';
import { createLogger, getRequestIdFromHeaders } from '@/_lib/_observability/logger';

export const runtime = 'nodejs';

const BodySchema = z.object({
  priceId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export async function POST(req: NextRequest) {
  const requestId = getRequestIdFromHeaders(req.headers);
  const logger = createLogger(requestId);
  const json = await req.json().catch(() => ({}));
  const parse = BodySchema.safeParse(json);
  if (!parse.success) {
    logger.warn('stripe_checkout_invalid_body');
    return NextResponse.json({ error: 'Invalid body', requestId }, { status: 400 });
  }
  const { priceId, quantity } = parse.data;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/?success=1`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/?canceled=1`,
    });
    logger.info('stripe_checkout_created', { sessionId: session.id });
    return NextResponse.json({ id: session.id, url: session.url, requestId });
  } catch (err: any) {
    logger.error('stripe_checkout_error', { message: err?.message ?? 'Stripe error' });
    return NextResponse.json({ error: 'Stripe error', requestId }, { status: 500 });
  }
}

