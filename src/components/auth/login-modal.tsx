"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleWalletConnect = () => {
    onOpenChange(false);
    setTimeout(() => setVisible(true), 150);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-chloe-pink/15 bg-chloe-void p-0 sm:max-w-[400px] rounded-none overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="border-b border-chloe-elevated/30 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-chloe-pink/30 text-sm">†</span>
              <DialogTitle className="font-title text-xl uppercase tracking-[0.15em] gradient-menheera bg-clip-text text-transparent">
                Connect Wallet
              </DialogTitle>
              <span className="text-chloe-pink/30 text-sm">♰</span>
            </div>
            <DialogDescription className="font-mono text-[10px] text-chloe-ash/70 tracking-wider">
              link your Solana wallet to enter the void
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          <div className="space-y-4">
            {connected && publicKey ? (
              <>
                <div className="border border-chloe-cyan/20 bg-chloe-abyss/40 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-chloe-cyan animate-pulse" />
                    <span className="font-mono text-[10px] text-chloe-cyan uppercase tracking-wider">
                      Connected
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-chloe-smoke/80 break-all">
                    {publicKey.toBase58()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onOpenChange(false)}
                    className="flex-1 bg-chloe-pink text-white hover:bg-chloe-pink-hot hover:shadow-[0_0_15px_#FF149340] font-mono text-[10px] uppercase tracking-wider rounded-none h-10"
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="border-chloe-blood/30 text-chloe-blood hover:bg-chloe-blood/10 hover:border-chloe-blood/50 font-mono text-[10px] uppercase tracking-wider rounded-none h-10"
                  >
                    Disconnect
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] text-chloe-ash/70 leading-relaxed">
                  connect your Solana wallet to access DEX features, portfolio
                  tracking, and token swaps.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleWalletConnect}
                    className="w-full bg-transparent border border-chloe-pink/30 text-chloe-pink hover:bg-chloe-pink/10 hover:border-chloe-pink/60 hover:shadow-[0_0_15px_#FF149320] font-mono text-[10px] uppercase tracking-wider rounded-none h-11 flex items-center gap-2.5"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                    <span className="text-chloe-pink/30 ml-auto">†</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="h-px flex-1 bg-chloe-elevated/20" />
                  <span className="font-mono text-[8px] text-chloe-ash/50 tracking-wider">
                    Phantom / Solflare
                  </span>
                  <span className="h-px flex-1 bg-chloe-elevated/20" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-chloe-elevated/20 px-6 py-3 flex items-center justify-center">
          <span className="font-mono text-[7px] text-chloe-ash/40 tracking-[0.3em] uppercase">
            † chloe wallet system ♰
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
