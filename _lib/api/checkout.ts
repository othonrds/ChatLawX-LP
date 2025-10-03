import { getApiBaseUrl } from './plans';
import { env } from '@/_lib/env';

export type CreateCheckoutPayload = {
  phone: string;
  email: string;
  plan_id: string;
  interval: 'monthly' | 'yearly';
  success_url?: string;
};

export async function createCheckoutSession(payload: CreateCheckoutPayload): Promise<{ url: string }> {
  const base = getApiBaseUrl();
  if (!env.TOKEN_API) {
    throw new Error('Missing TOKEN_API environment variable');
  }
  const res = await fetch(`${base}/external/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-external-token': env.TOKEN_API,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Checkout API error: ${res.status} ${text ? `- ${text}` : ''}`.trim());
  }
  const json = await res.json().catch(() => ({}));
  const url = (json?.url as string) || (json?.checkout_url as string) || (json?.data?.checkout_url as string);
  if (!url) throw new Error('Checkout API did not return checkout_url');
  return { url };
}

