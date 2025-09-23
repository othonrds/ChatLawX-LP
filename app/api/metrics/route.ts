import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLogger, getRequestIdFromHeaders } from '@/_lib/_observability/logger';

export const runtime = 'nodejs';

const BodySchema = z.object({
  name: z.string(),
  id: z.string(),
  value: z.number(),
  rating: z.string().optional(),
  delta: z.number().optional(),
  navigationType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const requestId = getRequestIdFromHeaders(req.headers);
  const logger = createLogger(requestId);
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    logger.warn('metrics_invalid_body');
    return NextResponse.json({ ok: false, requestId }, { status: 400 });
  }
  const metric = parsed.data;
  logger.info('web_vital', metric);
  return NextResponse.json({ ok: true, requestId });
}

