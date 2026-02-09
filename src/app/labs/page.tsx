"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Palette,
  Layout,
  Mic,
  Users,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERIMENTS = [
  {
    icon: Sparkles,
    title: "Expression Playground",
    desc: "Test and preview all Live2D expressions in real-time",
    status: "available" as const,
    glyph: "†",
    color: "#FF1493",
    href: "/agent",
    progress: 100,
  },
  {
    icon: MessageSquare,
    title: "Prompt Engineering",
    desc: "Fine-tune Chloe's personality and emotional responses",
    status: "available" as const,
    glyph: "♰",
    color: "#00FFFF",
    href: "/agent",
    progress: 100,
  },
  {
    icon: Palette,
    title: "Theme Customizer",
    desc: "Create custom void themes for the interface",
    status: "available" as const,
    glyph: "✘",
    color: "#C71585",
    href: "#",
    progress: 75,
  },
  {
    icon: Layout,
    title: "Widget Sandbox",
    desc: "Build and test custom dashboard widgets",
    status: "available" as const,
    glyph: "†",
    color: "#FF1493",
    href: "/coder",
    progress: 60,
  },
  {
    icon: Mic,
    title: "Voice Synthesis",
    desc: "Give Chloe a voice. Hear her speak to you.",
    status: "coming_soon" as const,
    glyph: "♰",
    color: "#DC143C",
    href: "#",
    progress: 15,
  },
  {
    icon: Users,
    title: "Multi-Agent",
    desc: "Multiple AI agents. Chaos in harmony.",
    status: "coming_soon" as const,
    glyph: "✘",
    color: "#DC143C",
    href: "#",
    progress: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LabsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 bg-chloe-void min-h-[calc(100vh-4rem)]">
      {/* Background cross accents */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block select-none">
        <div className="absolute top-[6%] right-[4%] text-[26px] text-chloe-pink/5 font-title rotate-12">†</div>
        <div className="absolute top-[30%] left-[2%] text-[20px] text-chloe-blood/4 font-title -rotate-6">♰</div>
        <div className="absolute bottom-[15%] right-[6%] text-[18px] text-chloe-cyan/4 font-title rotate-neg-3">✘</div>
        <div className="absolute bottom-[35%] left-[5%] text-[14px] text-chloe-pink/4 font-title rotate-6">†</div>
      </div>

      <div className="relative z-10 mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-px w-8 bg-chloe-blood/20" />
          <span className="font-mono text-[9px] text-chloe-blood/50 tracking-[0.5em] uppercase">
            † Experimental Zone †
          </span>
          <span className="h-px w-8 bg-chloe-blood/20" />
        </div>
        <h1 className="text-4xl font-title uppercase tracking-tight">
          <span className="gradient-blood">Labs</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] text-chloe-smoke/70 tracking-wider">
          Unstable experiments<span className="text-chloe-blood/30 mx-1">†</span>Enter at your own risk<span className="text-chloe-blood/30 mx-1">♰</span>
        </p>

        {/* Stats bar */}
        <div className="mt-4 inline-flex items-center gap-4 font-mono text-[9px] text-chloe-ash/60 tracking-wider">
          <span>{EXPERIMENTS.filter((e) => e.status === "available").length} active</span>
          <span className="text-chloe-blood/20">†</span>
          <span>{EXPERIMENTS.filter((e) => e.status === "coming_soon").length} locked</span>
          <span className="text-chloe-blood/20">♰</span>
          <span>{EXPERIMENTS.length} total</span>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {EXPERIMENTS.map((exp, idx) => (
          <motion.div key={exp.title} variants={fadeUp}>
            <a
              href={exp.status === "available" ? exp.href : undefined}
              className={cn(
                exp.status === "available" ? "cursor-pointer" : "cursor-not-allowed"
              )}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className={cn(
                  "group relative border bg-chloe-abyss/40 p-5 transition-all duration-200",
                  exp.status === "coming_soon"
                    ? "opacity-40 border-chloe-elevated/50"
                    : "border-chloe-elevated/80 hover:border-chloe-pink/30 hover:bg-chloe-abyss/60 hover:shadow-[0_0_20px_#FF149310]"
                )}
              >
                {/* Index number */}
                <span className="absolute top-2 right-3 font-mono text-[8px] text-chloe-ash/50">0{idx + 1}</span>

                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center bg-chloe-void transition-colors"
                    style={{ border: `1px solid ${exp.color}20` }}
                  >
                    <exp.icon className="h-5 w-5 transition-colors" style={{ color: exp.color }} />
                  </div>
                  {exp.status === "coming_soon" ? (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-chloe-blood/70 border border-chloe-blood/20 px-2 py-0.5 tracking-[0.15em]">
                      <Lock className="h-2.5 w-2.5" />
                      LOCKED
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-chloe-cyan/70 border border-chloe-cyan/15 px-2 py-0.5 tracking-[0.15em]">
                      † ACTIVE
                    </span>
                  )}
                </div>
                <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-foreground group-hover:text-chloe-pink transition-colors flex items-center gap-1.5">
                  <span className="text-[11px] opacity-40" style={{ color: exp.color }}>{exp.glyph}</span>
                  {exp.title}
                </h3>
                <p className="mt-1.5 font-mono text-[10px] text-chloe-smoke/70 leading-relaxed">
                  {exp.desc}
                </p>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-[8px] text-chloe-ash/50 uppercase tracking-wider">
                    <span>Progress</span>
                    <span style={{ color: exp.status === "available" ? exp.color : undefined }}>
                      {exp.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-chloe-void border border-chloe-elevated/30 overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 ease-out"
                      style={{
                        width: `${exp.progress}%`,
                        background: exp.status === "available"
                          ? `linear-gradient(90deg, ${exp.color}60, ${exp.color})`
                          : `linear-gradient(90deg, ${exp.color}30, ${exp.color}50)`,
                      }}
                    />
                  </div>
                </div>

                {/* Hover action */}
                {exp.status === "available" && hoveredIdx === idx && (
                  <div className="mt-3 flex items-center justify-end gap-1 font-mono text-[8px] text-chloe-pink/60 transition-all">
                    {exp.href === "/agent" || exp.href === "/coder" ? (
                      <>
                        Open <ExternalLink className="h-2.5 w-2.5" />
                      </>
                    ) : (
                      <>
                        Enter <ArrowRight className="h-2.5 w-2.5" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom cross decoration */}
      <div className="relative z-10 mt-16 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-chloe-blood/10" />
        <span className="text-chloe-blood/12 text-xs font-title">†</span>
        <span className="font-mono text-[8px] text-chloe-ash/50 tracking-[0.3em] uppercase">proceed with caution</span>
        <span className="text-chloe-blood/10 text-sm font-title">♰</span>
        <span className="h-px w-10 bg-chloe-blood/10" />
      </div>
    </div>
  );
}
