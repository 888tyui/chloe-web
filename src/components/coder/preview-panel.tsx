"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  code: string;
}

export function PreviewPanel({ code }: PreviewPanelProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(code);
    }, 500);
    return () => clearTimeout(timeout);
  }, [code]);

  const isEmpty = !code.trim();

  return (
    <div className="flex h-full flex-col overflow-hidden border border-chloe-pink/10">
      <div className="flex items-center justify-between border-b border-chloe-pink/10 bg-chloe-abyss px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-chloe-cyan tracking-widest uppercase">
            preview
          </span>
          {!isEmpty && (
            <span className="h-1.5 w-1.5 rounded-full bg-chloe-cyan/60 animate-pulse" />
          )}
        </div>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setKey((k) => k + 1)}
            className="h-6 gap-1 font-mono text-[10px] text-chloe-ash hover:text-chloe-pink hover:bg-chloe-pink/10"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        )}
      </div>
      <div className="flex-1 bg-chloe-void">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border border-chloe-elevated/40 bg-chloe-abyss/30">
              <Code2 className="h-6 w-6 text-chloe-ash/50" />
            </div>
            <div className="text-center space-y-1.5">
              <p className="font-mono text-[11px] text-chloe-ash/60">
                nothing to preview yet
              </p>
              <p className="font-mono text-[9px] text-chloe-ash/50 leading-relaxed max-w-[200px]">
                use the chat to generate a component,<br />
                or write code directly in the editor
              </p>
            </div>
            <span className="font-mono text-[8px] text-chloe-pink/15 tracking-[0.3em]">
              † awaiting creation †
            </span>
          </div>
        ) : (
          <iframe
            key={key}
            srcDoc={srcDoc}
            title="Preview"
            className="h-full w-full border-0"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
}
