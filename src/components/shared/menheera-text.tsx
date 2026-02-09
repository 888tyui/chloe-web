"use client";

import { cn } from "@/lib/utils";

type Variant = "cross" | "diamond" | "heart" | "star" | "void";

const DECORATORS: Record<Variant, { left: string; right: string; color: string }> = {
  cross: { left: "✝ ", right: " ✝", color: "text-chloe-pink" },
  diamond: { left: "◆ ", right: " ◆", color: "text-chloe-blood" },
  heart: { left: "♡ ", right: " ♡", color: "text-chloe-blood" },
  star: { left: "★ ", right: " ★", color: "text-chloe-cyan" },
  void: { left: "▪ ", right: " ▪", color: "text-chloe-ash" },
};

interface MenheeraTextProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  glitch?: boolean;
}

export function MenheeraText({
  children,
  variant = "cross",
  className,
  as: Tag = "span",
  glitch = false,
}: MenheeraTextProps) {
  const deco = DECORATORS[variant];
  return (
    <Tag className={cn("font-bold uppercase tracking-wider", className)}>
      <span className={cn("text-sm", deco.color)}>{deco.left}</span>
      {glitch ? (
        <span className="glitch-text" data-text={typeof children === "string" ? children : ""}>
          {children}
        </span>
      ) : (
        children
      )}
      <span className={cn("text-sm", deco.color)}>{deco.right}</span>
    </Tag>
  );
}
