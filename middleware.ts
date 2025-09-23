import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // O Next.js i18n já gerencia o roteamento por domínio
  // Apenas adicionamos headers customizados se necessário
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Evita interferir no webhook do Stripe e assets
    '/((?!api/stripe/webhook|_next/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

