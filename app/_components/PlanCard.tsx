"use client";

import type { Plan } from '@/_lib/api/plans';

function multiplyLeadingNumber(text: string, factor: number): string {
  return text.replace(/(\d+)/, (m) => String(Number(m) * factor));
}

export default function PlanCard({ plan, interval, jurisdiction, locale = 'pt', selectLabel, intervalLabel, successUrl }: { plan: Plan; interval?: 'monthly' | 'yearly'; jurisdiction?: string; locale?: 'pt' | 'es'; selectLabel?: string; intervalLabel?: string; successUrl?: string }) {
  const shouldDouble = interval === 'yearly' && jurisdiction === 'ES';
  const displayFeatures = (plan.features || []).map((f) => (shouldDouble ? multiplyLeadingNumber(f, 12) : f));
  const intervalText = intervalLabel || (plan.interval === 'monthly' ? (locale === 'es' ? 'mensual' : 'mensal') : (locale === 'es' ? 'anual' : 'anual'));
  const selectText = selectLabel || (locale === 'es' ? 'Seleccionar plan' : 'Selecionar plano');
  return (
    <article style={{ background: 'var(--bg-elev)', border: '1px solid #1f2c49', padding: 16, borderRadius: '10px', maxWidth: 400, width: '100%', margin: '0 auto' }}>
      <h3 style={{ margin: '0 0 4px 0', textAlign: 'center' }}>{plan.name}</h3>
      <p style={{ margin: 0, color: 'var(--muted)', textAlign: 'center' }}>{plan.description}</p>
      <div style={{ marginTop: 12, fontWeight: 700, textAlign: 'center' }}>
        {new Intl.NumberFormat(undefined, { style: 'currency', currency: plan.currency || 'EUR' }).format(plan.price)} / {intervalText}
      </div>
      <ul style={{ margin: '12px 0 0 18px', listStyle: 'disc' }}>
        {displayFeatures.map((f, i) => (
          <li key={i} style={{ color: 'var(--muted)' }}>{f}</li>
        ))}
      </ul>
       <div style={{ marginTop: 12, textAlign: 'center' }}>
         <a className="btn btn-primary" style={{ marginTop: 12 }} href={`/checkout?plan_id=${encodeURIComponent(plan.id)}&interval=${encodeURIComponent(plan.interval)}${successUrl ? `&success_url=${encodeURIComponent(successUrl)}` : ''}`}>
           {selectText}
         </a>
       </div>
    </article>
  );
}

