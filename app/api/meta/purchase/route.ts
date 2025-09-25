import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { env } from '@/_lib/env';

export const runtime = 'nodejs';

function makeEventId(): string {
  return crypto.randomUUID();
}

function sha256(v?: string) {
  if (!v) return undefined as unknown as string;
  return crypto.createHash('sha256').update(v.toLowerCase().trim()).digest('hex');
}

type Body = {
  planType: string;
  value: number;
  checkoutId: string;
  eventSourceUrl?: string;
  clientUserAgent?: string;
  clientIp?: string;
  testEventCode?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  fbclid?: string;
  currency?: string;
  eventName?: string;
};

async function trackMetaPurchaseServerSide(params: Body): Promise<{ success: boolean; eventId: string; error?: string }> {
  try {
    const META_PIXEL_ACCESS_TOKEN = env.META_ACCESS_TOKEN;
    const META_PIXEL_ID = env.META_PIXEL_ID;
    const GRAPH_VERSION = 'v22.0';

    if (!META_PIXEL_ACCESS_TOKEN || !META_PIXEL_ID) {
      return { success: false, eventId: makeEventId(), error: 'Meta Pixel token/ID não configurados' };
    }

    const eventId = makeEventId();

    const user_data: Record<string, any> = {
      client_user_agent: params.clientUserAgent,
      ...(params.clientIp && { client_ip_address: params.clientIp }),
    };

    const custom_data: Record<string, any> = {
      content_type: 'product',
      content_name: params.planType,
      content_ids: [params.checkoutId],
      value: params.value,
      currency: params.currency || 'EUR',
      ...(params.utm_source && { utm_source: params.utm_source }),
      ...(params.utm_campaign && { utm_campaign: params.utm_campaign }),
      ...(params.utm_medium && { utm_medium: params.utm_medium }),
      ...(params.utm_content && { utm_content: params.utm_content }),
      ...(params.fbclid && { fbclid: params.fbclid }),
    };

    const payload: any = {
      data: [
        {
          event_name: params.eventName || 'compra_chatlawx_espanha',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: params.eventSourceUrl,
          user_data,
          custom_data,
        },
      ],
    };
    console.log('META_PIXEL_ID', { META_PIXEL_ID });
    console.log('META_PIXEL_ACCESS_TOKEN', { META_PIXEL_ACCESS_TOKEN });
    console.log('payload', { payload: JSON.stringify(payload) });

    if (params.testEventCode) payload.test_event_code = params.testEventCode;

    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${META_PIXEL_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LawX/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.text();
      return { success: false, eventId, error: `Meta API error: ${res.status} ${res.statusText} ${errorData}` };
    }

    const result = await res.json();
    if (result.events_received && result.events_received > 0) {
      return { success: true, eventId };
    }
    return { success: false, eventId, error: 'Nenhum evento processado pela Meta' };
  } catch (e: any) {
    return { success: false, eventId: makeEventId(), error: e?.message || 'Erro desconhecido' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();
    const {
      planType,
      value,
      checkoutId,
      eventSourceUrl = request.headers.get('origin') || 'https://lawx.ai',
      clientUserAgent = request.headers.get('user-agent') || 'Unknown',
      clientIp = (request as any).ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
      utm_source,
      utm_campaign,
      utm_medium,
      utm_content,
      fbclid,
      currency,
      eventName,
    } = body || {};

    if (!planType || typeof value !== 'number' || !checkoutId) {
      return NextResponse.json({ error: 'planType, value e checkoutId são obrigatórios' }, { status: 400 });
    }

    const result = await trackMetaPurchaseServerSide({
      planType,
      value,
      checkoutId,
      eventSourceUrl,
      clientUserAgent,
      clientIp,
      testEventCode: process.env.NODE_ENV === 'development' ? 'TEST_EVENT_CODE' : undefined,
      utm_source,
      utm_campaign,
      utm_medium,
      utm_content,
      fbclid,
      currency,
      eventName,
    });

    if (result.success) {
      return NextResponse.json({ success: true, eventId: result.eventId });
    }
    return NextResponse.json({ success: false, error: result.error, eventId: result.eventId }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Erro interno' }, { status: 500 });
  }
}

