"use client";

import { usePrices } from "@/hooks/use-prices";
import { cn } from "@/lib/utils";

export function PriceTicker() {
  const { prices } = usePrices();
  const entries = Object.entries(prices);

  return (
    <div className="overflow-hidden border-b border-chloe-pink/15 bg-chloe-abyss/80">
      <div className="flex animate-ticker whitespace-nowrap py-2.5">
        {[...entries, ...entries].map(([symbol, data], i) => (
          <div
            key={`${symbol}-${i}`}
            className="flex items-center gap-2 px-4 font-mono text-[10px]"
          >
            <span className="text-chloe-pink/25 text-[8px]">†</span>
            <span className="font-bold text-chloe-pink/80 tracking-wider">{symbol}</span>
            <span className="text-foreground/70">
              $
              {data.price < 0.01
                ? data.price.toFixed(8)
                : data.price.toFixed(2)}
            </span>
            <span
              className={cn(
                "text-[9px]",
                data.change24h >= 0 ? "text-chloe-cyan/70" : "text-chloe-blood/70"
              )}
            >
              {data.change24h >= 0 ? "+" : ""}
              {data.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
