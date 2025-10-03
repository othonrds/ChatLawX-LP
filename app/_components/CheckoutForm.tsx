"use client";

import { useState, useTransition } from 'react';
import CountryDialSelect, { getDefaultDialByLocale } from './CountryDialSelect';
import { createCheckoutSessionAction } from '../checkout/actions';

export default function CheckoutForm({ planId, interval, locale = 'pt', labels, placeholders, submitLabel, creatingLabel, errorText, successUrl }: {
  planId: string; interval: 'monthly' | 'yearly'; locale?: 'pt' | 'es';
  labels?: { phone?: string; email?: string };
  placeholders?: { phone?: string; email?: string };
  submitLabel?: string; creatingLabel?: string; errorText?: string;
  successUrl?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [dial, setDial] = useState<string>(getDefaultDialByLocale(locale));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('plan_id', planId);
    fd.set('interval', interval);
    // compor telefone E.164 a partir do DDI selecionado + número informado
    const digits = String(fd.get('phone') || '').replace(/\D/g, '');
    const e164 = `${dial}${digits}`;
    fd.set('phone', e164);
    // Dispara evento "cadastro_lawx_espanha" em background para ES
    try {
      if (locale === 'es') {
        const email = String(fd.get('email') || '');
        const phoneE164 = e164;
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const payload: any = {
          email,
          phone: phoneE164,
          eventSourceUrl: window.location.href,
          clientUserAgent: navigator.userAgent,
          currency: params.get('currency') || undefined,
          utm_source: params.get('utm_source') || undefined,
          utm_campaign: params.get('utm_campaign') || undefined,
          utm_medium: params.get('utm_medium') || undefined,
          utm_content: params.get('utm_content') || undefined,
          fbclid: params.get('fbclid') || undefined,
        };
        fetch('/api/meta/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
    } catch {}
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutSessionAction(fd);
      if (res?.ok && res.url) {
        window.location.href = res.url;
      } else {
        setError(res?.error || 'Falha ao criar sessão de checkout');
      }
    });
  }

  const labelPhone = labels?.phone || (locale === 'es' ? 'Teléfono (WhatsApp)' : 'Telefone (WhatsApp)');
  const labelEmail = labels?.email || (locale === 'es' ? 'Correo electrónico' : 'E-mail');
  const placeholderPhone = placeholders?.phone || (locale === 'es' ? '+34 600 000 000' : '+351 999 999 999');
  const placeholderEmail = placeholders?.email || (locale === 'es' ? 'correo@ejemplo.com' : 'email@exemplo.com');
  const submitText = submitLabel || (locale === 'es' ? 'Continuar al pago' : 'Continuar para pagamento');
  const errorMsg = errorText || (locale === 'es' ? 'Error al crear la sesión de pago' : 'Falha ao criar sessão de checkout');
  const finalErrorText = error || errorMsg;
  const creatingText = creatingLabel || (locale === 'es' ? 'Creando sesión...' : 'Criando sessão...');

  function formatPhone(value: string): string {
    const raw = value.trim();
    const digits = raw.replace(/\D/g, '');
    const limited = digits.slice(0, 15); // E.164 local part max-ish
    const groups: string[] = [];
    for (let i = 0; i < limited.length; i += 3) {
      groups.push(limited.slice(i, i + 3));
    }
    return groups.join(' ').trim();
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
      {successUrl ? <input type="hidden" name="success_url" value={successUrl} /> : null}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="phone" style={{ marginBottom: 8 }}>{labelPhone}</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <CountryDialSelect value={dial} onChange={setDial} />
          <input
            id="phone"
            name="phone"
            required
            placeholder={placeholderPhone}
            value={phone}
            onChange={handlePhoneChange}
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #2a3b5e', background: 'transparent', color: 'var(--text)' }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="email" style={{ marginBottom: 8 }}>{labelEmail}</label>
        <input id="email" type="email" name="email" required placeholder={placeholderEmail} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #2a3b5e', background: 'transparent', color: 'var(--text)' }} />
      </div>
      {error && <p style={{ color: 'var(--danger)' }}>{finalErrorText}</p>}
      <button className="btn btn-primary" disabled={isPending} type="submit">
        {isPending ? creatingText : submitText}
      </button>
    </form>
  );
}

