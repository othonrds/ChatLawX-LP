import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashSha256, sendMetaEvent } from '@/_lib/meta/capi';
import { createLogger, getRequestIdFromHeaders } from '@/_lib/_observability/logger';

export const runtime = 'nodejs';

const BodySchema = z.object({
  event_name: z.string().min(1),
  event_source_url: z.string().url().optional(),
  email: z.string().email().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  user_agent: z.string().optional(),
  custom_data: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  const requestId = getRequestIdFromHeaders(req.headers);
  const logger = createLogger(requestId);
  const json = await req.json();
  const parse = BodySchema.safeParse(json);
  if (!parse.success) {
    logger.warn('meta_invalid_body', parse.error.flatten());
    return NextResponse.json({ error: 'Invalid body', requestId }, { status: 400 });
  }
  const { event_name, event_source_url, email, fbc, fbp, user_agent, custom_data } = parse.data;

  const user_data: Record<string, unknown> = {};
  if (email) user_data.em = [hashSha256(email)];
  if (user_agent) user_data.client_user_agent = user_agent;
  if (fbc) user_data.fbc = fbc;
  if (fbp) user_data.fbp = fbp;

  try {
    logger.info('meta_event_received', { event_name, has_email: Boolean(email) });
    const result = await sendMetaEvent({
      event_name,
      event_source_url,
      user_data: user_data as any,
      custom_data,
    });
    logger.info('meta_event_sent', { event_name });
    return NextResponse.json({ ...result, requestId });
  } catch (err: any) {
    logger.error('meta_event_error', { message: err?.message ?? 'Meta CAPI error' });
    return NextResponse.json({ error: 'Meta CAPI error', requestId }, { status: 500 });
  }
}

