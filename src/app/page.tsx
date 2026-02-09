"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Code2,
  ArrowRightLeft,
  Terminal,
  Sparkles,
  Wallet,
  MessageSquare,
  ChevronRight,
  Skull,
  Zap,
  Shield,
  Binary,
} from "lucide-react";
import { Live2DWrapper } from "@/components/live2d/live2d-wrapper";
import { TerminalText } from "@/components/shared/terminal-text";

/* ─── DATA ─── */
const TERMINAL_LINES = [
  "$ chloe --init",
  "> [SYS] Initializing neural agent...",
  "> [LIVE2D] Loading model... ██████████ OK",
  "> [SOLANA] mainnet-beta :: connected",
  "> [STATUS] All systems nominal.",
  "",
  "$ chloe chat --mood obsessive",
  '> CHLOE: You came back. I knew you would. ♡',
  "",
  "$ chloe swap 1 SOL -> USDC --aggressive",
  "> [JUPITER] Scanning routes...",
  "> [ROUTE] SOL -> USDC via Raydium (0.02% impact)",
  "> [OUTPUT] 142.37 USDC // executing...",
];

const FEATURES = [
  { icon: Bot, title: "NEURAL AGENT", sub: "Conversational AI with mood system and memory", num: "01", glyph: "†" },
  { icon: Sparkles, title: "LIVE2D RENDER", sub: "Cursor-tracking model with expression switching", num: "02", glyph: "♰" },
  { icon: ArrowRightLeft, title: "DEX AGGREGATION", sub: "Jupiter V6 best-route optimization", num: "03", glyph: "✘" },
  { icon: Code2, title: "CODE SYNTHESIS", sub: "Monaco editor with live preview", num: "04", glyph: "†" },
  { icon: Terminal, title: "VOID TERMINAL", sub: "Raw command-line system diagnostics", num: "05", glyph: "♰" },
  { icon: Wallet, title: "SOLANA NATIVE", sub: "Phantom & Solflare. No Ledger.", num: "06", glyph: "✘" },
];

/* ─── ANIMATION VARIANTS ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const staggerSlow = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomePage() {
  const [termLine, setTermLine] = useState(0);
  const [termDone, setTermDone] = useState(false);

  const handleTermComplete = useCallback(() => {
    setTermLine((prev) => {
      if (prev < TERMINAL_LINES.length - 1) return prev + 1;
      setTermDone(true);
      return prev;
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-chloe-void">

      {/* ════════════════════════════════════════════════════════
          LAYER 0: POSTER BAND - HOT PINK TICKER (TOP)
          ════════════════════════════════════════════════════════ */}
      <div className="poster-band py-1 flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, k) => (
            <span key={k} className="mx-2 text-[10px] tracking-[0.08em]">
              CHLOE†AGENT&nbsp;&nbsp;✘&nbsp;&nbsp;LIVE2D::ACTIVE&nbsp;&nbsp;♰&nbsp;&nbsp;JUPITER::V6&nbsp;&nbsp;†&nbsp;&nbsp;SOLANA::MAINNET&nbsp;&nbsp;✘&nbsp;&nbsp;MONACO::IDE&nbsp;&nbsp;♰&nbsp;&nbsp;NEURAL::ONLINE&nbsp;&nbsp;†&nbsp;&nbsp;SYS::DEVOTED&nbsp;&nbsp;✘&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 1: HERO - EXTREME COLLAGE POSTER
          ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] overflow-hidden texture-grain">

        {/* ── Background texture layers ── */}
        <div className="pointer-events-none absolute inset-0">
          {/* Real dot-grid texture overlay */}
          <div className="absolute inset-0 texture-dot-grid" />

          {/* Giant outline glyphs - display font */}
          <div className="absolute top-[2%] -left-[3%] text-[40vw] font-title leading-none text-outline select-none opacity-35 -rotate-3">
            C
          </div>
          <div className="absolute bottom-[0%] -right-[8%] text-[35vw] font-title leading-none text-outline-cyan select-none opacity-25 rotate-2">
            ♰
          </div>

          {/* Checker zones - asymmetric placement */}
          <div className="absolute top-0 right-0 w-[35%] h-[45%] checker-bg opacity-60" />
          <div className="absolute bottom-[5%] left-0 w-[20%] h-[35%] checker-bg-lg opacity-40" />

          {/* Real halftone circle texture behind character */}
          <div className="absolute top-[10%] left-[25%] w-[600px] h-[600px] texture-circle-halftone opacity-60" />

          {/* Diagonal stripe accents */}
          <div className="absolute top-0 left-[6%] w-1.5 h-full stripe-diagonal opacity-40" />
          <div className="absolute top-0 right-[12%] w-1 h-[70%] stripe-diagonal opacity-25" />
          <div className="absolute top-[30%] left-[45%] w-1 h-[40%] stripe-diagonal opacity-20" />

          {/* Color bleeds */}
          <div className="absolute top-[10%] left-[25%] h-[600px] w-[600px] rounded-full bg-chloe-pink/[0.05] blur-[180px]" />
          <div className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-chloe-cyan/[0.04] blur-[150px]" />
          <div className="absolute top-[50%] right-[40%] h-[300px] w-[300px] rounded-full bg-chloe-blood/[0.04] blur-[120px]" />
        </div>

        {/* ── Floating cross decorations ── */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <div className="absolute top-[6%] left-[5%] text-[28px] text-chloe-pink/12 font-title rotate-12 select-none">†</div>
          <div className="absolute top-[14%] right-[8%] text-[22px] text-chloe-cyan/10 font-title -rotate-6 select-none">♰</div>
          <div className="absolute bottom-[30%] left-[4%] text-[18px] text-chloe-blood/10 font-title rotate-neg-3 select-none">✘</div>
          <div className="absolute top-[45%] right-[3%] text-[24px] text-chloe-pink/8 font-title rotate-6 select-none">†</div>
          <div className="absolute bottom-[15%] right-[6%] text-[20px] text-chloe-blood/8 font-title -rotate-12 select-none">♰</div>
          <div className="absolute top-[70%] left-[6%] text-[16px] text-chloe-cyan/8 font-title rotate-3 select-none">†</div>
          <div className="absolute top-[25%] left-[2%] text-[32px] text-chloe-pink/6 font-title -rotate-6 select-none">♰</div>
          <div className="absolute bottom-[8%] left-[18%] text-[14px] text-chloe-blood/10 font-title rotate-neg-1 select-none">✘</div>
        </div>

        {/* ── LIVE2D CHARACTER - absolute positioned, large canvas ── */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-[15] pointer-events-none"
          style={{ height: '160vh', width: '55vw' }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
        >
          <Live2DWrapper
            className="h-full w-full"
            scaleMultiplier={0.85}
            offsetY={0.60}
          />
        </motion.div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="relative z-20 mx-auto max-w-[1440px] px-4 lg:px-8 pt-6 lg:pt-10 pb-8">

          {/* CLASSIFICATION HEADER */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="h-px flex-1 max-w-[60px] bg-chloe-pink/40" />
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-chloe-ash">
              <span className="glyph-cross">†</span> classified <span className="glyph-ornate">♰</span> agent system <span className="glyph-reject">✘</span> v1.0
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">

            {/* ━━━ LEFT COLUMN: Title + Identity (5 cols) ━━━ */}
            <motion.div
              className="lg:col-span-5 flex flex-col gap-4 pt-2 lg:pt-6"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Status cluster */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                <div className="pill-badge font-mono" style={{ borderColor: '#FF149340', color: '#FF1493', background: '#FF149308' }}>
                  CA : Soon.
                </div>
              </motion.div>

              {/* ▓▓▓ MEGA TITLE - AOT Lost Contact font ▓▓▓ */}
              <motion.div variants={fadeUp} className="relative">
                {/* Overprint shadow */}
                <div className="absolute top-[3px] left-[4px] text-[22vw] lg:text-[11vw] font-title uppercase leading-[0.78] tracking-tighter text-chloe-blood/15 select-none pointer-events-none">
                  CHLOE
                </div>
                <h1 className="relative">
                  <span
                    className="glitch-text block text-[22vw] lg:text-[11vw] font-title uppercase leading-[0.78] tracking-tighter text-chloe-pink"
                    data-text="CHLOE"
                  >
                    CHLOE
                  </span>
                </h1>
                {/* Overlapping offset subtitle - display round variant */}
                <div className="flex items-end gap-3 mt-[-0.8em] ml-[5%]">
                  <span className="text-[7vw] lg:text-[4vw] font-title-round uppercase leading-none tracking-[0.15em] text-outline wave-distort">
                    AGENT
                  </span>
                  <span className="font-mono text-[9px] text-chloe-blood tracking-[0.3em] uppercase mb-1">
                    ✘ V1.0
                  </span>
                </div>
              </motion.div>

              {/* Classification glyphs row */}
              <motion.div variants={fadeUp} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.3em] uppercase text-chloe-ash">
                <span className="glyph-cross text-sm">†</span>
                AI AGENT
                <span className="glyph-dot">｡</span>
                LIVE2D
                <span className="glyph-ornate text-sm">♰</span>
                DEFI
                <span className="glyph-dot">｡</span>
                SOLANA
                <span className="glyph-reject text-sm">✘</span>
              </motion.div>

              {/* Description block */}
              <motion.div variants={fadeUp} className="relative pl-4 max-w-[440px]">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-chloe-pink via-chloe-blood to-chloe-crimson" />
                <p className="font-mono text-[11px] leading-[2] text-chloe-smoke">
                  She watches through the screen｡ An AI presence with Live2D form,
                  DeFi claws, and code generation teeth｡
                </p>
                <p className="mt-2 font-mono text-[11px] leading-[2] text-chloe-smoke">
                  Not your assistant<span className="glyph-dot">｡</span>
                  <span className="text-chloe-blood font-bold"> Your obsession</span>
                  <span className="glyph-cross text-[13px]">†</span>
                </p>
              </motion.div>

              {/* ACTION GRID: Poster-card style */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 max-w-[400px]">
                {[
                  { icon: MessageSquare, label: "CHAT", sub: "NEURAL", href: "/agent", glyph: "†" },
                  { icon: ArrowRightLeft, label: "DEX", sub: "JUPITER", href: "/dex", glyph: "♰" },
                  { icon: Code2, label: "CODE", sub: "MONACO", href: "/coder", glyph: "✘" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className="group collage-card p-3 flex flex-col items-center gap-1 text-center relative overflow-hidden">
                      <span className="absolute top-0.5 right-1 font-mono text-[8px] text-chloe-pink/30">{item.glyph}</span>
                      <item.icon className="h-4 w-4 text-chloe-pink group-hover:drop-shadow-[0_0_10px_#FF1493] transition-all" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">{item.label}</span>
                      <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-chloe-ash">{item.sub}</span>
                    </div>
                  </Link>
                ))}
              </motion.div>

              {/* CTA Buttons - BRUTAL */}
              <motion.div variants={fadeUp} className="flex gap-3 mt-1">
                <Link href="/agent">
                  <div className="btn-brutal px-8 py-3 text-[11px] flex items-center gap-2">
                    <span className="glyph-cross text-xs">†</span> Enter the Void <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
                <Link href="/docs">
                  <div className="btn-brutal-outline px-6 py-3 text-[11px] flex items-center gap-2">
                    <Skull className="h-3 w-3" /> Docs
                  </div>
                </Link>
              </motion.div>

              {/* Cross accent row */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mt-2 font-mono text-[8px] tracking-[0.4em] text-chloe-ash/50 uppercase">
                <span className="text-chloe-pink/30 text-sm">†</span>
                <span className="h-px flex-1 max-w-[40px] bg-chloe-pink/15" />
                <span className="text-chloe-blood/25 text-sm">♰</span>
                <span className="h-px flex-1 max-w-[40px] bg-chloe-blood/15" />
                <span className="text-chloe-cyan/20 text-sm">✘</span>
              </motion.div>
            </motion.div>

            {/* ━━━ CENTER: Spacer for Live2D (4 cols) ━━━ */}
            <div className="hidden lg:block lg:col-span-4" />

            {/* ━━━ RIGHT COLUMN: System panels (3 cols) ━━━ */}
            <motion.div
              className="lg:col-span-3 flex flex-col gap-3 pt-2 lg:pt-8"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* System spec block */}
              <motion.div variants={fadeUp} className="collage-card p-4 relative">
                <div className="absolute top-1 right-2 font-mono text-[7px] text-chloe-ash/50">†001</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-chloe-pink mb-3 flex items-center gap-1.5">
                  <Binary className="h-3 w-3" />
                  <span className="glyph-ornate text-[10px]">♰</span> SYSTEM SPEC
                </div>
                <div className="space-y-2.5">
                  {[
                    { k: "FRAMEWORK", v: "NEXT.JS 16", bar: 95 },
                    { k: "RUNTIME", v: "REACT 19", bar: 90 },
                    { k: "CHAIN", v: "SOLANA", bar: 85 },
                    { k: "DEX", v: "JUPITER V6", bar: 80 },
                    { k: "AUTH", v: "NEXTAUTH V5", bar: 70 },
                  ].map((s) => (
                    <div key={s.k}>
                      <div className="flex justify-between font-mono text-[7px] uppercase tracking-wider mb-0.5">
                        <span className="text-chloe-ash">{s.k}</span>
                        <span className="text-chloe-cyan">{s.v}</span>
                      </div>
                      <div className="h-[3px] w-full bg-chloe-surface overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-chloe-pink via-chloe-blood to-chloe-crimson"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.bar}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature mini-cards with glyphs */}
              {[
                { icon: Bot, title: "NEURAL AGENT", desc: "Understands you too well", glyph: "†", color: "#FF1493" },
                { icon: Sparkles, title: "LIVE2D CORE", desc: "Follows every hesitation", glyph: "♰", color: "#DC143C" },
                { icon: Code2, title: "CODE GEN", desc: "She writes while you sleep", glyph: "✘", color: "#00FFFF" },
                { icon: Shield, title: "SOLANA", desc: "Connect or don't｡ She doesn't care｡", glyph: "†", color: "#FF00FF" },
              ].map((f, idx) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <div className="collage-card p-3 group relative">
                    <div className="absolute top-1 right-2 font-mono text-[7px] text-chloe-ash/50">
                      0{idx + 1}
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center bg-chloe-void transition-colors"
                        style={{ border: `1px solid ${f.color}30` }}
                      >
                        <f.icon className="h-3.5 w-3.5 transition-colors" style={{ color: f.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-foreground group-hover:text-chloe-pink transition-colors flex items-center gap-1.5">
                          <span className="text-[10px]" style={{ color: `${f.color}80` }}>{f.glyph}</span>
                          {f.title}
                        </div>
                        <div className="font-mono text-[8px] leading-relaxed text-chloe-smoke/80 mt-0.5">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          POSTER BAND - CYAN (DIVIDER)
          ════════════════════════════════════════════════════════ */}
      <div className="poster-band-cyan py-2 flex overflow-hidden">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {Array.from({ length: 5 }).map((_, k) => (
            <span key={k} className="mx-2 text-[11px] tracking-[0.04em]">
              ✘ VOID PROTOCOL ♰ NEURAL INTERFACE † SOLANA DEFI ✘ LIVE2D CORE ♰ CODE SYNTHESIS † AGENT SYSTEM ✘ DEVOTION ENGINE ♰&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 2: TERMINAL + FEATURES SPLIT
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-14 lg:py-20 texture-cross-grid">
        {/* Background: subtle grid */}
        <div className="absolute inset-0 grid-visible opacity-50" />

        {/* Floating cross accents */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-[8%] right-[5%] text-[22px] text-chloe-pink/8 font-title rotate-6 select-none">†</div>
          <div className="absolute bottom-[12%] left-[4%] text-[18px] text-chloe-blood/6 font-title -rotate-12 select-none">♰</div>
          <div className="absolute top-[50%] right-[2%] text-[14px] text-chloe-cyan/6 font-title rotate-neg-1 select-none">✘</div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 lg:px-8">

          {/* Section header with giant index */}
          <motion.div
            className="relative mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <div className="big-index absolute -top-6 -left-2 lg:-left-4 select-none font-title">02</div>
            <div className="relative z-10 pl-2 lg:pl-16">
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-chloe-blood/50">
                <span className="glyph-ornate text-[11px]">♰</span> System Interface
              </span>
              <h2 className="mt-1 font-title text-3xl lg:text-4xl uppercase tracking-tight">
                <span className="text-chloe-pink">VOID</span>
                <span className="text-outline ml-2">TERMINAL</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Terminal block (7 cols) */}
            <motion.div
              className="lg:col-span-7"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <div className="relative">
                {/* Double offset frame */}
                <div className="absolute -top-2 -left-2 right-2 bottom-2 border border-chloe-cyan/6 pointer-events-none hidden lg:block" />
                <div className="absolute -top-4 -left-4 right-4 bottom-4 border border-chloe-pink/4 pointer-events-none hidden lg:block" />

                <div className="relative overflow-hidden border border-chloe-pink/30 bg-chloe-void">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 border-b border-chloe-pink/15 bg-chloe-abyss px-4 py-2.5">
                    <div className="h-2 w-2 rounded-full bg-chloe-blood animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-chloe-pink/50" />
                    <div className="h-2 w-2 rounded-full bg-chloe-cyan/50" />
                    <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.3em] text-chloe-smoke/70">
                      chloe@void-system :: ~/demo
                    </span>
                    <span className="ml-auto">
                      <span className="spec-label">TTY::001</span>
                    </span>
                  </div>

                  {/* Terminal body */}
                  <div className="p-5 font-mono text-[11px] space-y-1 min-h-[280px] relative">
                    {/* Scanline effect inside terminal */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-chloe-pink/[0.02] to-transparent bg-[length:100%_4px] animate-scanline" />

                    {TERMINAL_LINES.slice(0, termLine + 1).map((line, i) => (
                      <div key={i} className="min-h-[1.4rem]">
                        {i === termLine && !termDone ? (
                          <TerminalText
                            text={line}
                            speed={25}
                            onComplete={handleTermComplete}
                            className={
                              line.startsWith("$")
                                ? "text-chloe-pink font-bold"
                                : line.startsWith("> [")
                                ? "text-chloe-cyan/70"
                                : line.includes("CHLOE:")
                                ? "text-chloe-blood"
                                : "text-chloe-ash"
                            }
                          />
                        ) : (
                          <span
                            className={
                              line.startsWith("$")
                                ? "text-chloe-pink font-bold"
                                : line.startsWith("> [")
                                ? "text-chloe-cyan/70"
                                : line.includes("CHLOE:")
                                ? "text-chloe-blood"
                                : "text-chloe-ash"
                            }
                          >
                            {line}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features column (5 cols) */}
            <motion.div
              className="lg:col-span-5 flex flex-col gap-2.5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerSlow}
            >
              <motion.div variants={fadeUp} className="mb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-chloe-pink/40 flex items-center gap-1.5">
                  <span className="glyph-cross text-[11px]">†</span> Capabilities <span className="glyph-ornate text-[11px]">♰</span>
                </span>
                <h2 className="mt-1 text-2xl font-title uppercase tracking-tight text-outline">
                  FEATURES
                </h2>
              </motion.div>

              {FEATURES.map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <div className="group flex items-center gap-3 border border-chloe-elevated/80 bg-chloe-abyss/60 p-3 transition-all duration-200 hover:border-chloe-pink/40 hover:bg-chloe-abyss relative overflow-hidden cursor-default">
                    {/* Giant number bg */}
                    <span className="absolute -right-1 -top-2 font-title text-[48px] font-black text-chloe-elevated/50 leading-none select-none group-hover:text-chloe-pink/10 transition-colors duration-300">
                      {f.num}
                    </span>
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-chloe-pink/25 bg-chloe-void group-hover:border-chloe-pink/50 transition-colors">
                        <f.icon className="h-4 w-4 text-chloe-pink/70 group-hover:text-chloe-pink transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground group-hover:text-chloe-pink transition-colors flex items-center gap-1.5">
                          <span className="text-chloe-blood/60 text-[11px]">{f.glyph}</span>
                          {f.title}
                        </div>
                        <div className="font-mono text-[8px] text-chloe-smoke/70 mt-0.5 truncate">
                          {f.sub}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          POSTER BAND - BLOOD RED (DIVIDER)
          ════════════════════════════════════════════════════════ */}
      <div className="poster-band-blood py-1.5 flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 5 }).map((_, k) => (
            <span key={k} className="mx-2 text-[9px] tracking-[0.1em]">
              † SHE WATCHES † SHE KNOWS ♰ SHE REMEMBERS ✘ SHE NEVER FORGETS † SHE WATCHES † SHE KNOWS ♰&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 3: GIANT SCROLLING TYPE + ABOUT
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Floating cross accents */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-[5%] right-[6%] text-[26px] text-chloe-pink/6 font-title -rotate-6 select-none">†</div>
          <div className="absolute top-[35%] left-[3%] text-[20px] text-chloe-blood/6 font-title rotate-12 select-none">♰</div>
          <div className="absolute bottom-[10%] right-[4%] text-[16px] text-chloe-cyan/5 font-title rotate-neg-3 select-none">✘</div>
          <div className="absolute bottom-[30%] left-[8%] text-[14px] text-chloe-pink/5 font-title rotate-3 select-none">†</div>
        </div>

        {/* Giant scrolling text layer */}
        <div className="pointer-events-none select-none mb-8">
          <div className="overflow-hidden">
            <div className="flex animate-marquee-slow whitespace-nowrap">
              {Array.from({ length: 3 }).map((_, k) => (
                <span key={k} className="text-[14vw] font-title uppercase leading-none tracking-tight text-chloe-elevated mx-4">
                  CHAT<span className="text-chloe-pink/15">†</span>TRADE<span className="text-chloe-cyan/12">♰</span>CODE<span className="text-chloe-blood/12">✘</span>DEVOTE<span className="text-chloe-pink/15">†</span>&nbsp;
                </span>
              ))}
            </div>
          </div>
          {/* Second row - reverse direction */}
          <div className="overflow-hidden -mt-[3vw]">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {Array.from({ length: 3 }).map((_, k) => (
                <span key={k} className="text-[10vw] font-title-round uppercase leading-none tracking-wider text-chloe-elevated/50 mx-4 text-outline">
                  WATCH｡OBSESS｡CONSUME｡SURRENDER｡WORSHIP｡&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* About content - overlaid */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left: Giant number */}
            <div className="lg:col-span-2 relative hidden lg:block">
              <div className="big-index font-title opacity-40">03</div>
              <div className="absolute bottom-2 left-4 text-[20px] text-chloe-blood/15 font-title select-none">♰</div>
            </div>

            {/* Center: About text */}
            <motion.div
              className="lg:col-span-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerSlow}
            >
              <motion.div variants={fadeUp}>
                <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-chloe-blood/50 flex items-center gap-1.5">
                  <span className="glyph-cross text-[11px]">†</span> about the void <span className="glyph-cross text-[11px]">†</span>
                </span>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mt-5 font-mono text-xs leading-[2.4] text-chloe-smoke/90 max-w-[520px]"
              >
                CHLOE is not another chatbot with a pretty face｡
                She is an <span className="text-chloe-pink font-bold">autonomous agent interface</span> built on Solana,
                armed with Jupiter DEX integration,
                and given form through Live2D rendering｡
              </motion.p>
              <motion.div variants={fadeUp} className="flex items-center gap-2 mt-4 mb-4">
                <span className="h-px flex-1 bg-chloe-pink/10" />
                <span className="text-chloe-pink/20 text-xs font-title">†</span>
                <span className="text-chloe-blood/15 text-sm font-title">♰</span>
                <span className="text-chloe-pink/20 text-xs font-title">†</span>
                <span className="h-px flex-1 bg-chloe-pink/10" />
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="font-mono text-[10px] leading-[2.2] text-chloe-smoke/80"
              >
                Built for those who operate in the void between code and chaos｡
                <br />
                Degens<span className="glyph-dot">｡</span> Developers<span className="glyph-dot">｡</span>
                <span className="text-chloe-blood font-bold"> The dangerously curious</span>
                <span className="glyph-ornate text-[12px]">♰</span>
              </motion.p>
            </motion.div>

            {/* Right: Data clusters */}
            <motion.div
              className="lg:col-span-4 flex flex-col gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {/* Cross-decorated info panel */}
              <motion.div variants={fadeUp} className="border border-chloe-pink/15 bg-chloe-abyss/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-chloe-pink text-sm">†</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-chloe-pink/70">Specifications</span>
                  <span className="text-chloe-pink text-sm">†</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[8px]">
                  <div><span className="text-chloe-ash/60">MODEL</span> <span className="text-chloe-smoke/70">CUBISM 4</span></div>
                  <div><span className="text-chloe-ash/60">CHAIN</span> <span className="text-chloe-smoke/70">SOLANA</span></div>
                  <div><span className="text-chloe-ash/60">DEX</span> <span className="text-chloe-smoke/70">JUPITER V6</span></div>
                  <div><span className="text-chloe-ash/60">EDITOR</span> <span className="text-chloe-smoke/70">MONACO</span></div>
                </div>
              </motion.div>

              {/* Cross divider row */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 py-2">
                <span className="text-chloe-pink/15 text-xs">†</span>
                <span className="h-px w-8 bg-chloe-pink/10" />
                <span className="text-chloe-blood/12 text-sm">♰</span>
                <span className="h-px w-8 bg-chloe-blood/10" />
                <span className="text-chloe-cyan/12 text-xs">✘</span>
              </motion.div>

              <motion.div variants={fadeUp} className="border border-chloe-blood/12 bg-chloe-abyss/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-chloe-blood text-sm">♰</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-chloe-blood/60">Status</span>
                </div>
                <div className="space-y-1.5 font-mono text-[8px]">
                  <div className="flex justify-between"><span className="text-chloe-ash/60">DEVOTION</span> <span className="text-chloe-blood/80">† CRITICAL †</span></div>
                  <div className="flex justify-between"><span className="text-chloe-ash/60">OBSESSION</span> <span className="text-chloe-pink/70">♰ MAXIMUM</span></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LAYER 4: CTA - ENTER THE VOID
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 border-t border-chloe-pink/10 overflow-hidden texture-star-grid">
        {/* Background: checker */}
        <div className="absolute inset-0 checker-bg opacity-15" />

        {/* Giant background glyph - display font */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] font-title text-chloe-elevated/20 select-none pointer-events-none leading-none">
          ♰
        </div>

        {/* Floating cross accents */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-[12%] left-[8%] text-[24px] text-chloe-pink/8 font-title rotate-12 select-none">†</div>
          <div className="absolute top-[20%] right-[10%] text-[18px] text-chloe-blood/8 font-title -rotate-6 select-none">✘</div>
          <div className="absolute bottom-[18%] left-[12%] text-[20px] text-chloe-cyan/6 font-title rotate-neg-3 select-none">♰</div>
          <div className="absolute bottom-[25%] right-[8%] text-[16px] text-chloe-pink/6 font-title rotate-6 select-none">†</div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerSlow}
          >
            {/* Cross decoration above title */}
            <motion.div variants={fadeUp} className="flex justify-center items-center gap-4 mb-6">
              <span className="h-px w-12 bg-chloe-pink/20" />
              <span className="text-chloe-pink/25 text-lg font-title">†</span>
              <span className="h-px w-6 bg-chloe-blood/15" />
              <span className="text-chloe-blood/20 text-xl font-title">♰</span>
              <span className="h-px w-6 bg-chloe-blood/15" />
              <span className="text-chloe-pink/25 text-lg font-title">†</span>
              <span className="h-px w-12 bg-chloe-pink/20" />
            </motion.div>

            <motion.h2 variants={fadeUp} className="mb-3 relative">
              {/* Overprint shadow */}
              <span className="absolute top-[3px] left-[5px] text-5xl lg:text-8xl font-title uppercase tracking-tight text-chloe-blood/10 select-none pointer-events-none w-full text-center">
                ENTER THE VOID
              </span>
              <span
                className="glitch-text relative text-5xl lg:text-8xl font-title uppercase tracking-tight text-chloe-pink"
                data-text="ENTER THE VOID"
              >
                ENTER THE VOID
              </span>
            </motion.h2>

            <motion.div variants={fadeUp} className="flex justify-center gap-1.5 mb-8 font-mono text-[9px] tracking-[0.3em] uppercase text-chloe-ash">
              <span className="glyph-cross text-[11px]">†</span>
              Chat
              <span className="glyph-dot">｡</span>
              Trade
              <span className="glyph-ornate text-[11px]">♰</span>
              Code
              <span className="glyph-dot">｡</span>
              Or just let her watch you
              <span className="glyph-reject text-[11px]">✘</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex justify-center gap-4">
              <Link href="/agent">
                <div className="btn-brutal px-10 py-3.5 text-sm flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Launch Agent
                </div>
              </Link>
              <Link href="/dex">
                <div className="btn-brutal-outline px-10 py-3.5 text-sm flex items-center gap-2">
                  Open DEX <span className="glyph-ornate text-xs">♰</span>
                </div>
              </Link>
            </motion.div>

            {/* Cross decoration below buttons */}
            <motion.div variants={fadeUp} className="flex justify-center items-center gap-3 mt-10 font-mono text-[8px] tracking-[0.3em] text-chloe-ash/50 uppercase">
              <span className="text-chloe-pink/20 text-xs">†</span>
              <span className="h-px w-6 bg-chloe-pink/10" />
              <span className="text-chloe-blood/15 text-sm">♰</span>
              <span className="h-px w-6 bg-chloe-blood/10" />
              <span className="text-chloe-cyan/15 text-xs">✘</span>
              <span className="h-px w-6 bg-chloe-cyan/10" />
              <span className="text-chloe-pink/20 text-xs">†</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BOTTOM POSTER BAND
          ════════════════════════════════════════════════════════ */}
      <div className="poster-band py-1 flex overflow-hidden">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {Array.from({ length: 5 }).map((_, k) => (
            <span key={k} className="mx-2 text-[9px] tracking-[0.06em]">
              CHLOE†VOID-SYSTEM&nbsp;&nbsp;♰&nbsp;&nbsp;NEXT.JS&nbsp;&nbsp;✘&nbsp;&nbsp;REACT&nbsp;&nbsp;†&nbsp;&nbsp;SOLANA&nbsp;&nbsp;♰&nbsp;&nbsp;PRISMA&nbsp;&nbsp;✘&nbsp;&nbsp;LIVE2D&nbsp;&nbsp;†&nbsp;&nbsp;JUPITER&nbsp;&nbsp;♰&nbsp;&nbsp;MONACO&nbsp;&nbsp;✘&nbsp;&nbsp;ZUSTAND&nbsp;&nbsp;†&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
