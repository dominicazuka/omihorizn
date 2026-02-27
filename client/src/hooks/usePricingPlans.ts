import { useState, useEffect } from 'react';
// use separate axios instance for web (mobile uses api.config.ts)
import Axios from '../config/web.config';

export interface APIPricingPlan {
  tier: string;
  name: string;
  description: string;
  monthlyPrice: number; // cents
  annualPrice: number; // cents
  features: string[];
  addOns: Array<{ id: string; name: string; description: string; price: number }>; // cents
  highlighted: boolean;
  cta: string;
  active: boolean;
}

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<APIPricingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await Axios.get('/pricing/plans');
        if (res.data && res.data.success) {
          setPlans(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to load pricing');
        }
      } catch (e: any) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return { plans, loading, error };
};
