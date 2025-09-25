export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly' | string;
  currency: string;
  stripe_price_id: string;
  features: string[];
  jurisdiction: string;
};

export function getApiBaseUrl(): string {
  const isDev = process.env.NODE_ENV !== 'production';
  return isDev ? 'https://chatapi.lawx.ai' : 'https://chatapi.lawx.ai';
}

export async function fetchPlans(params: { interval: 'monthly' | 'yearly'; jurisdiction: 'PT' | 'ES' }): Promise<Plan[]> {
  const base = getApiBaseUrl();
  const url = `${base}/external/plans?interval=${params.interval}&jurisdiction=${params.jurisdiction}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Plans API error: ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error('Plans API returned unsuccessful response');
  return json.data as Plan[];
}

