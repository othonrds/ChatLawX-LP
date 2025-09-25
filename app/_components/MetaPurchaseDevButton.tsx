"use client";

export default function MetaPurchaseDevButton() {
  if (process.env.NODE_ENV !== 'development') return null;
  const handleClick = async () => {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const planType = params.get('plan') || 'ChatLawX ES';
      const value = Number(params.get('amount') || params.get('value') || '0');
      const checkoutId = params.get('checkout_id') || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
      const eventSourceUrl = window.location.href;
      const clientUserAgent = navigator.userAgent;
      const utm_source = params.get('utm_source') || undefined;
      const utm_campaign = params.get('utm_campaign') || undefined;
      const utm_medium = params.get('utm_medium') || undefined;
      const utm_content = params.get('utm_content') || undefined;
      const fbclid = params.get('fbclid') || undefined;
      const currency = params.get('currency') || 'EUR';
      const eventName = params.get('eventName') || 'compra_chatlawx_espanha';

      const payload = {
        planType,
        value,
        checkoutId,
        eventSourceUrl,
        clientUserAgent,
        utm_source,
        utm_campaign,
        utm_medium,
        utm_content,
        fbclid,
        currency,
        eventName,
      };

      const res = await fetch('/api/meta/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.success) {
        console.error('❌ Meta dev button: evento falhou', j);
      } else {
        console.log('✅ Meta dev button: evento enviado', j);
      }
    } catch (e) {
      console.error('❌ Meta dev button: erro ao enviar', e);
    }
  };
  return (
    <button
      className="btn btn-outline"
      style={{ marginTop: 12 }}
      onClick={handleClick}
    >
      Disparar evento Meta (dev)
    </button>
  );
}


