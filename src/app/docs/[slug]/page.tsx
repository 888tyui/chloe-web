"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocRenderer } from "@/components/docs/doc-renderer";
import { getDocBySlug } from "@/lib/docs-data";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export default function DocPage({ params }: DocPageProps) {
  const { slug } = use(params);
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="relative mx-auto flex max-w-7xl gap-8 px-4 py-12 bg-chloe-void min-h-[calc(100vh-4rem)]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block select-none">
        <div className="absolute top-[15%] right-[3%] text-[18px] text-chloe-pink/5 font-title rotate-12">†</div>
        <div className="absolute bottom-[25%] left-[1%] text-[14px] text-chloe-blood/4 font-title -rotate-6">♰</div>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <DocsSidebar />
        </div>
      </aside>

      {/* Content */}
      <div className="relative z-10 flex-1 min-w-0">
        <DocRenderer doc={doc} />
      </div>
    </div>
  );
}
