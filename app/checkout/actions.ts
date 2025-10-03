"use server";

import { z } from 'zod';
import { createCheckoutSession } from '@/_lib/api/checkout';
import { headers } from 'next/headers';

const Schema = z.object({
  phone: z.string().min(5),
  email: z.string().email(),
  plan_id: z.string().min(1),
  interval: z.enum(['monthly', 'yearly']),
  success_url: z.string().url().optional(),
});

export async function createCheckoutSessionAction(formData: FormData) {
  const payload = {
    phone: String(formData.get('phone') || ''),
    email: String(formData.get('email') || ''),
    plan_id: String(formData.get('plan_id') || ''),
    interval: String(formData.get('interval') || 'monthly'),
    success_url: String(formData.get('success_url') || ''),
  } as any;

  try {
    const parsed = Schema.safeParse(payload);
    if (!parsed.success) {
      // compute default success_url if missing or invalid
      const h = headers();
      const proto = h.get('x-forwarded-proto') || 'http';
      const host = h.get('host') || 'localhost:3000';
      const origin = h.get('origin') || `${proto}://${host}`;
      const fallback = `${origin}/payment-sucess`;
      const recovered = {
        phone: payload.phone,
        email: payload.email,
        plan_id: payload.plan_id,
        interval: payload.interval,
        success_url: fallback,
      } as any;
      const recheck = Schema.safeParse(recovered);
      if (!recheck.success) {
        return { ok: false as const, error: 'Invalid data' };
      }
      const { url } = await createCheckoutSession(recheck.data);
      return { ok: true as const, url };
    }

    const { url } = await createCheckoutSession(parsed.data);
    return { ok: true as const, url };
  } catch (err: any) {
    const msg = typeof err?.message === 'string' ? err.message : 'Checkout error';
    return { ok: false as const, error: msg };
  }
}

