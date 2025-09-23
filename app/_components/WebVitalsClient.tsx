"use client";

import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      id: metric.id,
      value: metric.value,
      rating: (metric as any).rating,
      delta: (metric as any).delta,
      navigationType: (metric as any).navigationType,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', body);
    } else {
      fetch('/api/metrics', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
    }
  } catch {}
}

export default function WebVitalsClient() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onFCP(sendToAnalytics);
  }, []);
  return null;
}

