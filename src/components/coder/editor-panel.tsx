"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-chloe-void">
      <p className="animate-pulse font-mono text-xs text-chloe-pink tracking-widest uppercase">
        [SYS] Loading editor...
      </p>
    </div>
  ),
});

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function EditorPanel({
  value,
  onChange,
  language = "html",
}: EditorPanelProps) {
  const stats = useMemo(() => {
    const lines = value.split("\n").length;
    const bytes = new Blob([value]).size;
    const sizeStr = bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}KB`;
    return { lines, size: sizeStr };
  }, [value]);

  return (
    <div className="h-full overflow-hidden border border-chloe-pink/10">
      <div className="flex items-center justify-between border-b border-chloe-pink/10 bg-chloe-abyss px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-chloe-pink tracking-widest uppercase">
            editor.{language}
          </span>
          <span className="font-mono text-[8px] text-chloe-ash/50 tracking-wider">
            {stats.lines} lines · {stats.size}
          </span>
        </div>
        <span className="font-mono text-[10px] text-chloe-ash tracking-wider">
          Monaco // CHLOE IDE
        </span>
      </div>
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "JetBrains Mono, monospace",
          lineNumbers: "on",
          tabSize: 2,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          renderLineHighlight: "gutter",
          cursorBlinking: "smooth",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
