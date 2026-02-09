"use client";

import { cn } from "@/lib/utils";

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "pink" | "cyan" | "blood";
}

export function GlowBorder({ children, className, variant = "pink" }: GlowBorderProps) {
  return (
    <div className={cn("fractured-card neon-border overflow-hidden", className)}>
      {variant === "cyan" && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-chloe-cyan/40 to-transparent" />
      )}
      {variant === "blood" && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-chloe-blood/40 to-transparent" />
      )}
      {children}
    </div>
  );
}
