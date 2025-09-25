"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SelectedPlan = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  interval: 'monthly' | 'yearly';
};

type PlanSelectionContextType = {
  selectedPlan: SelectedPlan | null;
  setSelectedPlan: (plan: SelectedPlan | null) => void;
};

const PlanSelectionContext = createContext<PlanSelectionContextType | undefined>(undefined);

const STORAGE_KEY = 'lawx:selectedPlan';

export function PlanSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlan, setSelectedPlanState] = useState<SelectedPlan | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && parsed.name) setSelectedPlanState(parsed);
      }
    } catch {}
  }, []);

  const setSelectedPlan = (plan: SelectedPlan | null) => {
    setSelectedPlanState(plan);
    try {
      if (plan) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(() => ({ selectedPlan, setSelectedPlan }), [selectedPlan]);
  return <PlanSelectionContext.Provider value={value}>{children}</PlanSelectionContext.Provider>;
}

export function usePlanSelection(): PlanSelectionContextType {
  const ctx = useContext(PlanSelectionContext);
  if (!ctx) throw new Error('usePlanSelection must be used within PlanSelectionProvider');
  return ctx;
}


