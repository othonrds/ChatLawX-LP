"use client";

import { useEffect, useRef } from 'react';
import { usePlanSelection } from '../_providers/PlanSelectionProvider';

type Props = { locale: 'pt' | 'es' };

export default function MetaPurchaseTracker({ locale }: Props) {
  const { selectedPlan } = usePlanSelection();
  const sentRef = useRef(false);

  useEffect(() => {
    const track = () => {
      if (sentRef.current) return;
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const planName = selectedPlan?.name || params.get('plan') || 'ChatLawX ES';
        const planPrice = typeof selectedPlan?.price === 'number' ? selectedPlan.price : Number(params.get('amount') || params.get('value') || '0');
        const checkoutId = params.get('checkout_id') || crypto.randomUUID();
        const fbclid = params.get('fbclid') || undefined;
        const utm_source = params.get('utm_source') || undefined;
        const utm_campaign = params.get('utm_campaign') || undefined;
        const utm_medium = params.get('utm_medium') || undefined;
        const utm_content = params.get('utm_content') || undefined;
        const currency = selectedPlan?.currency || params.get('currency') || 'EUR';

        console.log('MetaPurchaseTracker', {
          planName,
          planPrice,
          checkoutId,
          fbclid,
          utm_source,
        });

        fetch('/api/meta/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planType: planName,
            value: planPrice,
            checkoutId,
            eventSourceUrl: window.location.href,
            clientUserAgent: navigator.userAgent,
            utm_source,
            utm_campaign,
            utm_medium,
            utm_content,
            fbclid,
            currency,
            eventName: 'compra_lawx_espanha',
          }),
        })
          .then(async (res) => {
            console.log('MetaPurchaseTracker', { res });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j?.success) {
              console.error('Meta purchase event failed', j);
            } else {
              console.log('Meta purchase event sent', j);
              sentRef.current = true;
            }
          })
          .catch((err) => console.error('Meta purchase event error', err));
      } catch {}
    };

    // Executa uma vez ao carregar
    track();

    // Expor trigger em dev e ouvir evento global
    const handler = () => track();
    window.addEventListener('meta:track-purchase', handler);
    if (process.env.NODE_ENV === 'development') {
      (window as any).__metaTrackPurchase = track;
    }
    return () => {
      window.removeEventListener('meta:track-purchase', handler);
      if ((window as any).__metaTrackPurchase) delete (window as any).__metaTrackPurchase;
    };
  }, [selectedPlan]);

  return null;
}


