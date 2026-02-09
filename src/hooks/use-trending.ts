"use client";

import { useState, useEffect, useCallback } from "react";

interface TrendingToken {
  symbol: string;
  name: string;
  thumb: string;
  price_change_24h: number;
  market_cap_rank: number | null;
  tag: string;
}

export function useTrending() {
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch("/api/trending");
      if (res.ok) {
        const data = await res.json();
        setTrending(data);
      }
    } catch {
      // Keep previous data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchTrending]);

  return { trending, loading };
}
