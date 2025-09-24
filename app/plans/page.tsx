import { headers } from 'next/headers';
import { deriveLocaleFromHost } from '@/_lib/i18n/locale';
import { fetchPlans } from '@/_lib/api/plans';
import { getDictionary } from '@/_lib/i18n/dictionary';
import PlansToggle from '../_components/PlansToggle';
import PlanCard from '../_components/PlanCard';

type SearchParams = { interval?: 'monthly' | 'yearly' };

export default async function PlansPage({ searchParams }: { searchParams: SearchParams }) {
  const host = headers().get('host') || '';
  const locale = deriveLocaleFromHost(host);
  const jurisdiction = locale.toUpperCase() === 'ES' ? 'ES' : 'PT';
  const interval = (searchParams?.interval ?? 'monthly') as 'monthly' | 'yearly';

  const plans = await fetchPlans({ interval, jurisdiction });
  const dict = await getDictionary(locale);
  const title = dict.plans?.title || 'Planos';
  const subtitle = dict.plans?.subtitle || '';
  const labelMonthly = dict.plans?.toggle?.monthly || 'Mensal';
  const labelYearly = dict.plans?.toggle?.yearly || 'Anual';
  const intervalMap = dict.plans?.interval || { monthly: 'mensal', yearly: 'anual' };
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = h.get('origin') || `${proto}://${host}`;
  const successUrl = `${origin}/payment-sucess`;

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">{title}</h1>
        <p className="section-subtitle">{subtitle}</p>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <PlansToggle defaultInterval={interval} labelMonthly={labelMonthly} labelYearly={labelYearly} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              interval={interval}
              jurisdiction={jurisdiction}
              locale={locale}
              selectLabel={dict.plans?.select || (locale === 'es' ? 'Seleccionar plan' : 'Selecionar plano')}
              intervalLabel={intervalMap[p.interval as 'monthly' | 'yearly'] || p.interval}
              successUrl={successUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

