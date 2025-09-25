"use client";

import type { Plan } from '@/_lib/api/plans';
import { usePlanSelection } from '../_providers/PlanSelectionProvider';

function multiplyLeadingNumber(text: string, factor: number): string {
  return text.replace(/(\d+)/, (m) => String(Number(m) * factor));
}

export default function PlanCard({ plan, interval, jurisdiction, locale = 'pt', selectLabel, intervalLabel, successUrl, yearlyBonusText }: { plan: Plan; interval?: 'monthly' | 'yearly'; jurisdiction?: string; locale?: 'pt' | 'es'; selectLabel?: string; intervalLabel?: string; successUrl?: string; yearlyBonusText?: string }) {
  const { setSelectedPlan } = usePlanSelection();
  const shouldDouble = interval === 'yearly' && jurisdiction === 'ES';
  const displayFeatures = (plan.features || []).map((f) => (shouldDouble ? multiplyLeadingNumber(f, 12) : f));
  const intervalText = intervalLabel || (plan.interval === 'monthly' ? (locale === 'es' ? 'mensual' : 'mensal') : (locale === 'es' ? 'anual' : 'anual'));
  const selectText = selectLabel || (locale === 'es' ? 'Seleccionar plan' : 'Selecionar plano');

  const isYearly = interval === 'yearly';
  const monthlyText = locale === 'es' ? 'mensual' : 'mensal';
  const currency = plan.currency || 'EUR';
  const annualPrice = isYearly ? (plan.interval === 'monthly' ? plan.price * 12 : plan.price) : plan.price;
  const perMonthFromAnnual = isYearly ? annualPrice / 12 : null;
  const formatCurrency = (v: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v);
  return (
    <div style={{ position: 'relative' }}>
      {interval === 'yearly' && yearlyBonusText ? (
        <div style={{
          background: 'linear-gradient(90deg, rgba(214, 86, 0, 0.9), rgba(231, 112, 0, 0.9))',
          border: '1px solidrgb(94, 76, 42)',
          color: 'var(--text)',
          padding: 8,
          borderRadius: 8,
          textAlign: 'center',
          fontWeight: 700,
          maxWidth: 400,
          width: '100%',
          fontSize: 18,
          margin: '0 auto',
        }}>
          {yearlyBonusText}
        </div>
      ) : null}
      <div style={{ marginTop: 20 }}></div>
       <article style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', padding: 16, borderRadius: '10px', maxWidth: 400, width: '100%', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 4px 0', textAlign: 'center' }}>{plan.name}</h3>
        <p style={{ margin: 0, color: 'var(--muted)', textAlign: 'center' }}>{plan.description}</p>
         <div style={{ marginTop: 12, fontWeight: 800, textAlign: 'center', fontSize: 24 }}>
           {formatCurrency(annualPrice)} / {intervalText}
        </div>
         {isYearly && perMonthFromAnnual !== null ? (
           <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 4 }}>
             {formatCurrency(perMonthFromAnnual)} / {monthlyText}
           </div>
         ) : null}
        <ul style={{ margin: '12px 0 0 18px', listStyle: 'disc' }}>
          {displayFeatures.map((f, i) => (
            <li key={i} style={{ color: 'var(--muted)' }}>{f}</li>
          ))}
        </ul>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <a
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            href={`/checkout?plan_id=${encodeURIComponent(plan.id)}&interval=${encodeURIComponent(interval || plan.interval)}${successUrl ? `&success_url=${encodeURIComponent(successUrl)}` : ''}`}
            onClick={() => {
              try {
                setSelectedPlan({ id: plan.id, name: plan.name, price: annualPrice, currency, interval: (interval || plan.interval) as 'monthly' | 'yearly' });
              } catch {}
            }}
          >
            {selectText}
          </a>
        </div>
      </article>
    </div>
  );
}

