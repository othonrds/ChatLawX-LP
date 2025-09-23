import { NextRequest, NextResponse } from 'next/server';
import { deriveLocaleFromHost } from '@/_lib/i18n/locale';

export function middleware(req: NextRequest) {
  const locale = deriveLocaleFromHost(req.headers.get('host'));
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Evita interferir no webhook do Stripe e assets
    '/((?!api/stripe/webhook|_next/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

