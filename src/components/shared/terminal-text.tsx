"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TerminalText({
  text,
  speed = 50,
  className,
  onComplete,
}: TerminalTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        onComplete?.();
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={cn("font-mono", className)}>
      {displayed}
      {!done && (
        <span className="animate-blink-caret border-r-2 border-chloe-pink ml-0.5">
          &nbsp;
        </span>
      )}
    </span>
  );
}
