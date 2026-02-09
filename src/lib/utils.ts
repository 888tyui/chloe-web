import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "CHLOE";
export const SITE_DESCRIPTION =
  "AI Waifu Agent with Live2D, Solana DeFi, and Code Generation";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Agent", href: "/agent" },
  { label: "DEX", href: "/dex" },
  { label: "Coder", href: "/coder" },
  { label: "Docs", href: "/docs" },
] as const;

export const SOLANA_NETWORK = "mainnet-beta" as const;
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
