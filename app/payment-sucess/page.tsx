import { headers } from 'next/headers';
import { deriveLocaleFromHost } from '@/_lib/i18n/locale';

export default function PaymentSuccessPage() {
  const host = headers().get('host');
  const locale = deriveLocaleFromHost(host);
  const title = locale === 'es' ? 'Pago realizado' : 'Pagamento realizado';
  const message = locale === 'es' ? 'Gracias, tu pago fue confirmado.' : 'Obrigado, seu pagamento foi confirmado.';
  return (
    <main className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="section-title">{title}</h1>
        <p className="section-subtitle">{message}</p>
      </div>
    </main>
  );
}

