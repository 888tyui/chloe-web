"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  Droplets,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Coins,
  Activity,
  Zap,
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { PoolForm } from "@/components/dex/pool-form";
import { DexAssistant } from "@/components/dex/dex-assistant";
import { LoginModal } from "@/components/auth/login-modal";
import { useBalances } from "@/hooks/use-balances";
import { useTransactions } from "@/hooks/use-transactions";
import { usePrices } from "@/hooks/use-prices";
import { useTrending } from "@/hooks/use-trending";
import { cn } from "@/lib/utils";

function shortenAddress(addr: string, chars = 4) {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

function formatTime(ts: number | null) {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const TOP_POOLS = [
  { pair: "SOL/USDC", tvl: "$142.3M", apr: "32.5%", vol24h: "$8.2M" },
  { pair: "SOL/USDT", tvl: "$98.1M", apr: "28.1%", vol24h: "$5.4M" },
  { pair: "RAY/SOL", tvl: "$45.7M", apr: "52.3%", vol24h: "$3.1M" },
  { pair: "BONK/SOL", tvl: "$23.4M", apr: "78.9%", vol24h: "$12.5M" },
];

export default function DexPage() {
  const { connected, publicKey } = useWallet();
  const [loginOpen, setLoginOpen] = useState(false);
  const { balances, loading: balLoading, lastUpdated, refresh: refreshBal } = useBalances();
  const { transactions, loading: txLoading, refresh: refreshTx } = useTransactions(8);
  const { prices } = usePrices();
  const { trending, loading: trendLoading } = useTrending();
  const [copied, setCopied] = useState(false);

  const totalUsdValue = balances.reduce((sum, b) => {
    const p = prices[b.symbol]?.price ?? 0;
    return sum + b.balance * p;
  }, 0);

  const topGainer = useMemo(() => {
    const entries = Object.entries(prices);
    if (entries.length === 0) return null;
    return entries.reduce((best, [sym, data]) =>
      data.change24h > (best[1]?.change24h ?? -Infinity) ? [sym, data] as const : best
    , entries[0] as readonly [string, { price: number; change24h: number }]);
  }, [prices]);

  const topLoser = useMemo(() => {
    const entries = Object.entries(prices);
    if (entries.length === 0) return null;
    return entries.reduce((worst, [sym, data]) =>
      data.change24h < (worst[1]?.change24h ?? Infinity) ? [sym, data] as const : worst
    , entries[0] as readonly [string, { price: number; change24h: number }]);
  }, [prices]);

  const handleCopy = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-chloe-void min-h-[calc(100vh-4rem)]">
      {/* Floating wallet assistant */}
      <DexAssistant />

      {/* Hero Title */}
      <div className="border-b border-chloe-elevated/30 bg-chloe-abyss/20">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-6 bg-chloe-pink/20" />
                <span className="font-mono text-[9px] text-chloe-pink/40 tracking-[0.5em] uppercase">
                  † Jupiter V6 Aggregation †
                </span>
              </div>
              <h1 className="text-5xl font-title uppercase tracking-tight leading-none">
                <span className="gradient-menheera">Solana DEX</span>
              </h1>
              <p className="mt-2 font-mono text-[11px] text-chloe-smoke/70 tracking-wider">
                Liquidity<span className="text-chloe-pink/20 mx-1.5">†</span>
                Portfolio<span className="text-chloe-pink/20 mx-1.5">♰</span>
                All through the void
              </p>
            </div>

            {/* Quick stats row */}
            <div className="hidden md:flex items-center gap-4">
              {topGainer && (
                <div className="border border-chloe-cyan/15 bg-chloe-void px-3 py-2 min-w-[120px]">
                  <span className="font-mono text-[7px] text-chloe-ash/50 uppercase tracking-[0.2em] block">Top Gainer</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ArrowUpRight className="h-3 w-3 text-chloe-cyan" />
                    <span className="font-mono text-[12px] font-bold text-chloe-cyan">{topGainer[0]}</span>
                    <span className="font-mono text-[10px] text-chloe-cyan/70">+{topGainer[1].change24h.toFixed(2)}%</span>
                  </div>
                </div>
              )}
              {topLoser && (
                <div className="border border-chloe-blood/15 bg-chloe-void px-3 py-2 min-w-[120px]">
                  <span className="font-mono text-[7px] text-chloe-ash/50 uppercase tracking-[0.2em] block">Top Loser</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ArrowDownRight className="h-3 w-3 text-chloe-blood" />
                    <span className="font-mono text-[12px] font-bold text-chloe-blood">{topLoser[0]}</span>
                    <span className="font-mono text-[10px] text-chloe-blood/70">{topLoser[1].change24h.toFixed(2)}%</span>
                  </div>
                </div>
              )}
              <div className="border border-chloe-elevated/30 bg-chloe-void px-3 py-2 min-w-[120px]">
                <span className="font-mono text-[7px] text-chloe-ash/50 uppercase tracking-[0.2em] block">Tokens Tracked</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <BarChart3 className="h-3 w-3 text-chloe-pink/50" />
                  <span className="font-mono text-[12px] font-bold text-foreground">{Object.keys(prices).length}</span>
                  <span className="font-mono text-[10px] text-chloe-ash/60">assets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price ticker bar */}
      <div className="border-b border-chloe-elevated/20 bg-chloe-abyss/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center gap-5">
          {Object.entries(prices).map(([sym, data]) => (
            <div key={sym} className="flex items-center gap-1.5 font-mono text-[9px] shrink-0">
              <span className="text-chloe-ash/60">{sym}</span>
              <span className="text-foreground/80">
                ${data.price < 0.01 ? data.price.toFixed(6) : data.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className={cn("flex items-center gap-0.5", data.change24h >= 0 ? "text-chloe-cyan" : "text-chloe-blood")}>
                {data.change24h >= 0 ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
                {Math.abs(data.change24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Wallet Overview */}
            <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-pink">
                  <Wallet className="h-4 w-4" />
                  <span className="text-chloe-pink/30">†</span>
                  Portfolio
                </div>
                {connected && (
                  <button
                    onClick={() => { refreshBal(); refreshTx(); }}
                    className="flex items-center gap-1 font-mono text-[8px] text-chloe-ash/60 hover:text-chloe-cyan transition-colors"
                  >
                    <RefreshCw className={cn("h-2.5 w-2.5", balLoading && "animate-spin")} />
                    {lastUpdated ? formatTime(Math.floor(lastUpdated / 1000)) : "refresh"}
                  </button>
                )}
              </div>

              {!connected ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="flex h-14 w-14 items-center justify-center border border-chloe-elevated/40 bg-chloe-void">
                    <Wallet className="h-6 w-6 text-chloe-ash/50" />
                  </div>
                  <p className="font-mono text-[11px] text-chloe-ash/60">connect your wallet to view portfolio</p>
                  <Button
                    onClick={() => setLoginOpen(true)}
                    className="bg-chloe-pink text-white hover:bg-chloe-pink-hot hover:shadow-[0_0_15px_#FF149340] font-mono text-xs uppercase tracking-wider"
                  >
                    Login
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-1.5 font-mono text-[11px] text-chloe-smoke/80 hover:text-chloe-pink transition-colors">
                        {shortenAddress(publicKey!.toBase58(), 6)}
                        {copied ? <Check className="h-3 w-3 text-chloe-cyan" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <a href={`https://solscan.io/account/${publicKey!.toBase58()}`} target="_blank" rel="noopener noreferrer" className="text-chloe-ash/50 hover:text-chloe-cyan transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-foreground">${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <span className="font-mono text-[8px] text-chloe-ash/50 uppercase tracking-wider">total value</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.15em]">
                      <span>Token</span>
                      <span>Balance</span>
                      <span className="text-right">Value</span>
                    </div>
                    {balLoading && balances.length === 0 ? (
                      <div className="py-6 text-center font-mono text-[10px] text-chloe-ash/50 animate-pulse">loading balances...</div>
                    ) : balances.length === 0 ? (
                      <div className="py-6 text-center font-mono text-[10px] text-chloe-ash/50">no tokens found</div>
                    ) : (
                      balances.map((b) => {
                        const usdVal = b.balance * (prices[b.symbol]?.price ?? 0);
                        const change = prices[b.symbol]?.change24h;
                        return (
                          <div key={b.mint} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center border border-chloe-elevated/30 bg-chloe-void px-3 py-2 hover:border-chloe-pink/20 transition-colors">
                            <div className="flex items-center gap-2">
                              <Coins className="h-3.5 w-3.5 text-chloe-pink/40" />
                              <div>
                                <span className="font-mono text-[11px] font-bold text-foreground">{b.symbol}</span>
                                <span className="ml-1.5 font-mono text-[8px] text-chloe-ash/50">{b.name}</span>
                              </div>
                              {change !== undefined && (
                                <span className={cn("font-mono text-[8px]", change >= 0 ? "text-chloe-cyan/60" : "text-chloe-blood/60")}>
                                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-chloe-smoke/70">{b.uiBalance}</span>
                            <span className="font-mono text-[11px] text-chloe-ash text-right">${usdVal.toFixed(2)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Two-column: Transactions + Trending */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Transactions */}
              <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-cyan">
                    <Clock className="h-4 w-4" />
                    <span className="text-chloe-cyan/30">♰</span>
                    Transactions
                  </div>
                  {connected && (
                    <button onClick={refreshTx} className="flex items-center gap-1 font-mono text-[8px] text-chloe-ash/60 hover:text-chloe-cyan transition-colors">
                      <RefreshCw className={cn("h-2.5 w-2.5", txLoading && "animate-spin")} />
                    </button>
                  )}
                </div>

                {!connected ? (
                  <p className="py-6 text-center font-mono text-[10px] text-chloe-ash/50">connect wallet to view</p>
                ) : txLoading && transactions.length === 0 ? (
                  <p className="py-6 text-center font-mono text-[10px] text-chloe-ash/50 animate-pulse">loading...</p>
                ) : transactions.length === 0 ? (
                  <p className="py-6 text-center font-mono text-[10px] text-chloe-ash/50">no transactions</p>
                ) : (
                  <div className="space-y-1.5">
                    {transactions.slice(0, 5).map((tx) => (
                      <a key={tx.signature} href={`https://solscan.io/tx/${tx.signature}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between border border-chloe-elevated/30 bg-chloe-void px-2.5 py-1.5 hover:border-chloe-pink/20 transition-colors group">
                        <div className="flex items-center gap-1.5">
                          {tx.err ? <AlertCircle className="h-2.5 w-2.5 text-chloe-blood/60" /> : <Check className="h-2.5 w-2.5 text-chloe-cyan/60" />}
                          <span className="font-mono text-[9px] text-chloe-smoke/70 group-hover:text-chloe-pink transition-colors">{shortenAddress(tx.signature, 6)}</span>
                        </div>
                        <span className="font-mono text-[8px] text-chloe-ash/50">{formatTime(tx.blockTime)}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Trending */}
              <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-blood">
                  <Zap className="h-4 w-4" />
                  <span className="text-chloe-blood/30">✘</span>
                  Trending
                </div>
                <div className="space-y-1.5">
                  {trendLoading && trending.length === 0 ? (
                    <p className="py-6 text-center font-mono text-[10px] text-chloe-ash/50 animate-pulse">loading...</p>
                  ) : trending.length === 0 ? (
                    <p className="py-6 text-center font-mono text-[10px] text-chloe-ash/50">no trending data</p>
                  ) : (
                    trending.map((t, i) => (
                      <div key={t.symbol} className="flex items-center justify-between border border-chloe-elevated/30 bg-chloe-void px-2.5 py-1.5 hover:border-chloe-pink/20 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] text-chloe-ash/50 w-3">{i + 1}</span>
                          <span className="font-mono text-[11px] font-bold text-foreground">{t.symbol}</span>
                          <span className="font-mono text-[7px] text-chloe-ash/50 border border-chloe-elevated/30 px-1">{t.tag}</span>
                          {t.price_change_24h > 5 && <span className="font-mono text-[7px] text-chloe-blood/60">HOT</span>}
                        </div>
                        <span className={cn("font-mono text-[10px]", t.price_change_24h >= 0 ? "text-chloe-cyan" : "text-chloe-blood")}>
                          {t.price_change_24h >= 0 ? "+" : ""}{t.price_change_24h.toFixed(2)}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Market Overview - full width */}
            <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/60">
                <BarChart3 className="h-4 w-4" />
                <span className="text-chloe-pink/20">†</span>
                Market Overview
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(prices).map(([sym, data]) => (
                  <div key={sym} className="border border-chloe-elevated/30 bg-chloe-void p-2.5 hover:border-chloe-pink/20 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-foreground">{sym}</span>
                      <span className={cn("font-mono text-[8px]", data.change24h >= 0 ? "text-chloe-cyan" : "text-chloe-blood")}>
                        {data.change24h >= 0 ? "+" : ""}{data.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-chloe-smoke/70">
                      ${data.price < 0.01 ? data.price.toFixed(8) : data.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    {/* Mini bar */}
                    <div className="mt-1.5 h-0.5 w-full bg-chloe-elevated/20 overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(Math.abs(data.change24h) * 10, 100)}%`,
                          background: data.change24h >= 0 ? "#00FFFF" : "#DC143C",
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pools table */}
            <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-cyan">
                <Droplets className="h-4 w-4" />
                <span className="text-chloe-cyan/30">♰</span>
                Top Liquidity Pools
              </div>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-2 font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.15em]">
                <span>Pair</span>
                <span>TVL</span>
                <span>APR</span>
                <span className="text-right">24h Vol</span>
              </div>
              <div className="space-y-1.5">
                {TOP_POOLS.map((pool) => (
                  <div key={pool.pair} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center border border-chloe-elevated/30 bg-chloe-void px-3 py-2.5 hover:border-chloe-cyan/20 transition-colors">
                    <span className="font-mono text-[11px] font-bold text-foreground">{pool.pair}</span>
                    <span className="font-mono text-[10px] text-chloe-ash/60">{pool.tvl}</span>
                    <span className="font-mono text-[10px] text-chloe-cyan">{pool.apr}</span>
                    <span className="font-mono text-[10px] text-chloe-ash/60 text-right">{pool.vol24h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Pool */}
            <PoolForm />

            {/* Quick actions */}
            <div className="border border-chloe-elevated/80 bg-chloe-abyss/40 p-4 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-chloe-ash/50">
                <Activity className="h-4 w-4" />
                <span className="text-chloe-pink/20">†</span>
                Quick Actions
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href="https://jup.ag" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-chloe-elevated/40 bg-chloe-void px-3 py-2.5 hover:border-chloe-pink/20 transition-colors group">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-chloe-pink/40 group-hover:text-chloe-pink" />
                  <div>
                    <span className="font-mono text-[10px] text-foreground/80 block">Jupiter</span>
                    <span className="font-mono text-[7px] text-chloe-ash/50">Aggregator</span>
                  </div>
                </a>
                <a href="https://raydium.io" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-chloe-elevated/40 bg-chloe-void px-3 py-2.5 hover:border-chloe-cyan/20 transition-colors group">
                  <Droplets className="h-3.5 w-3.5 text-chloe-cyan/40 group-hover:text-chloe-cyan" />
                  <div>
                    <span className="font-mono text-[10px] text-foreground/80 block">Raydium</span>
                    <span className="font-mono text-[7px] text-chloe-ash/50">AMM</span>
                  </div>
                </a>
                <a href="https://solscan.io" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-chloe-elevated/40 bg-chloe-void px-3 py-2.5 hover:border-chloe-pink/20 transition-colors group">
                  <ExternalLink className="h-3.5 w-3.5 text-chloe-pink/40 group-hover:text-chloe-pink" />
                  <div>
                    <span className="font-mono text-[10px] text-foreground/80 block">Solscan</span>
                    <span className="font-mono text-[7px] text-chloe-ash/50">Explorer</span>
                  </div>
                </a>
                <a href="https://phantom.app" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-chloe-elevated/40 bg-chloe-void px-3 py-2.5 hover:border-chloe-cyan/20 transition-colors group">
                  <Shield className="h-3.5 w-3.5 text-chloe-cyan/40 group-hover:text-chloe-cyan" />
                  <div>
                    <span className="font-mono text-[10px] text-foreground/80 block">Phantom</span>
                    <span className="font-mono text-[7px] text-chloe-ash/50">Wallet</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Network Status */}
            <div className="border border-chloe-elevated/40 bg-chloe-void p-3 space-y-2">
              <span className="font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.2em]">† Network Status</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-chloe-ash/60">Network</span>
                  <span className="font-mono text-[9px] text-chloe-cyan">mainnet-beta</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-chloe-ash/60">Aggregator</span>
                  <span className="font-mono text-[9px] text-chloe-pink">Jupiter V6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-chloe-ash/60">RPC</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-chloe-cyan/60 animate-pulse" />
                    <span className="font-mono text-[9px] text-chloe-cyan/60">connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-chloe-ash/60">Wallets</span>
                  <span className="font-mono text-[9px] text-chloe-ash/50">Phantom / Solflare</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="h-px w-6 bg-chloe-blood/10" />
              <span className="text-chloe-blood/12 text-xs font-title">†</span>
              <span className="font-mono text-[7px] text-chloe-ash/50 tracking-[0.2em] uppercase">trade at your own risk</span>
              <span className="text-chloe-blood/10 text-sm font-title">♰</span>
              <span className="h-px w-6 bg-chloe-blood/10" />
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
