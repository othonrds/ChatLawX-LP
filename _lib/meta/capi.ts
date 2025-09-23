import crypto from 'crypto';
import { env } from '@/_lib/env';

const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/v17.0';

export type MetaEventInput = {
  event_name: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: string;
  user_data?: {
    em?: string[]; // hashed emails (sha256)
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: Record<string, unknown>;
};

export function hashSha256(value: string): string {
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function sendMetaEvent(input: MetaEventInput) {
  const pixelId = env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = env.FB_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return { ok: false, error: 'Meta CAPI não configurado (variáveis de ambiente ausentes).' } as const;
  }

  const payload = {
    data: [
      {
        event_name: input.event_name,
        event_time: input.event_time ?? Math.floor(Date.now() / 1000),
        action_source: input.action_source ?? 'website',
        event_source_url: input.event_source_url,
        user_data: input.user_data,
        custom_data: input.custom_data,
      },
    ],
  };

  const url = `${FB_GRAPH_BASE_URL}/${pixelId}/events?access_token=${accessToken}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Meta CAPI error: ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

