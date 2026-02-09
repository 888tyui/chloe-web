"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_LIST } from "@/lib/jupiter";

export interface TokenBalance {
  symbol: string;
  name: string;
  mint: string;
  balance: number;
  uiBalance: string;
  decimals: number;
}

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedBalances {
  balances: TokenBalance[];
  solBalance: number;
  timestamp: number;
}

function getCacheKey(wallet: string) {
  return `chloe_balances_${wallet}`;
}

function loadCache(wallet: string): CachedBalances | null {
  try {
    const raw = localStorage.getItem(getCacheKey(wallet));
    if (!raw) return null;
    const cached: CachedBalances = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(getCacheKey(wallet));
      return null;
    }
    return cached;
  } catch {
    return null;
  }
}

function saveCache(wallet: string, balances: TokenBalance[], solBalance: number) {
  try {
    const data: CachedBalances = { balances, solBalance, timestamp: Date.now() };
    localStorage.setItem(getCacheKey(wallet), JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function useBalances() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchBalances = useCallback(async (forceRefresh = false) => {
    if (!publicKey || !connected) {
      setBalances([]);
      setSolBalance(0);
      return;
    }

    const walletKey = publicKey.toBase58();

    // Check localStorage cache first
    if (!forceRefresh) {
      const cached = loadCache(walletKey);
      if (cached) {
        setBalances(cached.balances);
        setSolBalance(cached.solBalance);
        setLastUpdated(cached.timestamp);
        return;
      }
    }

    setLoading(true);
    try {
      // Fetch SOL balance
      const lamports = await connection.getBalance(publicKey);
      const sol = lamports / LAMPORTS_PER_SOL;
      setSolBalance(sol);

      // Fetch SPL token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const knownMints = new Map<string, (typeof TOKEN_LIST)[number]>(TOKEN_LIST.map((t) => [t.mint, t]));
      const result: TokenBalance[] = [
        {
          symbol: "SOL",
          name: "Solana",
          mint: TOKEN_LIST[0].mint,
          balance: sol,
          uiBalance: sol.toFixed(4),
          decimals: 9,
        },
      ];

      for (const { account } of tokenAccounts.value) {
        const parsed = account.data.parsed?.info;
        if (!parsed) continue;

        const mint: string = parsed.mint;
        const tokenInfo = knownMints.get(mint);
        if (!tokenInfo) continue;

        const amount = parsed.tokenAmount;
        if (!amount || parseFloat(amount.uiAmountString || "0") === 0) continue;

        result.push({
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          mint,
          balance: parseFloat(amount.uiAmountString || "0"),
          uiBalance: amount.uiAmountString || "0",
          decimals: tokenInfo.decimals,
        });
      }

      setBalances(result);
      setLastUpdated(Date.now());
      saveCache(walletKey, result, sol);
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, connection]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, solBalance, loading, lastUpdated, refresh: () => fetchBalances(true) };
}
