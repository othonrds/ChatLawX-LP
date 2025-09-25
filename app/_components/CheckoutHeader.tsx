"use client";

import { usePlanSelection } from '../_providers/PlanSelectionProvider';

export default function CheckoutHeader({ fallbackPlanId, intervalLabel, locale = 'pt', title, selectedPrefix, periodLabel }: {
  fallbackPlanId: string;
  intervalLabel: string;
  locale?: 'pt' | 'es';
  title: string;
  selectedPrefix: string;
  periodLabel: string;
}) {
  const { selectedPlan } = usePlanSelection();
  const displayPlan = selectedPlan?.name || fallbackPlanId;
  return (
    <>
      <h1 className="section-title">{title}</h1>
      <p className="section-subtitle">
        {selectedPrefix}: <strong>{displayPlan}</strong> — {periodLabel}: <strong>{intervalLabel}</strong>
      </p>
    </>
  );
}


