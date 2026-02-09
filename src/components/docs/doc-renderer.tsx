"use client";

import { useState, useEffect, useRef } from "react";
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocElement, DocPage, DocSection, DocDiagram as DocDiagramType } from "@/lib/docs-data";

/* ═══════════════════════════════════════
   TABLE OF CONTENTS — scroll tracking
   ═══════════════════════════════════════ */
function TableOfContents({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="space-y-0.5">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-chloe-pink/25 text-[10px]">†</span>
        <span className="font-mono text-[8px] text-chloe-ash/60 uppercase tracking-[0.3em]">
          On This Page
        </span>
      </div>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={cn(
            "block py-1 pl-3 font-mono text-[10px] border-l-2 transition-all duration-200",
            activeId === s.id
              ? "border-chloe-pink text-chloe-pink bg-chloe-pink/5"
              : "border-transparent text-chloe-ash/60 hover:text-chloe-smoke hover:border-chloe-elevated"
          )}
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════
   INLINE TEXT PARSER — **bold**, `code`, [link](url)
   ═══════════════════════════════════════ */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-foreground font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="bg-chloe-surface border border-chloe-pink/10 px-1.5 py-0.5 text-[10px] font-mono text-chloe-pink">
              {part.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
              className="text-chloe-cyan hover:text-chloe-cyan/80 underline underline-offset-2 inline-flex items-center gap-0.5">
              {linkMatch[1]}<ExternalLink className="h-2.5 w-2.5" />
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ═══════════════════════════════════════
   CODE BLOCK with copy button
   ═══════════════════════════════════════ */
function CodeBlock({ code, language, filename }: { code: string; language: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative border border-chloe-elevated/60 bg-chloe-abyss/80 overflow-hidden doc-element">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chloe-elevated/40 px-3 py-1.5">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="font-mono text-[9px] text-chloe-smoke/70">{filename}</span>
          )}
          <span className="font-mono text-[8px] text-chloe-ash/50 uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 font-mono text-[8px] text-chloe-ash/50 hover:text-chloe-pink transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <><Check className="h-2.5 w-2.5 text-chloe-cyan" /> copied</>
          ) : (
            <><Copy className="h-2.5 w-2.5" /> copy</>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[11px] text-chloe-smoke/80 leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ═══════════════════════════════════════
   CALLOUT BOX
   ═══════════════════════════════════════ */
const CALLOUT_CONFIG = {
  info: { icon: Info, borderColor: "border-chloe-cyan/30", iconColor: "text-chloe-cyan", bgColor: "bg-chloe-cyan/5", titleColor: "text-chloe-cyan" },
  warning: { icon: AlertTriangle, borderColor: "border-yellow-500/30", iconColor: "text-yellow-500", bgColor: "bg-yellow-500/5", titleColor: "text-yellow-500" },
  danger: { icon: AlertOctagon, borderColor: "border-chloe-blood/30", iconColor: "text-chloe-blood", bgColor: "bg-chloe-blood/5", titleColor: "text-chloe-blood" },
  tip: { icon: Lightbulb, borderColor: "border-chloe-pink/30", iconColor: "text-chloe-pink", bgColor: "bg-chloe-pink/5", titleColor: "text-chloe-pink" },
};

function Callout({ variant, title, text }: { variant: keyof typeof CALLOUT_CONFIG; title: string; text: string }) {
  const config = CALLOUT_CONFIG[variant];
  const Icon = config.icon;
  return (
    <div className={cn("border-l-2 p-4 doc-element", config.borderColor, config.bgColor)}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
        <span className={cn("font-mono text-[11px] font-bold uppercase tracking-wider", config.titleColor)}>
          {title}
        </span>
      </div>
      <p className="font-mono text-[11px] text-chloe-smoke/70 leading-relaxed">
        <RichText text={text} />
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEPS
   ═══════════════════════════════════════ */
function Steps({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="space-y-0 doc-element">
      {items.map((item, i) => (
        <div key={i} className="group flex gap-4 pb-6 last:pb-0 relative">
          {/* Connector line */}
          {i < items.length - 1 && (
            <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-chloe-elevated/40 group-hover:bg-chloe-pink/20 transition-colors" />
          )}
          {/* Step number */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-chloe-elevated/60 bg-chloe-void font-mono text-[11px] font-bold text-chloe-ash/50 group-hover:border-chloe-pink/40 group-hover:text-chloe-pink group-hover:shadow-[0_0_10px_#FF149315] transition-all">
            {(i + 1).toString().padStart(2, "0")}
          </div>
          <div className="flex-1 pt-1">
            <h4 className="font-mono text-[12px] font-bold text-foreground group-hover:text-chloe-pink transition-colors">
              {item.title}
            </h4>
            <p className="mt-1 font-mono text-[10px] text-chloe-smoke/80 leading-relaxed">
              <RichText text={item.desc} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   FEATURE GRID
   ═══════════════════════════════════════ */
function FeatureGrid({ items }: { items: { icon: string; title: string; desc: string; color?: string }[] }) {
  return (
    <div className={cn("grid gap-3 doc-element", items.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
      {items.map((item, i) => (
        <div key={i} className="group border border-chloe-elevated/50 bg-chloe-abyss/30 p-4 hover:border-chloe-pink/20 hover:bg-chloe-abyss/50 hover:shadow-[0_0_15px_#FF149308] transition-all duration-200">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-lg">{item.icon}</span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground group-hover:text-chloe-pink transition-colors">
              {item.title}
            </span>
          </div>
          <p className="font-mono text-[10px] text-chloe-smoke/70 leading-relaxed">
            <RichText text={item.desc} />
          </p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   KEY-VALUE PAIRS
   ═══════════════════════════════════════ */
function KeyValueList({ items }: { items: { key: string; value: string; badge?: string }[] }) {
  return (
    <div className="space-y-1.5 doc-element">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between border border-chloe-elevated/40 bg-chloe-void px-3 py-2.5 hover:border-chloe-pink/15 transition-colors group">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-2.5 w-2.5 text-chloe-pink/30 group-hover:text-chloe-pink/60 transition-colors" />
            <span className="font-mono text-[11px] font-bold text-foreground">{item.key}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-chloe-smoke/70">
              <RichText text={item.value} />
            </span>
            {item.badge && (
              <span className="font-mono text-[7px] text-chloe-cyan/60 border border-chloe-cyan/20 px-1.5 py-0.5 uppercase tracking-wider">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   DATA TABLE
   ═══════════════════════════════════════ */
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto doc-element">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border border-chloe-elevated/40 bg-chloe-abyss/60 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-chloe-pink/60 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="group hover:bg-chloe-pink/3 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="border border-chloe-elevated/30 px-3 py-2 font-mono text-[10px] text-chloe-smoke/70">
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════
   QUOTE BLOCK
   ═══════════════════════════════════════ */
function QuoteBlock({ text, author }: { text: string; author?: string }) {
  return (
    <div className="relative my-6 doc-element">
      {/* Decorative cross */}
      <span className="absolute -left-1 -top-2 text-chloe-pink/15 text-xl font-title select-none">♰</span>
      <blockquote className="border-l-2 border-chloe-pink/30 bg-chloe-pink/[0.03] pl-5 pr-4 py-4 ml-2">
        <p className="font-mono text-[12px] text-chloe-smoke/80 leading-relaxed italic">
          &ldquo;{text}&rdquo;
        </p>
        {author && (
          <footer className="mt-2 flex items-center gap-2">
            <span className="h-px w-4 bg-chloe-pink/20" />
            <span className="font-mono text-[9px] text-chloe-pink/50 uppercase tracking-[0.2em]">
              {author}
            </span>
          </footer>
        )}
      </blockquote>
    </div>
  );
}

/* ═══════════════════════════════════════
   INTERACTIVE ARCHITECTURE DIAGRAM
   ═══════════════════════════════════════ */
function DiagramView({ diagram }: { diagram: DocDiagramType }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const hoveredData = diagram.nodes.find((n) => n.id === hoveredNode);

  const handleNodeHover = (nodeId: string, e: React.MouseEvent) => {
    setHoveredNode(nodeId);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="relative doc-element my-6">
      <div
        ref={containerRef}
        className="relative w-full border border-chloe-elevated/50 bg-chloe-abyss/40 overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="doc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF1493" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#doc-grid)" />
        </svg>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad-pink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1493" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF1493" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="line-grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {diagram.connections.map((conn, i) => {
            const from = diagram.nodes.find((n) => n.id === conn.from);
            const to = diagram.nodes.find((n) => n.id === conn.to);
            if (!from || !to) return null;

            const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isHighlighted ? "#FF1493" : "#3A3A4A"}
                  strokeWidth={isHighlighted ? "0.4" : "0.2"}
                  strokeDasharray={isHighlighted ? "none" : "1 1"}
                  className="transition-all duration-300"
                />
                {/* Animated pulse dot on highlighted connections */}
                {isHighlighted && (
                  <circle r="0.6" fill="#FF1493" opacity="0.8">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                  </circle>
                )}
                {/* Connection label */}
                {conn.label && (
                  <text
                    x={midX}
                    y={midY - 1.5}
                    textAnchor="middle"
                    fill={isHighlighted ? "#FF1493" : "#3A3A4A"}
                    fontSize="2"
                    fontFamily="monospace"
                    className="transition-all duration-300 uppercase select-none"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {diagram.nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isConnected = diagram.connections.some(
            (c) => (c.from === node.id || c.to === node.id) && (c.from === hoveredNode || c.to === hoveredNode)
          );

          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center gap-1 cursor-pointer"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 20 : 10,
              }}
              onMouseEnter={(e) => handleNodeHover(node.id, e)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border transition-all duration-300",
                  isHovered
                    ? "border-chloe-pink scale-110"
                    : isConnected
                      ? "border-chloe-pink/40"
                      : "border-chloe-elevated/60"
                )}
                style={{
                  backgroundColor: isHovered ? node.color + "15" : "#0A0A0A",
                  boxShadow: isHovered
                    ? `0 0 20px ${node.color}30, 0 0 40px ${node.color}10`
                    : isConnected
                      ? `0 0 10px ${node.color}15`
                      : "none",
                }}
              >
                <span className="text-base sm:text-lg select-none">{node.icon}</span>
              </div>
              {/* Label */}
              <span
                className={cn(
                  "font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 whitespace-nowrap select-none",
                  isHovered
                    ? "text-chloe-pink"
                    : isConnected
                      ? "text-chloe-smoke/80"
                      : "text-chloe-ash/60"
                )}
              >
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Tooltip */}
        {hoveredData && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x, (containerRef.current?.clientWidth ?? 300) - 220),
              top: tooltipPos.y + 16,
            }}
          >
            <div className="border border-chloe-pink/30 bg-chloe-void/95 p-3 shadow-[0_0_20px_#FF149320] max-w-[200px] backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{hoveredData.icon}</span>
                <span className="font-mono text-[10px] font-bold text-chloe-pink uppercase tracking-wider">
                  {hoveredData.label}
                </span>
              </div>
              <p className="font-mono text-[9px] text-chloe-smoke/80 leading-relaxed">
                {hoveredData.desc}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-3">
          <span className="font-mono text-[7px] text-chloe-ash/50 uppercase tracking-wider">
            hover to explore
          </span>
          <span className="text-chloe-pink/15 text-[8px]">◆</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ELEMENT RENDERER
   ═══════════════════════════════════════ */
function DocElementView({ element }: { element: DocElement }) {
  switch (element.type) {
    case "heading":
      if (element.level === 2) {
        return (
          <h2 id={element.id} className="scroll-mt-24 text-lg font-bold font-mono uppercase tracking-wider mt-10 mb-4 text-chloe-pink flex items-center gap-2 doc-element">
            <span className="text-chloe-pink/20 text-sm">†</span>
            {element.text}
          </h2>
        );
      }
      return (
        <h3 id={element.id} className="scroll-mt-24 text-sm font-bold font-mono uppercase tracking-wider mt-6 mb-2 text-chloe-cyan doc-element">
          {element.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="font-mono text-[11px] text-chloe-smoke/70 leading-[1.8] mb-4 doc-element">
          <RichText text={element.text} />
        </p>
      );

    case "code":
      return <CodeBlock code={element.code} language={element.language} filename={element.filename} />;

    case "callout":
      return <Callout variant={element.variant} title={element.title} text={element.text} />;

    case "steps":
      return <Steps items={element.items} />;

    case "list":
      return (
        <ul className={cn("space-y-1.5 mb-4 doc-element", element.ordered ? "list-decimal" : "list-disc")}>
          {element.items.map((item, i) => (
            <li key={i} className="ml-5 font-mono text-[11px] text-chloe-smoke/70 leading-relaxed marker:text-chloe-pink/30">
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case "divider":
      return (
        <div className="flex items-center gap-3 my-8 doc-element">
          <span className="h-px flex-1 bg-chloe-elevated/30" />
          <span className="text-chloe-pink/15 text-xs">†</span>
          <span className="h-px flex-1 bg-chloe-elevated/30" />
        </div>
      );

    case "table":
      return <DataTable headers={element.headers} rows={element.rows} />;

    case "feature-grid":
      return <FeatureGrid items={element.items} />;

    case "key-value":
      return <KeyValueList items={element.items} />;

    case "diagram":
      return <DiagramView diagram={element} />;

    case "quote":
      return <QuoteBlock text={element.text} author={element.author} />;

    default:
      return null;
  }
}

/* ═══════════════════════════════════════
   MAIN RENDERER
   ═══════════════════════════════════════ */
export function DocRenderer({ doc }: { doc: DocPage }) {
  const articleRef = useRef<HTMLDivElement>(null);

  // Scroll-reveal animation
  useEffect(() => {
    const els = articleRef.current?.querySelectorAll(".doc-element");
    if (!els) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("doc-element-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [doc.slug]);

  return (
    <div className="flex gap-8">
      {/* Article */}
      <article ref={articleRef} className="flex-1 min-w-0">
        {/* Title area */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-5 bg-chloe-pink/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.4em]" style={{ color: doc.color + "80" }}>
              {doc.glyph} {doc.category}
            </span>
          </div>
          <h1 className="text-3xl font-title uppercase tracking-tight mb-2">
            <span className="gradient-menheera">{doc.title}</span>
          </h1>
          <p className="font-mono text-[11px] text-chloe-smoke/70 leading-relaxed">{doc.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-mono text-[8px] text-chloe-ash/50 border border-chloe-elevated/30 px-2 py-0.5">{doc.readTime} read</span>
            <span className="font-mono text-[8px] text-chloe-ash/50">{doc.content.length} sections</span>
          </div>
        </div>

        {/* Divider */}
        <div className="brutal-divider mb-8" />

        {/* Content elements */}
        <div className="space-y-4">
          {doc.content.map((el, i) => (
            <DocElementView key={i} element={el} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-center gap-3 pb-8">
          <span className="h-px w-8 bg-chloe-pink/10" />
          <span className="text-chloe-pink/12 text-xs font-title">†</span>
          <span className="font-mono text-[7px] text-chloe-ash/60 tracking-[0.3em] uppercase">end of document</span>
          <span className="text-chloe-blood/10 text-sm font-title">♰</span>
          <span className="h-px w-8 bg-chloe-blood/10" />
        </div>
      </article>

      {/* Right TOC */}
      <aside className="hidden xl:block w-48 shrink-0">
        <div className="sticky top-24">
          <TableOfContents sections={doc.sections} />
        </div>
      </aside>
    </div>
  );
}
