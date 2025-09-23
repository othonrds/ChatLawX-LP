import './globals.css';

export async function generateMetadata() {
  const isDev = process.env.NODE_ENV !== 'production';
  const baseDev = 'http://{locale}.lawx.local:3000';
  const baseProd = 'https://{locale}.lawx.ai';
  const map = (locale: 'pt' | 'es') => (isDev ? baseDev : baseProd).replace('{locale}', locale);
  return {
    title: {
      default: 'Lawx',
      template: '%s | Lawx',
    },
    description: 'Landing page com SSR, Meta CAPI e Stripe',
    alternates: {
      languages: {
        pt: map('pt'),
        es: map('es'),
      },
    },
  } as const;
}

import WebVitalsClient from './_components/WebVitalsClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <WebVitalsClient />
      </body>
    </html>
  );
}

