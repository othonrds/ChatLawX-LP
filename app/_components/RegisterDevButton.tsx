"use client";

export default function RegisterDevButton() {
  if (process.env.NODE_ENV !== 'development') return null;

  async function handleClick() {
    try {
      const emailEl = document.getElementById('email') as HTMLInputElement | null;
      const phoneEl = document.getElementById('phone') as HTMLInputElement | null;
      const email = emailEl?.value || '';
      const phone = phoneEl?.value || '';

      const url = new URL(window.location.href);
      const params = url.searchParams;

      const payload: any = {
        email,
        phone,
        eventSourceUrl: window.location.href,
        clientUserAgent: navigator.userAgent,
        currency: params.get('currency') || undefined,
        utm_source: params.get('utm_source') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_content: params.get('utm_content') || undefined,
        fbclid: params.get('fbclid') || undefined,
      };

      const res = await fetch('/api/meta/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.success) {
        console.error('❌ Cadastro (dev): falhou', j);
      } else {
        console.log('✅ Cadastro (dev): enviado', j);
      }
    } catch (e) {
      console.error('❌ Cadastro (dev): erro ao enviar', e);
    }
  }

  return (
    <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={handleClick}>
      Disparar evento Cadastro (dev)
    </button>
  );
}


