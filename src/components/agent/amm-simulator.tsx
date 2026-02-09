"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Droplets, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPOSIT_PRESETS = [100, 500, 1000, 5000, 10000];
const APR_PRESETS = [
  { label: "Low", value: 12, risk: "low" },
  { label: "Med", value: 35, risk: "medium" },
  { label: "High", value: 65, risk: "high" },
  { label: "Degen", value: 120, risk: "extreme" },
];

const RISK_CONFIG: Record<string, { color: string; label: string }> = {
  low: { color: "#00FFFF", label: "LOW RISK" },
  medium: { color: "#FF69B4", label: "MODERATE" },
  high: { color: "#FF1493", label: "ELEVATED" },
  extreme: { color: "#DC143C", label: "EXTREME" },
};

const POOLS = [
  { pair: "SOL/USDC", tvl: "$142.3M", apr: 32.5, volume: "$8.2M", rank: 1 },
  { pair: "SOL/USDT", tvl: "$98.1M", apr: 28.1, volume: "$5.4M", rank: 2 },
  { pair: "RAY/SOL", tvl: "$45.7M", apr: 52.3, volume: "$3.1M", rank: 3 },
  { pair: "BONK/SOL", tvl: "$23.4M", apr: 78.9, volume: "$12.5M", rank: 4 },
];

function getRiskLevel(aprVal: number): string {
  if (aprVal <= 20) return "low";
  if (aprVal <= 45) return "medium";
  if (aprVal <= 80) return "high";
  return "extreme";
}

export function AmmSimulator() {
  const [deposit, setDeposit] = useState(1000);
  const [apr, setApr] = useState(45);
  const [days, setDays] = useState(365);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const dailyRate = apr / 365 / 100;
  const estimatedReturn = deposit * (1 + dailyRate) ** days - deposit;
  const totalValue = deposit + estimatedReturn;
  const returnPercent = deposit > 0 ? (estimatedReturn / deposit) * 100 : 0;
  const risk = getRiskLevel(apr);
  const riskConfig = RISK_CONFIG[risk];

  const handleDepositInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setDeposit(Math.max(0, Math.min(50000, v)));
  }, []);

  const handleAprInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setApr(Math.max(0, Math.min(500, v)));
  }, []);

  const handleDaysInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setDays(Math.max(1, Math.min(730, v)));
  }, []);

  const handlePoolClick = (pool: typeof POOLS[0]) => {
    setApr(pool.apr);
    setSelectedPool(pool.pair);
    setTimeout(() => setSelectedPool(null), 1500);
  };

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 bg-chloe-void">
      {/* APY Calculator */}
      <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-5 transition-all hover:border-chloe-pink/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-pink">
            <Calculator className="h-4 w-4" />
            <span className="text-chloe-pink/30">†</span>
            APY Calculator
          </div>
          <div
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] border px-2 py-0.5"
            style={{ color: riskConfig.color, borderColor: `${riskConfig.color}30` }}
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            {riskConfig.label}
          </div>
        </div>

        <div className="space-y-5">
          {/* Deposit Amount - Slider + Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
                Deposit Amount
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[9px] text-chloe-ash/60">$</span>
                <Input
                  type="number"
                  value={deposit}
                  onChange={handleDepositInput}
                  className="h-6 w-24 border-chloe-pink/20 bg-chloe-void font-mono text-xs text-right text-foreground focus-visible:ring-chloe-pink focus-visible:border-chloe-pink px-2"
                />
              </div>
            </div>
            <Slider
              value={[deposit]}
              onValueChange={([v]) => setDeposit(v)}
              min={0}
              max={50000}
              step={100}
            />
            <div className="flex justify-between font-mono text-[8px] text-chloe-ash/50">
              <span>$0</span>
              <span>$50,000</span>
            </div>
            {/* Presets */}
            <div className="flex gap-1.5 flex-wrap">
              {DEPOSIT_PRESETS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDeposit(amount)}
                  className={cn(
                    "font-mono text-[9px] px-2 py-0.5 border transition-all duration-150",
                    deposit === amount
                      ? "border-chloe-pink/40 bg-chloe-pink/10 text-chloe-pink"
                      : "border-chloe-elevated/60 text-chloe-ash/60 hover:border-chloe-pink/30 hover:text-chloe-pink/80"
                  )}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* APR - Slider + Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
                APR
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={apr}
                  onChange={handleAprInput}
                  className="h-6 w-20 border-chloe-pink/20 bg-chloe-void font-mono text-xs text-right text-foreground focus-visible:ring-chloe-pink focus-visible:border-chloe-pink px-2"
                />
                <span className="font-mono text-[9px] text-chloe-ash/60">%</span>
              </div>
            </div>
            <Slider
              value={[apr]}
              onValueChange={([v]) => setApr(v)}
              min={0}
              max={200}
              step={0.5}
            />
            <div className="flex justify-between font-mono text-[8px] text-chloe-ash/50">
              <span>0%</span>
              <span>200%</span>
            </div>
            {/* APR presets */}
            <div className="flex gap-1.5">
              {APR_PRESETS.map((preset) => {
                const presetRisk = RISK_CONFIG[preset.risk];
                return (
                  <button
                    key={preset.label}
                    onClick={() => setApr(preset.value)}
                    className={cn(
                      "font-mono text-[9px] px-2 py-0.5 border transition-all duration-150 flex-1 text-center",
                      apr === preset.value
                        ? "bg-chloe-void"
                        : "border-chloe-elevated/60 text-chloe-ash/60 hover:text-chloe-ash"
                    )}
                    style={
                      apr === preset.value
                        ? { borderColor: `${presetRisk.color}40`, color: presetRisk.color }
                        : undefined
                    }
                  >
                    {preset.label} ({preset.value}%)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration - Slider + Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
                Duration
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={days}
                  onChange={handleDaysInput}
                  className="h-6 w-16 border-chloe-pink/20 bg-chloe-void font-mono text-xs text-right text-foreground focus-visible:ring-chloe-pink focus-visible:border-chloe-pink px-2"
                />
                <span className="font-mono text-[9px] text-chloe-ash/60">days</span>
              </div>
            </div>
            <Slider
              value={[days]}
              onValueChange={([v]) => setDays(v)}
              min={1}
              max={730}
              step={1}
            />
            <div className="flex justify-between font-mono text-[8px] text-chloe-ash/50">
              <span>1d</span>
              <span>730d</span>
            </div>
            {/* Duration presets */}
            <div className="flex gap-1.5">
              {[30, 90, 180, 365].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    "font-mono text-[9px] px-2 py-0.5 border transition-all duration-150 flex-1 text-center",
                    days === d
                      ? "border-chloe-cyan/40 bg-chloe-cyan/5 text-chloe-cyan"
                      : "border-chloe-elevated/60 text-chloe-ash/60 hover:border-chloe-cyan/30 hover:text-chloe-cyan/80"
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-4 transition-all hover:border-chloe-cyan/20">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-cyan">
          <TrendingUp className="h-4 w-4" />
          <span className="text-chloe-cyan/30">♰</span>
          Estimated Returns
        </div>

        <div className="space-y-3">
          {/* Visual return bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[9px] text-chloe-ash/60 uppercase tracking-wider">
              <span>Return Ratio</span>
              <span style={{ color: riskConfig.color }}>+{returnPercent.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-chloe-void border border-chloe-elevated/40 overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(returnPercent, 100)}%`,
                  background: `linear-gradient(90deg, ${riskConfig.color}60, ${riskConfig.color})`,
                  boxShadow: `0 0 8px ${riskConfig.color}40`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-chloe-pink/10 bg-chloe-void p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
              Est. Profit
            </span>
            <span className="font-mono font-bold text-chloe-cyan">
              +${estimatedReturn.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border border-chloe-pink/10 bg-chloe-void p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
              Total Value
            </span>
            <span className="font-mono font-bold text-foreground">
              ${totalValue.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border border-chloe-pink/10 bg-chloe-void p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-chloe-ash">
              Daily Yield
            </span>
            <span className="font-mono text-sm text-chloe-pink">
              ${(deposit * dailyRate).toFixed(2)}/day
            </span>
          </div>

          {/* Compound breakdown */}
          <div className="border border-chloe-elevated/30 bg-chloe-void/50 p-3 space-y-1">
            <span className="font-mono text-[8px] text-chloe-ash/60 uppercase tracking-[0.3em]">
              † Compound Breakdown
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-chloe-ash/60">${deposit.toFixed(0)}</span>
              <ArrowRight className="h-2.5 w-2.5 text-chloe-pink/40" />
              <span className="text-chloe-ash/60">{days}d @ {apr}%</span>
              <ArrowRight className="h-2.5 w-2.5 text-chloe-pink/40" />
              <span className="text-chloe-cyan font-bold">${totalValue.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pool Info */}
      <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-4 md:col-span-2 transition-all hover:border-chloe-blood/20">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-blood">
          <Droplets className="h-4 w-4" />
          <span className="text-chloe-blood/30">✘</span>
          Popular Pools
          <span className="ml-auto font-mono text-[8px] text-chloe-ash/50 tracking-[0.2em] normal-case">
            click to load APR
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center px-3 font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.2em]">
          <span>#</span>
          <span>Pair</span>
          <span>APR</span>
          <span className="hidden sm:block">TVL</span>
          <span className="hidden sm:block">24h Vol</span>
        </div>

        <div className="space-y-2">
          {POOLS.map((pool) => (
            <button
              key={pool.pair}
              onClick={() => handlePoolClick(pool)}
              className={cn(
                "w-full grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center border bg-chloe-void p-3 transition-all group text-left",
                selectedPool === pool.pair
                  ? "border-chloe-pink/50 shadow-[0_0_15px_#FF149320]"
                  : "border-chloe-pink/10 hover:border-chloe-pink/40 hover:shadow-[0_0_10px_#FF149315]"
              )}
            >
              <span className="font-mono text-[9px] text-chloe-ash/50 w-4">
                {pool.rank}
              </span>
              <span className="font-mono font-bold text-xs text-foreground group-hover:text-chloe-pink transition-colors">
                {pool.pair}
              </span>
              <span
                className="font-mono text-[10px] border px-1.5 py-0.5"
                style={{
                  color: RISK_CONFIG[getRiskLevel(pool.apr)].color,
                  borderColor: `${RISK_CONFIG[getRiskLevel(pool.apr)].color}20`,
                }}
              >
                {pool.apr}%
              </span>
              <span className="hidden sm:block font-mono text-[10px] text-chloe-ash">
                {pool.tvl}
              </span>
              <span className="hidden sm:block font-mono text-[10px] text-chloe-ash">
                {pool.volume}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
