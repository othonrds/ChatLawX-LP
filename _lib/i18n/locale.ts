export const SUPPORTED_LOCALES = ['es', 'pt'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'pt';

export function deriveLocaleFromHost(hostHeader: string | null | undefined): SupportedLocale {
  if (!hostHeader) return DEFAULT_LOCALE;
  const host = hostHeader.split(':')[0];
  const parts = host.split('.');
  // e.g., es.lawx.ai -> ['es','lawx','ai']; es.lawx.local -> ['es','lawx','local']
  const sub = parts.length > 2 ? parts[0] : (parts.length === 2 ? parts[0] : '');
  const candidate = (sub || '').toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(candidate) ? (candidate as SupportedLocale) : DEFAULT_LOCALE;
}

