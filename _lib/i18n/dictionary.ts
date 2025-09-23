import type pt from '../../messages/pt.json';
import type es from '../../messages/es.json';
import type { SupportedLocale } from './locale';

export type Messages = typeof pt & typeof es;

export async function getDictionary(locale: SupportedLocale): Promise<Messages> {
  switch (locale) {
    case 'es':
      return (await import('../../messages/es.json')).default as Messages;
    case 'pt':
    default:
      return (await import('../../messages/pt.json')).default as Messages;
  }
}

