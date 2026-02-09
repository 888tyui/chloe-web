"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  code: string;
  isHtml?: boolean;
}

export function PreviewPanel({ code, isHtml = true }: PreviewPanelProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(code);
    }, 500);
    return () => clearTimeout(timeout);
  }, [code]);

  const isEmpty = !code.trim();
  const canPreview = isHtml && !isEmpty;

  return (
    <div className="flex h-full flex-col overflow-hidden border border-chloe-pink/10">
      <div className="flex items-center justify-between border-b border-chloe-pink/10 bg-chloe-abyss px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-chloe-cyan tracking-widest uppercase">
            preview
          </span>
          {canPreview && (
            <span className="h-1.5 w-1.5 rounded-full bg-chloe-cyan/60 animate-pulse" />
          )}
        </div>
        {canPreview && (
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
        {canPreview ? (
          <iframe
            key={key}
            srcDoc={srcDoc}
            title="Preview"
            className="h-full w-full border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border border-chloe-elevated/40 bg-chloe-abyss/30">
              <Code2 className="h-6 w-6 text-chloe-ash/50" />
            </div>
            <div className="text-center space-y-1.5">
              <p className="font-mono text-[11px] text-chloe-ash/60">
                {!isHtml && !isEmpty
                  ? "preview is only available for HTML files"
                  : "nothing to preview yet"}
              </p>
              <p className="font-mono text-[9px] text-chloe-ash/50 leading-relaxed max-w-[220px]">
                {!isHtml && !isEmpty
                  ? "switch to the editor tab to view your code,\nor generate an HTML file for live preview"
                  : "use the chat to generate code,\nor write directly in the editor"}
              </p>
            </div>
            <span className="font-mono text-[8px] text-chloe-pink/15 tracking-[0.3em]">
              {!isHtml && !isEmpty ? "† code only †" : "† awaiting creation †"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
