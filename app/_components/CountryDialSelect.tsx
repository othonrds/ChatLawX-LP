"use client";

import { useId } from 'react';

type Country = { code: string; name: string; dial: string; flag: string };

const COUNTRIES: Country[] = [
  { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutschland', dial: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
];

export function getDefaultDialByLocale(locale: 'pt' | 'es'): string {
  return locale === 'es' ? '+34' : '+351';
}

export default function CountryDialSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const id = useId();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {label ? <label htmlFor={id} style={{ display: 'none' }}>{label}</label> : null}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: '1px solid #2a3b5e', background: 'transparent', color: 'var(--text)' }}
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.dial} style={{ color: 'black' }}>
            {c.flag} {c.dial} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}


