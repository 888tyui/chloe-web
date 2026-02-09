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

export function useBalances() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalances([]);
      setSolBalance(0);
      return;
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
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, connection]);

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  return { balances, solBalance, loading, lastUpdated, refresh: fetchBalances };
}
