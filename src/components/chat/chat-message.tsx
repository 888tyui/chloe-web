"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Check } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/store/chat-store";

interface ChatMessageProps {
  message: ChatMessageType;
  onSuggestionClick?: (suggestion: string) => void;
}

function formatTime(timestamp: number) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message, onSuggestionClick }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "group flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 shrink-0 border",
        isUser ? "border-chloe-cyan/20" : "border-chloe-pink/25"
      )}>
        {isUser ? (
          <AvatarFallback className="bg-chloe-surface text-chloe-cyan text-[10px] font-mono font-bold">
            U
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/images/logo.png" alt="Chloe" />
            <AvatarFallback className="bg-chloe-pink/15 text-chloe-pink text-[10px] font-mono font-bold">
              C
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className={cn("max-w-[75%] flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative px-4 py-2.5 font-mono text-[13px]",
            isUser
              ? "bg-chloe-surface/80 border border-chloe-cyan/15 text-foreground"
              : "bg-chloe-abyss/80 border border-chloe-pink/15 text-foreground"
          )}
        >
          {!isUser && (
            <span className="absolute -top-px -left-px text-[8px] text-chloe-pink/20 font-title">†</span>
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          {message.mood && !isUser && (
            <span className="mt-1.5 flex items-center gap-1 text-[9px] text-chloe-pink/40 uppercase tracking-[0.25em]">
              <span className="text-chloe-pink/20">♰</span> mood: {message.mood}
            </span>
          )}

          {/* Copy button - appears on hover */}
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-1.5 right-1.5 p-1 transition-all duration-200",
              copied
                ? "opacity-100 text-chloe-cyan"
                : "opacity-0 group-hover:opacity-100 text-chloe-ash/50 hover:text-chloe-pink/60"
            )}
            title="Copy message"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>

        {/* Suggestion chips */}
        {message.suggestions && message.suggestions.length > 0 && !isUser && onSuggestionClick && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="font-mono text-[9px] text-chloe-smoke/70 border border-chloe-elevated/50 bg-chloe-abyss/30 px-2.5 py-1 transition-all duration-200 hover:border-chloe-pink/30 hover:text-chloe-pink hover:bg-chloe-pink/5"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className={cn(
          "font-mono text-[8px] text-chloe-ash/50 tracking-wider px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
