import crypto from 'crypto';
import { env } from '@/_lib/env';

// Conversions API per docs:
// https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/
const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/v22.0';

export type MetaEventInput = {
  event_name: string;
  event_time?: number; // seconds since epoch
  event_source_url?: string;
  action_source?: string; // 'website' default
  event_id?: string; // for de-duplication
  user_data?: {
    em?: string[]; // emails (raw or sha256)
    ph?: string[]; // phones (raw or sha256, E.164 recommended)
    external_id?: string[]; // (raw or sha256)
    client_user_agent?: string;
    client_ip_address?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: Record<string, unknown>;
  test_event_code?: string; // optional test delivery
};

export function hashSha256(value: string): string {
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function sendMetaEvent(input: MetaEventInput) {
  const pixelId = env.META_PIXEL_ID;
  const accessToken = env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return { ok: false, error: 'Meta CAPI não configurado (variáveis de ambiente ausentes).' } as const;
  }

  // Per docs, emails/phones/external_id must be SHA-256 hashed, lowercase, trimmed
  const maybeHashArray = (arr?: string[]) =>
    Array.isArray(arr)
      ? arr.map((v) => {
          const val = (v || '').trim().toLowerCase();
          const isHashed = /^[a-f0-9]{64}$/i.test(val);
          return isHashed ? val : hashSha256(val);
        })
      : undefined;

  const user_data = {
    em: maybeHashArray(input.user_data?.em),
    ph: maybeHashArray(input.user_data?.ph),
    external_id: maybeHashArray(input.user_data?.external_id),
    client_user_agent: input.user_data?.client_user_agent,
    client_ip_address: input.user_data?.client_ip_address,
    fbc: input.user_data?.fbc,
    fbp: input.user_data?.fbp,
  };

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.event_name,
        event_time: input.event_time ?? Math.floor(Date.now() / 1000),
        action_source: input.action_source ?? 'website',
        event_source_url: input.event_source_url,
        event_id: input.event_id,
        user_data,
        custom_data: input.custom_data,
      },
    ],
  };

  if (input.test_event_code) {
    payload.test_event_code = input.test_event_code;
  }

  const url = `${FB_GRAPH_BASE_URL}/${pixelId}/events`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Evita problemas de parsing com + e caracteres especiais no token
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  console.log(`Meta CAPI response: ${JSON.stringify(json)}`);
  if (!res.ok) {
    console.error(`Meta CAPI error: ${res.status} ${JSON.stringify(json)}`);
    throw new Error(`Meta CAPI error: ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

