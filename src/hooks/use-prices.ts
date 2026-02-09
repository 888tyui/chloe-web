"use client";

import { useState, useEffect, useCallback } from "react";

interface PriceData {
  [symbol: string]: {
    price: number;
    change24h: number;
  };
}

const MOCK_PRICES: PriceData = {
  SOL: { price: 142.37, change24h: 3.24 },
  BTC: { price: 97420.0, change24h: -0.82 },
  ETH: { price: 3245.67, change24h: 1.56 },
  USDC: { price: 1.0, change24h: 0.01 },
  USDT: { price: 1.0, change24h: -0.01 },
  RAY: { price: 4.82, change24h: 5.67 },
  BONK: { price: 0.00002341, change24h: 12.34 },
  JUP: { price: 1.23, change24h: -2.45 },
  PYTH: { price: 0.45, change24h: 0.89 },
  WIF: { price: 2.15, change24h: 8.92 },
};

export function usePrices() {
  const [prices, setPrices] = useState<PriceData>(MOCK_PRICES);
  const [loading, setLoading] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/price");
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch {
      // Keep mock prices on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { prices, loading };
}
