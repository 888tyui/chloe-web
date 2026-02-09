import { PublicKey } from "@solana/web3.js";

export function createSignInMessage(
  nonce: string,
  publicKey: string
): string {
  return `Sign in to CHLOE with your Solana wallet.

Wallet: ${publicKey}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any SOL.`;
}

export function verifyPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
