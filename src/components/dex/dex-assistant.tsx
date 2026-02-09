"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, Loader2, X, Minimize2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Live2DWrapper } from "@/components/live2d/live2d-wrapper";
import { useBalances } from "@/hooks/use-balances";
import { useTransactions } from "@/hooks/use-transactions";
import { usePrices } from "@/hooks/use-prices";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMsg {
  id: string;
  role: "assistant" | "user";
  content: string;
  insights?: string[];
}

function buildWalletContext(
  connected: boolean,
  address: string | null,
  balances: { symbol: string; balance: number; uiBalance: string }[],
  prices: Record<string, { price: number; change24h: number }>,
  txCount: number
): string {
  if (!connected || !address) return "[Wallet not connected]";

  const balInfo = balances
    .map((b) => {
      const p = prices[b.symbol]?.price ?? 0;
      const usd = (b.balance * p).toFixed(2);
      return `  ${b.symbol}: ${b.uiBalance} ($${usd})`;
    })
    .join("\n");

  const totalUsd = balances.reduce((sum, b) => {
    const p = prices[b.symbol]?.price ?? 0;
    return sum + b.balance * p;
  }, 0);

  return `[Wallet: ${address.slice(0, 6)}...${address.slice(-4)}]
Total Value: $${totalUsd.toFixed(2)}
Tokens:
${balInfo || "  (no tokens)"}
Recent Txs: ${txCount}`;
}

const INITIAL_MSG: ChatMsg = {
  id: "init",
  role: "assistant",
  content:
    "need help with your wallet? ask me about balances, transactions, or token prices. I see everything. ♡",
  insights: ["Connect your wallet to get started", "I can analyze your portfolio"],
};

export function DexAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { connected, publicKey } = useWallet();
  const { balances } = useBalances();
  const { transactions } = useTransactions(10);
  const { prices } = usePrices();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const walletCtx = buildWalletContext(
        connected,
        publicKey?.toBase58() ?? null,
        balances,
        prices,
        transactions.length
      );

      const contextMessage = `[WALLET CONTEXT]\n${walletCtx}\n\n[USER QUESTION]\n${text}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contextMessage,
          history: messages
            .filter((m) => m.id !== "init")
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
          context: "dex",
        }),
      });

      const data = await res.json();
      const replyContent = data.message || data.content || "...I couldn't process that. try again? †";
      const insights = Array.isArray(data.insights) ? data.insights : undefined;

      const reply: ChatMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyContent,
        insights,
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "connection lost... try again. †",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, connected, publicKey, balances, prices, transactions, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center border border-chloe-pink/30 bg-chloe-void/95 backdrop-blur-sm text-chloe-pink hover:bg-chloe-pink/10 hover:border-chloe-pink/60 hover:shadow-[0_0_20px_#FF149330] transition-all"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[360px] h-[580px] flex-col border border-chloe-pink/20 bg-chloe-void/98 backdrop-blur-xl shadow-[0_0_40px_#0A0A0A80,0_0_15px_#FF149310]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-chloe-elevated/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-chloe-pink animate-pulse" />
              <span className="font-mono text-[9px] text-chloe-pink/60 uppercase tracking-[0.3em]">
                † Wallet Assistant
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-chloe-ash/50 hover:text-chloe-pink transition-colors"
              >
                <Minimize2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMessages([INITIAL_MSG]);
                }}
                className="p-1 text-chloe-ash/50 hover:text-chloe-blood transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Live2D mini model */}
          <div className="relative h-[200px] shrink-0 bg-chloe-abyss/60 border-b border-chloe-elevated/20 overflow-hidden">
            <Live2DWrapper
              className="h-full w-full"
              scaleMultiplier={3.0}
              offsetY={1.5}
            />
            <div className="absolute bottom-2 left-3 font-mono text-[7px] text-chloe-ash/50 tracking-[0.3em] uppercase">
              {connected ? (
                <span className="text-chloe-cyan/40">
                  wallet connected ♡
                </span>
              ) : (
                <span className="text-chloe-ash/50">
                  no wallet †
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-0.5",
                  msg.role === "user" && "items-end"
                )}
              >
                {msg.role === "assistant" && (
                  <span className="font-mono text-[7px] text-chloe-pink/30 tracking-wider uppercase">
                    chloe
                  </span>
                )}
                <div
                  className={cn(
                    "font-mono text-[10px] leading-relaxed whitespace-pre-wrap max-w-[85%]",
                    msg.role === "assistant"
                      ? "text-chloe-smoke/80 border-l border-chloe-pink/15 pl-2"
                      : "text-foreground bg-chloe-elevated/20 border border-chloe-elevated/40 px-2 py-1"
                  )}
                >
                  {msg.content}
                </div>
                {/* Insights tags */}
                {msg.insights && msg.insights.length > 0 && msg.role === "assistant" && (
                  <div className="flex flex-wrap gap-1 mt-1 pl-2">
                    {msg.insights.map((insight, i) => (
                      <span
                        key={i}
                        className="font-mono text-[8px] text-chloe-cyan/40 border border-chloe-cyan/15 bg-chloe-cyan/5 px-1.5 py-0.5"
                      >
                        {insight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-2.5 w-2.5 text-chloe-pink/40 animate-spin" />
                <span className="font-mono text-[8px] text-chloe-ash/50">
                  thinking...
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-chloe-elevated/30 p-2">
            <div className="flex gap-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ask about your wallet..."
                disabled={loading}
                className="flex-1 bg-chloe-abyss/40 border border-chloe-elevated/40 px-2.5 py-1.5 font-mono text-[10px] text-foreground placeholder:text-chloe-ash/50 focus:outline-none focus:border-chloe-pink/25 disabled:opacity-40"
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="sm"
                className="h-auto px-2.5 bg-chloe-pink text-white hover:bg-chloe-pink-hot disabled:opacity-25"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
