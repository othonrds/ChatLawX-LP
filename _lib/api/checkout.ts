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
  const res = await fetch(`${base}/external/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-external-token': env.TOKEN_API || '',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Checkout API error: ${res.status}`);
  const json = await res.json();
  if (!json?.url) throw new Error('Checkout API did not return url');
  return { url: json.url as string };
}

