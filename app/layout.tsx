import './globals.css';
import { getAlternateUrls } from '@/_lib/urls';

export async function generateMetadata() {
  const alternateUrls = getAlternateUrls();
  
  return {
    title: {
      default: 'Chat LawX - Assistente Jurídico via WhatsApp',
      template: '%s | Chat LawX',
    },
    description: 'Chat LawX: Seu assistente jurídico no WhatsApp. Responda dúvidas, analise PDFs e DOCX com IA.',
    alternates: {
      languages: alternateUrls,
    },
  } as const;
}

import WebVitalsClient from './_components/WebVitalsClient';
import { PlanSelectionProvider } from './_providers/PlanSelectionProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <PlanSelectionProvider>
          {children}
          <WebVitalsClient />
        </PlanSelectionProvider>
      </body>
    </html>
  );
}

