import { headers } from 'next/headers';
import { deriveLocaleFromHost } from './i18n/locale';

/**
 * Gera a URL base da aplicação baseada no host da requisição atual
 */
export function getAppUrl(): string {
  const host = headers().get('host');
  if (!host) {
    throw new Error('Host header not found');
  }

  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    // Para desenvolvimento: http://{locale}.lawx.local:3000
    return `http://${host}`;
  } else {
    // Para produção: https://{locale}.lawx.ai
    return `https://${host}`;
  }
}

/**
 * Gera URLs específicas para o Stripe checkout
 */
export function getStripeUrls() {
  const baseUrl = getAppUrl();
  
  return {
    successUrl: `${baseUrl}/?success=1`,
    cancelUrl: `${baseUrl}/?canceled=1`,
  };
}

/**
 * Gera URL para um locale específico
 */
export function getUrlForLocale(locale: 'pt' | 'es'): string {
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    return `http://${locale}.lawx.local:3000`;
  } else {
    return `https://${locale}.lawx.ai`;
  }
}

/**
 * Gera URLs alternativas para SEO (hreflang)
 */
export function getAlternateUrls() {
  return {
    pt: getUrlForLocale('pt'),
    es: getUrlForLocale('es'),
    'x-default': getUrlForLocale('pt'), // Default para português
  };
}
