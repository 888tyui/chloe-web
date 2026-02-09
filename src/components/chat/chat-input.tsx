"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-1.5">
      <div
        className={`flex items-center gap-2 border bg-chloe-void p-2 transition-all duration-200 ${
          focused
            ? "border-chloe-pink/40 shadow-[0_0_15px_#FF149315]"
            : "border-chloe-pink/15"
        }`}
      >
        <span className="pl-1.5 font-mono text-sm text-chloe-pink/60">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="speak to her..."
          disabled={disabled}
          className="flex-1 bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-chloe-ash/50 caret-chloe-pink"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="h-7 w-7 bg-chloe-pink/80 text-white hover:bg-chloe-pink hover:shadow-[0_0_15px_#FF149340] transition-all disabled:opacity-30 disabled:bg-chloe-surface disabled:shadow-none"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[8px] text-chloe-ash/50 tracking-wider">
          press enter to send
        </span>
        {value.length > 0 && (
          <span className="font-mono text-[8px] text-chloe-ash/50 tracking-wider">
            {value.length}
          </span>
        )}
      </div>
    </div>
  );
}
