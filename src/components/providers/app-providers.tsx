"use client";

import { SessionProvider } from "next-auth/react";
import { SolanaProvider } from "./solana-provider";
import { Toaster } from "@/components/ui/sonner";
import { UISoundProvider } from "./ui-sound-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SolanaProvider>
        <UISoundProvider />
        {children}
        <Toaster position="bottom-right" />
      </SolanaProvider>
    </SessionProvider>
  );
}
