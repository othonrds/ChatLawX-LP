import CheckoutForm from '../_components/CheckoutForm';
import { headers } from 'next/headers';
import { deriveLocaleFromHost } from '@/_lib/i18n/locale';
import { getDictionary } from '@/_lib/i18n/dictionary';

type Search = { plan_id?: string; interval?: 'monthly' | 'yearly'; success_url?: string };

export default async function CheckoutPage({ searchParams }: { searchParams: Search }) {
  const host = headers().get('host') || '';
  const locale = deriveLocaleFromHost(host);
  const planId = searchParams.plan_id || '';
  const interval = (searchParams.interval || 'monthly') as 'monthly' | 'yearly';
  const dict = await getDictionary(locale);
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = h.get('origin') || `${proto}://${host}`;
  const successUrl = searchParams.success_url || `${origin}/payment-sucess`;
  const title = dict.checkout?.title || (locale === 'es' ? 'Finalizar compra' : 'Finalizar compra');
  const subtitlePrefix = dict.checkout?.selectedPrefix || (locale === 'es' ? 'Plan seleccionado' : 'Plano selecionado');
  const periodoLabel = dict.checkout?.period || (locale === 'es' ? 'período' : 'período');
  const intervalLabel = dict.plans?.interval?.[interval] || (interval === 'yearly' ? (locale === 'es' ? 'anual' : 'anual') : (locale === 'es' ? 'mensual' : 'mensal'));
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">{title}</h1>
        <p className="section-subtitle">{subtitlePrefix}: <strong>{planId}</strong> — {periodoLabel}: <strong>{intervalLabel}</strong></p>
        <CheckoutForm
          planId={planId}
          interval={interval}
          locale={locale as 'pt' | 'es'}
          successUrl={successUrl}
          labels={{
            phone: dict.checkout?.labels?.phone,
            email: dict.checkout?.labels?.email,
          }}
          placeholders={{
            phone: dict.checkout?.placeholders?.phone,
            email: dict.checkout?.placeholders?.email,
          }}
          submitLabel={dict.checkout?.submit}
          creatingLabel={dict.checkout?.creating}
          errorText={dict.checkout?.error}
        />
      </div>
    </main>
  );
}

