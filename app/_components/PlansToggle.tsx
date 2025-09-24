"use client";

import { useRouter, useSearchParams } from 'next/navigation';

type Props = { defaultInterval?: 'monthly' | 'yearly'; labelMonthly?: string; labelYearly?: string };

export default function PlansToggle({ defaultInterval = 'monthly', labelMonthly, labelYearly }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const interval = (sp.get('interval') as 'monthly' | 'yearly') || defaultInterval;

  function setIntervalValue(value: 'monthly' | 'yearly') {
    const query = new URLSearchParams(sp.toString());
    query.set('interval', value);
    router.push(`/plans?${query.toString()}`);
  }

  const mLabel = labelMonthly || 'Mensal';
  const yLabel = labelYearly || 'Anual';

  return (
    <div style={{ display: 'inline-flex', border: '1px solid #2a3b5e', borderRadius: 8, overflow: 'hidden' }}>
      <button
        className="btn"
        onClick={() => setIntervalValue('monthly')}
        style={{ background: interval === 'monthly' ? 'var(--primary)' : 'transparent', color: interval === 'monthly' ? '#051120' : 'var(--text)' }}
      >
        {mLabel}
      </button>
      <button
        className="btn"
        onClick={() => setIntervalValue('yearly')}
        style={{ background: interval === 'yearly' ? 'var(--primary)' : 'transparent', color: interval === 'yearly' ? '#051120' : 'var(--text)' }}
      >
        {yLabel}
      </button>
    </div>
  );
}

