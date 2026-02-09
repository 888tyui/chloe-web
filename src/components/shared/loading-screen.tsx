"use client";

import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
}

export function LoadingScreen({ className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-chloe-void",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="h-32 w-32 border border-chloe-pink/20 animate-pulse-neon" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black font-mono gradient-menheera">C</span>
        </div>
      </div>
      <p className="animate-pulse font-mono text-xs text-chloe-pink tracking-widest uppercase">
        [SYS] Initializing CHLOE...
      </p>
    </div>
  );
}
