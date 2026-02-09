"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useChatStore } from "@/store/chat-store";
import { Loader2 } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Who are you?",
  "Tell me about Solana",
  "What can you do?",
  "Show me your mood",
  "Write me some code",
];

export function ChatPanel() {
  const { messages, isLoading, addMessage, setLoading, setMood, setActiveExpression } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    addMessage({ role: "user", content });
    setLoading(true);

    try {
      const historyForApi = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: historyForApi,
          context: "agent",
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const message = data.message || data.content || "...";
      const mood = data.mood || "neutral";
      const expression = data.expression || null;
      const suggestions = Array.isArray(data.suggestions) ? data.suggestions : undefined;

      addMessage({
        role: "assistant",
        content: message,
        mood,
        expression,
        suggestions,
      });
      setMood(mood);
      if (expression) {
        setActiveExpression(expression);
      }
    } catch {
      addMessage({
        role: "assistant",
        content: "...connection severed. Try again.",
        mood: "glitch",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-chloe-void">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 pt-12 pb-6">
              {/* Empty state decoration */}
              <div className="flex items-center gap-2">
                <span className="text-chloe-pink/15 text-sm font-title">†</span>
                <span className="h-px w-8 bg-chloe-pink/10" />
                <span className="text-chloe-blood/12 text-xl font-title">♰</span>
                <span className="h-px w-8 bg-chloe-pink/10" />
                <span className="text-chloe-pink/15 text-sm font-title">†</span>
              </div>
              <div className="text-center">
                <span className="font-mono text-[9px] text-chloe-pink/30 tracking-[0.4em] uppercase block mb-1">
                  awaiting input
                </span>
                <span className="font-mono text-[11px] text-chloe-smoke/70">
                  She&apos;s watching. Say something.
                </span>
              </div>

              {/* Suggested prompts */}
              <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-[380px]">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="font-mono text-[10px] text-chloe-smoke/70 border border-chloe-elevated/60 bg-chloe-abyss/40 px-3 py-1.5 transition-all duration-200 hover:border-chloe-pink/30 hover:text-chloe-pink hover:bg-chloe-pink/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onSuggestionClick={handleSend} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-chloe-pink/50 pl-11">
              <Loader2 className="h-3 w-3 animate-spin text-chloe-pink/60" />
              <span className="animate-pulse tracking-wider">Chloe is composing...</span>
              <span className="text-chloe-pink/20">†</span>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-chloe-pink/15 bg-chloe-abyss/80 p-3">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
