import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { env } from '@/_lib/env';

export const runtime = 'nodejs';

function hashSha256(v?: string) {
  if (!v) return undefined as unknown as string;
  return crypto.createHash('sha256').update(v.toLowerCase().trim()).digest('hex');
}

type Body = {
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  clientUserAgent?: string;
  clientIp?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  currency?: string;
};

export async function POST(request: NextRequest) {
  try {
    const META_PIXEL_ACCESS_TOKEN = env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
    const META_PIXEL_ID = env.META_PIXEL_ID || process.env.META_PIXEL_ID;
    const GRAPH_VERSION = 'v22.0';
    if (!META_PIXEL_ACCESS_TOKEN || !META_PIXEL_ID) {
      return NextResponse.json({ success: false, error: 'Meta Pixel token/ID não configurados' }, { status: 500 });
    }

    const body: Body = await request.json().catch(() => ({} as Body));
    const clientIp = body.clientIp || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const userAgent = body.clientUserAgent || request.headers.get('user-agent') || undefined;

    const user_data: Record<string, any> = {
      ...(body.email ? { em: [hashSha256(body.email)] } : {}),
      ...(body.phone ? { ph: [hashSha256(body.phone)] } : {}),
      ...(userAgent ? { client_user_agent: userAgent } : {}),
      ...(clientIp ? { client_ip_address: clientIp } : {}),
      ...(body.fbp ? { fbp: body.fbp } : {}),
      ...(body.fbc ? { fbc: body.fbc } : {}),
    };

    const custom_data: Record<string, any> = {
      content_type: 'product',
      ...(body.currency ? { currency: body.currency } : {}),
      ...(body.utm_source && { utm_source: body.utm_source }),
      ...(body.utm_campaign && { utm_campaign: body.utm_campaign }),
      ...(body.utm_medium && { utm_medium: body.utm_medium }),
      ...(body.utm_content && { utm_content: body.utm_content }),
      ...(body.fbclid && { fbclid: body.fbclid }),
    };

    const payload: any = {
      data: [
        {
          event_name: 'cadastro_lawx_espanha',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: body.eventSourceUrl || request.headers.get('origin') || undefined,
          user_data,
          custom_data,
        },
      ],
    };

    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${META_PIXEL_ACCESS_TOKEN}`,
        'User-Agent': 'LawX/1.0',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Meta API error: ${res.status}`, detail: json }, { status: 500 });
    }
    return NextResponse.json({ success: true, result: json });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Erro interno' }, { status: 500 });
  }
}


