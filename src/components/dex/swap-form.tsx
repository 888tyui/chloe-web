"use client";

import { useState } from "react";
import { ArrowDownUp, Loader2, Settings2, CheckCircle2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TokenSelector } from "./token-selector";
import { TOKEN_LIST, type TokenInfo } from "@/lib/jupiter";
import { usePrices } from "@/hooks/use-prices";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SLIPPAGE_OPTIONS = ["0.1", "0.5", "1.0", "3.0"];

export function SwapForm() {
  const { connected, publicKey } = useWallet();
  const { prices } = usePrices();
  const [fromToken, setFromToken] = useState<TokenInfo>(TOKEN_LIST[0]); // SOL
  const [toToken, setToToken] = useState<TokenInfo>(TOKEN_LIST[1]); // USDC
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [lastSwap, setLastSwap] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<{
    priceImpact: string;
    route: string;
  } | null>(null);

  const handleAmountChange = async (value: string) => {
    setFromAmount(value);
    if (!value || isNaN(parseFloat(value))) {
      setToAmount("");
      setQuoteData(null);
      return;
    }

    const fromPrice = prices[fromToken.symbol]?.price || 0;
    const toPrice = prices[toToken.symbol]?.price || 0;
    if (fromPrice && toPrice) {
      const estimate = (parseFloat(value) * fromPrice) / toPrice;
      setToAmount(estimate.toFixed(toToken.decimals > 2 ? 6 : 2));
      setQuoteData({
        priceImpact: (Math.random() * 0.5).toFixed(2),
        route: `${fromToken.symbol} -> ${toToken.symbol} (Jupiter V6)`,
      });
    }
  };

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!connected || !publicKey) {
      toast.error("Connect your wallet first");
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Enter an amount to swap");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const swapSummary = `${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`;
      setLastSwap(swapSummary);
      toast.success(`Swap simulated: ${swapSummary}`);
      setTimeout(() => setLastSwap(null), 5000);
    } catch {
      toast.error("Swap failed. Connection severed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-chloe-elevated/80 bg-chloe-abyss/40 p-6 space-y-5 transition-all hover:border-chloe-pink/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="gradient-menheera text-xl font-black font-mono uppercase tracking-wider">
          Swap
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-1.5 border transition-all",
              showSettings
                ? "border-chloe-pink/40 text-chloe-pink bg-chloe-pink/5"
                : "border-chloe-elevated/60 text-chloe-ash/70 hover:text-chloe-pink hover:border-chloe-pink/30"
            )}
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[10px] text-chloe-cyan border border-chloe-cyan/20 px-2 py-0.5 tracking-wider">
            JUPITER V6
          </span>
        </div>
      </div>

      {/* Slippage settings */}
      {showSettings && (
        <div className="border border-chloe-elevated/60 bg-chloe-void p-3 space-y-2">
          <span className="font-mono text-[9px] text-chloe-ash/80 uppercase tracking-[0.2em]">
            † Slippage Tolerance
          </span>
          <div className="flex gap-1.5">
            {SLIPPAGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSlippage(opt)}
                className={cn(
                  "flex-1 font-mono text-[10px] py-1 border transition-all",
                  slippage === opt
                    ? "border-chloe-pink/40 bg-chloe-pink/10 text-chloe-pink"
                    : "border-chloe-elevated/60 text-chloe-ash/70 hover:border-chloe-pink/30"
                )}
              >
                {opt}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Last swap indicator */}
      {lastSwap && (
        <div className="flex items-center gap-2 border border-chloe-cyan/20 bg-chloe-cyan/5 p-2 font-mono text-[10px] text-chloe-cyan">
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{lastSwap}</span>
        </div>
      )}

      {/* From */}
      <div className="space-y-2">
        <Label className="text-[10px] font-mono uppercase tracking-wider text-chloe-ash">
          You Pay
        </Label>
        <div className="flex gap-2">
          <TokenSelector
            selected={fromToken}
            onSelect={setFromToken}
            excludeMint={toToken.mint}
          />
          <Input
            type="number"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 border-chloe-pink/20 bg-chloe-void text-right font-mono text-lg text-foreground focus-visible:ring-chloe-pink"
          />
        </div>
        {prices[fromToken.symbol] && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-chloe-ash/70">
              1 {fromToken.symbol} = ${prices[fromToken.symbol].price.toFixed(2)}
            </span>
            <span className="font-mono text-[10px] text-chloe-ash">
              ~$
              {(
                parseFloat(fromAmount || "0") *
                prices[fromToken.symbol].price
              ).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Swap direction button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSwapTokens}
          className="rounded-none border border-chloe-pink/30 bg-transparent text-chloe-pink hover:bg-chloe-pink/10 hover:shadow-[0_0_10px_#FF149330] transition-all"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>

      {/* To */}
      <div className="space-y-2">
        <Label className="text-[10px] font-mono uppercase tracking-wider text-chloe-ash">
          You Receive
        </Label>
        <div className="flex gap-2">
          <TokenSelector
            selected={toToken}
            onSelect={setToToken}
            excludeMint={fromToken.mint}
          />
          <Input
            type="number"
            placeholder="0.00"
            value={toAmount}
            readOnly
            className="flex-1 border-chloe-cyan/20 bg-chloe-surface text-right font-mono text-lg text-foreground"
          />
        </div>
        {prices[toToken.symbol] && toAmount && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-chloe-ash/70">
              1 {toToken.symbol} = ${prices[toToken.symbol].price.toFixed(2)}
            </span>
            <span className="font-mono text-[10px] text-chloe-ash">
              ~$
              {(
                parseFloat(toAmount || "0") * prices[toToken.symbol].price
              ).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Route info */}
      {quoteData && (
        <div className="space-y-1.5 border border-chloe-pink/10 bg-chloe-void p-3">
          <div className="flex justify-between font-mono text-[10px] text-chloe-ash">
            <span className="uppercase tracking-wider">Route</span>
            <span className="text-chloe-cyan">{quoteData.route}</span>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-chloe-ash">
            <span className="uppercase tracking-wider">Price Impact</span>
            <span className={cn(
              "text-chloe-cyan",
              parseFloat(quoteData.priceImpact) > 0.3 && "text-chloe-blood"
            )}>
              {quoteData.priceImpact}%
            </span>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-chloe-ash">
            <span className="uppercase tracking-wider">Slippage</span>
            <span className="text-chloe-pink">{slippage}%</span>
          </div>
          {fromAmount && toAmount && (
            <div className="flex justify-between font-mono text-[10px] text-chloe-ash">
              <span className="uppercase tracking-wider">Rate</span>
              <span className="text-foreground">
                1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Swap action */}
      <button
        onClick={handleSwap}
        disabled={loading || !fromAmount}
        className="btn-brutal w-full py-3 px-6 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Executing...
          </span>
        ) : !connected ? (
          "Connect Wallet"
        ) : (
          "Execute Swap"
        )}
      </button>

      {/* Swap disclaimer */}
      <p className="text-center font-mono text-[8px] text-chloe-ash/70 tracking-wider">
        † Simulated swap · Connect wallet for real execution ♰
      </p>
    </div>
  );
}
