"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export interface TxRecord {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: boolean;
  memo: string | null;
}

export function useTransactions(limit = 10) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [transactions, setTransactions] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTxs = useCallback(async () => {
    if (!publicKey || !connected) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      const sigs = await connection.getSignaturesForAddress(publicKey, { limit });

      setTransactions(
        sigs.map((s) => ({
          signature: s.signature,
          slot: s.slot,
          blockTime: s.blockTime ?? null,
          err: !!s.err,
          memo: s.memo ?? null,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, connection, limit]);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs]);

  return { transactions, loading, refresh: fetchTxs };
}
