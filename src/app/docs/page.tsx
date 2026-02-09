"use client";

import { useState } from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DOCS, DOC_CATEGORIES } from "@/lib/docs-data";
import { Search, Clock, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredDocs = DOCS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = DOC_CATEGORIES.map((cat) => ({
    ...cat,
    docs: filteredDocs.filter((d) => d.category === cat.name),
  })).filter((g) => g.docs.length > 0);

  return (
    <div className="relative mx-auto flex max-w-7xl gap-8 px-4 py-12 bg-chloe-void min-h-[calc(100vh-4rem)]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block select-none">
        <div className="absolute top-[10%] right-[5%] text-[22px] text-chloe-pink/5 font-title rotate-6">†</div>
        <div className="absolute bottom-[20%] left-[2%] text-[18px] text-chloe-blood/4 font-title -rotate-12">♰</div>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <DocsSidebar />
        </div>
      </aside>

      {/* Content */}
      <div className="relative z-10 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-chloe-pink/20" />
            <span className="font-mono text-[8px] text-chloe-pink/40 tracking-[0.6em] uppercase">
              the archive
            </span>
            <span className="h-px w-8 bg-chloe-pink/20" />
          </div>
          <h1 className="text-5xl font-title uppercase tracking-tight">
            <span className="gradient-menheera">SHE</span>
            <span className="text-chloe-blood/40 mx-2 text-3xl align-middle">♰</span>
            <span className="gradient-menheera">KNOWS</span>
          </h1>
          <p className="mt-3 font-mono text-[11px] text-chloe-smoke/70 tracking-wider leading-relaxed max-w-lg">
            Everything about her world, her rituals, and the void she inhabits.
            <span className="text-chloe-pink/20 mx-1.5">†</span>
            {DOCS.length} chapters
            <span className="text-chloe-blood/15 mx-1.5">♰</span>
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div
            className={cn(
              "flex items-center gap-2 border bg-chloe-void px-4 py-2.5 transition-all duration-300",
              searchFocused
                ? "border-chloe-pink/40 shadow-[0_0_20px_#FF149315]"
                : "border-chloe-elevated/60 hover:border-chloe-elevated"
            )}
          >
            <Search className={cn("h-4 w-4 shrink-0 transition-colors", searchFocused ? "text-chloe-pink/60" : "text-chloe-ash/50")} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search her knowledge..."
              className="flex-1 bg-transparent font-mono text-[12px] text-foreground outline-none placeholder:text-chloe-ash/50 caret-chloe-pink"
            />
            {searchQuery && (
              <span className="font-mono text-[9px] text-chloe-ash/60">
                {filteredDocs.length} result{filteredDocs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 border border-chloe-elevated/30 bg-chloe-abyss/30 px-3 py-1.5">
            <BookOpen className="h-3 w-3 text-chloe-pink/40" />
            <span className="font-mono text-[9px] text-chloe-smoke/70">{DOCS.length} chapters</span>
          </div>
          <div className="flex items-center gap-2 border border-chloe-elevated/30 bg-chloe-abyss/30 px-3 py-1.5">
            <Clock className="h-3 w-3 text-chloe-cyan/40" />
            <span className="font-mono text-[9px] text-chloe-smoke/70">~43 min total read</span>
          </div>
        </div>

        {/* Grouped cards */}
        {grouped.map((cat) => (
          <div key={cat.name} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-chloe-pink/20 text-[10px]">{cat.icon}</span>
              <span className="font-mono text-[10px] text-chloe-ash/60 uppercase tracking-[0.25em]">{cat.name}</span>
              <span className="h-px flex-1 bg-chloe-elevated/15" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.docs.map((doc, idx) => (
                <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                  <div className="group relative border border-chloe-elevated/60 bg-chloe-abyss/30 p-5 transition-all duration-300 hover:border-chloe-pink/25 hover:bg-chloe-abyss/50 hover:shadow-[0_0_25px_#FF149308] hover:-translate-y-0.5">
                    {/* Index */}
                    <span className="absolute top-2 right-3 font-mono text-[8px] text-chloe-ash/40">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    {/* Color bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1"
                      style={{ backgroundColor: doc.color + "40" }} />

                    <div className="pl-2">
                      <h3 className="font-mono font-bold text-[13px] uppercase tracking-wider text-foreground group-hover:text-chloe-pink transition-colors flex items-center gap-1.5">
                        <span className="text-[10px] opacity-30" style={{ color: doc.color }}>{doc.glyph}</span>
                        {doc.title}
                      </h3>
                      <p className="mt-1.5 font-mono text-[10px] text-chloe-smoke/70 leading-relaxed">
                        {doc.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 font-mono text-[8px] text-chloe-ash/50">
                          <Clock className="h-2.5 w-2.5" />
                          {doc.readTime}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[8px] text-chloe-pink/0 group-hover:text-chloe-pink/50 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                          Read <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <span className="font-mono text-[12px] text-chloe-ash/50 tracking-wider">
              She knows nothing about &quot;{searchQuery}&quot;
            </span>
          </div>
        )}

        {/* Footer decoration */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-chloe-pink/10 text-xs font-title">†</span>
          <span className="h-px w-8 bg-chloe-pink/8" />
          <span className="text-chloe-blood/8 text-sm font-title">♰</span>
          <span className="h-px w-8 bg-chloe-blood/8" />
          <span className="text-chloe-cyan/8 text-xs font-title">✘</span>
        </div>
      </div>
    </div>
  );
}
