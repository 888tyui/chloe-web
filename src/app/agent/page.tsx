"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Terminal, Zap, Sparkles, Trash2, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Live2DWrapper } from "@/components/live2d/live2d-wrapper";
import { ChatPanel } from "@/components/chat/chat-panel";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { AmmSimulator } from "@/components/agent/amm-simulator";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";

const EXPRESSIONS = [
  { name: "expression1", label: "SMILE", icon: "◇" },
  { name: "expression2", label: "WINK", icon: "✦" },
  { name: "1", label: "HAPPY", icon: "♡" },
  { name: "2", label: "SHY", icon: "✝" },
  { name: "3", label: "ANGRY", icon: "☠" },
  { name: "4", label: "SHOCK", icon: "⚡" },
  { name: "5", label: "THINK", icon: "◆" },
];

const MOOD_COLORS: Record<string, string> = {
  neutral: "#6A6A7A",
  happy: "#FF69B4",
  obsessive: "#FF1493",
  yandere: "#DC143C",
  manic: "#FF00FF",
  possessive: "#C71585",
  devoted: "#FF1493",
  glitch: "#00FFFF",
};

function formatUptime(startMs: number) {
  const diff = Math.floor((Date.now() - startMs) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function AgentPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(null);
  const [uptime, setUptime] = useState("00:00");
  const mood = useChatStore((s) => s.mood);
  const messageCount = useChatStore((s) => s.messages.length);
  const sessionStart = useChatStore((s) => s.sessionStart);
  const activeExpression = useChatStore((s) => s.activeExpression);
  const setActiveExpression = useChatStore((s) => s.setActiveExpression);
  const clearMessages = useChatStore((s) => s.clearMessages);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(formatUptime(sessionStart));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const triggerExpression = useCallback((name: string) => {
    if (model) {
      try {
        model.expression(name);
        setActiveExpression(name);
      } catch {
        // expression may not exist
      }
    }
  }, [model, setActiveExpression]);

  const moodColor = MOOD_COLORS[mood] || MOOD_COLORS.neutral;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-chloe-void">
      {/* Left Panel - Live2D */}
      <div className="flex flex-col border-b border-chloe-pink/15 lg:w-[35%] lg:border-b-0 lg:border-r lg:border-r-chloe-pink/15">
        <div className="relative flex-1 min-h-[300px] bg-chloe-abyss overflow-hidden">
          {/* Subtle grain overlay */}
          <div className="absolute inset-0 texture-grain pointer-events-none" />

          {/* Corner labels */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 font-mono text-[9px] text-chloe-pink/50 tracking-[0.2em]">
            <span className="text-chloe-pink/30">†</span> LIVE2D::ACTIVE
          </div>
          <div className="absolute top-3 right-3 z-10 font-mono text-[9px] text-chloe-cyan/30 tracking-[0.2em]">
            ♰ v1.0
          </div>

          {/* Floating cross accents */}
          <div className="absolute top-[15%] right-[8%] text-[20px] text-chloe-pink/6 font-title select-none pointer-events-none">†</div>
          <div className="absolute bottom-[20%] left-[5%] text-[16px] text-chloe-blood/5 font-title select-none pointer-events-none">♰</div>

          <Live2DWrapper
            className="h-full w-full"
            onModelReady={setModel}
          />

          {/* Mood indicator - enhanced with color */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-2 bg-chloe-void/90 backdrop-blur-sm border border-chloe-pink/25 px-3 py-1.5 font-mono text-[10px]">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: moodColor, boxShadow: `0 0 8px ${moodColor}60` }}
              />
              <span className="uppercase tracking-[0.25em]" style={{ color: moodColor }}>{mood}</span>
              <span className="text-chloe-pink/25 text-xs">†</span>
            </div>
          </div>

          {/* Session info - bottom right */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-chloe-void/80 backdrop-blur-sm border border-chloe-elevated/40 px-2 py-1 font-mono text-[9px] text-chloe-ash/50">
              <Clock className="h-2.5 w-2.5" />
              {uptime}
            </div>
            <div className="flex items-center gap-1.5 bg-chloe-void/80 backdrop-blur-sm border border-chloe-elevated/40 px-2 py-1 font-mono text-[9px] text-chloe-ash/50">
              <MessageSquare className="h-2.5 w-2.5" />
              {messageCount}
            </div>
          </div>
        </div>

        {/* Expression buttons - with active state */}
        <div className="flex flex-wrap gap-1.5 border-t border-chloe-pink/15 bg-chloe-abyss/80 p-3">
          <div className="w-full flex items-center gap-2 mb-1.5">
            <span className="text-chloe-pink/40 text-xs">†</span>
            <span className="font-mono text-[8px] text-chloe-ash uppercase tracking-[0.4em]">Expression Control</span>
            <span className="text-chloe-pink/40 text-xs">†</span>
            <span className="ml-auto h-px flex-1 max-w-[40px] bg-chloe-pink/10" />
          </div>
          {EXPRESSIONS.map((exp) => {
            const isActive = activeExpression === exp.name;
            return (
              <Button
                key={exp.name}
                variant="outline"
                size="sm"
                onClick={() => triggerExpression(exp.name)}
                className={cn(
                  "h-7 text-[10px] font-mono uppercase tracking-wider transition-all duration-200",
                  isActive
                    ? "border-chloe-pink/50 bg-chloe-pink/10 text-chloe-pink shadow-[0_0_12px_#FF149325]"
                    : "border-chloe-pink/15 bg-transparent text-chloe-smoke hover:bg-chloe-pink/10 hover:text-chloe-pink hover:border-chloe-pink/40 hover:shadow-[0_0_12px_#FF149320]"
                )}
              >
                <span className={cn("mr-1", isActive ? "text-chloe-pink" : "text-chloe-pink/70")}>{exp.icon}</span>
                {exp.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden bg-chloe-void">
        <Tabs defaultValue="chat" className="flex flex-1 flex-col">
          <div className="border-b border-chloe-pink/15 bg-chloe-abyss px-3 pt-3 flex items-center gap-3">
            <TabsList className="grid w-fit grid-cols-3 bg-chloe-void border border-chloe-pink/15">
              <TabsTrigger
                value="chat"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-chloe-pink data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_#FF149340]"
              >
                <MessageSquare className="h-3 w-3" />
                Chat
                {messageCount > 0 && (
                  <span className="ml-1 text-[8px] opacity-70">{messageCount}</span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="terminal"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-chloe-surface data-[state=active]:text-chloe-cyan data-[state=active]:border data-[state=active]:border-chloe-cyan/30"
              >
                <Terminal className="h-3 w-3" />
                Shell
              </TabsTrigger>
              <TabsTrigger
                value="amm"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-chloe-blood/20 data-[state=active]:text-chloe-blood data-[state=active]:border data-[state=active]:border-chloe-blood/30"
              >
                <Zap className="h-3 w-3" />
                AMM
              </TabsTrigger>
            </TabsList>

            {/* Right side of tab bar */}
            <div className="ml-auto hidden sm:flex items-center gap-3">
              {messageCount > 0 && (
                <button
                  onClick={clearMessages}
                  className="flex items-center gap-1 font-mono text-[8px] text-chloe-ash/50 hover:text-chloe-blood/60 transition-colors uppercase tracking-wider"
                  title="Clear session"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                  Clear
                </button>
              )}
              <span className="flex items-center gap-1.5 font-mono text-[8px] text-chloe-ash/50 tracking-[0.3em] uppercase">
                <span className="text-chloe-pink/20">†</span> agent.sys <span className="text-chloe-pink/20">♰</span>
              </span>
            </div>
          </div>
          <TabsContent value="chat" className="flex-1 min-h-0 overflow-hidden mt-0">
            <ChatPanel />
          </TabsContent>
          <TabsContent
            value="terminal"
            className="flex-1 overflow-hidden mt-0"
          >
            <TerminalPanel />
          </TabsContent>
          <TabsContent value="amm" className="flex-1 overflow-auto mt-0">
            <AmmSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
