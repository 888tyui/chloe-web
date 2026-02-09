"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOCS, DOC_CATEGORIES } from "@/lib/docs-data";

export function DocsSidebar() {
  const pathname = usePathname();

  const grouped = DOC_CATEGORIES.map((cat) => ({
    ...cat,
    docs: DOCS.filter((d) => d.category === cat.name),
  }));

  return (
    <nav className="w-full space-y-5">
      <div className="flex items-center gap-2 px-3">
        <span className="text-chloe-pink/30 text-sm font-title">†</span>
        <span className="font-mono font-bold text-[9px] uppercase tracking-[0.3em] text-chloe-smoke/80">
          Documentation
        </span>
      </div>

      <Link
        href="/docs"
        className={cn(
          "flex items-center gap-2 px-3 py-2 font-mono text-[10px] transition-all duration-200 border-l-2",
          pathname === "/docs"
            ? "bg-chloe-pink/8 text-chloe-pink border-chloe-pink"
            : "text-chloe-smoke/70 hover:text-chloe-pink hover:bg-chloe-pink/5 border-transparent"
        )}
      >
        Overview
      </Link>

      {grouped.map((cat) => (
        <div key={cat.name}>
          <div className="flex items-center gap-1.5 px-3 mb-1.5">
            <span className="text-chloe-pink/15 text-[9px]">{cat.icon}</span>
            <span className="font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.25em]">
              {cat.name}
            </span>
            <span className="h-px flex-1 bg-chloe-elevated/20" />
          </div>
          {cat.docs.map((doc) => {
            const href = `/docs/${doc.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={doc.slug}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] transition-all duration-200 border-l-2",
                  isActive
                    ? "bg-chloe-pink/8 text-chloe-pink border-chloe-pink"
                    : "text-chloe-smoke/70 hover:bg-chloe-pink/5 hover:text-chloe-pink border-transparent"
                )}
              >
                <span className={cn("text-[9px] transition-colors", isActive ? "text-chloe-pink/50" : "text-chloe-ash/60")}>
                  {doc.glyph}
                </span>
                {doc.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
