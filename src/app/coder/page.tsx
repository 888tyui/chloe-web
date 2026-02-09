"use client";

import { useState, useCallback } from "react";
import { Code2, Eye, Sparkles, Monitor } from "lucide-react";
import { EditorPanel } from "@/components/coder/editor-panel";
import { PreviewPanel } from "@/components/coder/preview-panel";
import { CoderChat } from "@/components/coder/coder-chat";
import { FileTree } from "@/components/coder/file-tree";
import { Live2DWrapper } from "@/components/live2d/live2d-wrapper";
import { cn } from "@/lib/utils";

type RightTab = "editor" | "preview";

const INITIAL_FILES: Record<string, string> = {
  "index.html": "",
};

function getLanguage(filename: string): string {
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".ts")) return "typescript";
  if (filename.endsWith(".json")) return "json";
  return "plaintext";
}

export default function CoderPage() {
  const [files, setFiles] = useState<Record<string, string>>(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState("index.html");
  const [rightTab, setRightTab] = useState<RightTab>("editor");

  const currentCode = files[activeFile] ?? "";

  const handleCodeChange = useCallback(
    (value: string) => {
      setFiles((prev) => ({ ...prev, [activeFile]: value }));
    },
    [activeFile]
  );

  const handleCodeGenerated = useCallback(
    (code: string) => {
      setFiles((prev) => ({ ...prev, [activeFile]: code }));
    },
    [activeFile]
  );

  const handleCreateFile = useCallback((name: string) => {
    setFiles((prev) => ({ ...prev, [name]: "" }));
    setActiveFile(name);
  }, []);

  const handleDeleteFile = useCallback(
    (name: string) => {
      setFiles((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      if (activeFile === name) {
        const remaining = Object.keys(files).filter((f) => f !== name);
        setActiveFile(remaining[0] || "index.html");
      }
    },
    [activeFile, files]
  );

  const handleDownload = useCallback(async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    Object.entries(files).forEach(([name, content]) => {
      zip.file(name, content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codespace.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [files]);

  return (
    <>
    {/* Mobile fallback */}
    <div className="flex lg:hidden h-[calc(100vh-4rem)] flex-col items-center justify-center bg-chloe-void px-8 text-center">
      <Monitor className="h-12 w-12 text-chloe-pink/40 mb-6" />
      <h2 className="font-title text-2xl text-chloe-pink uppercase tracking-[0.15em] mb-3">
        Desktop Only
      </h2>
      <p className="font-mono text-[11px] text-chloe-ash/60 leading-relaxed max-w-[320px]">
        The code editor requires a larger screen.
        Please use a PC or Web environment for the best experience. ♡
      </p>
      <span className="mt-6 font-mono text-[8px] text-chloe-pink/20 tracking-[0.3em]">† CHLOE::CODER ♰</span>
    </div>

    <div className="hidden lg:flex h-[calc(100vh-4rem)] bg-chloe-void">
      {/* Left: Live2D + Chat */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-chloe-elevated/60 bg-chloe-abyss/40">
        {/* Mini Live2D */}
        <div className="relative h-[240px] shrink-0 border-b border-chloe-elevated/30 bg-chloe-abyss/60 overflow-hidden">
          <Live2DWrapper
            className="h-full w-full"
            scaleMultiplier={3.0}
            offsetY={1.5}
          />
          <div className="absolute top-2 left-2.5 flex items-center gap-1.5">
            <Sparkles className="h-2.5 w-2.5 text-chloe-pink/40" />
            <span className="font-mono text-[7px] text-chloe-ash/60 uppercase tracking-[0.3em]">
              Code Assistant
            </span>
            <span className="text-chloe-pink/15 text-[8px]">†</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <CoderChat onCodeGenerated={handleCodeGenerated} currentCode={currentCode} />
        </div>
      </div>

      {/* Middle: File Tree (always visible) */}
      <div className="flex w-[180px] shrink-0 flex-col border-r border-chloe-elevated/60 bg-chloe-abyss/20">
        <FileTree
          files={files}
          activeFile={activeFile}
          onSelectFile={(name) => {
            setActiveFile(name);
            setRightTab("editor");
          }}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
          onDownload={handleDownload}
        />
      </div>

      {/* Right: Editor / Preview tabs */}
      <div className="flex flex-1 min-w-0 flex-col">
        {/* Tab Bar */}
        <div className="shrink-0 flex items-center border-b border-chloe-elevated/60 bg-chloe-abyss/40">
          <button
            onClick={() => setRightTab("editor")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 -mb-px",
              rightTab === "editor"
                ? "border-chloe-pink text-chloe-pink bg-chloe-void/50"
                : "border-transparent text-chloe-ash/50 hover:text-chloe-ash hover:bg-chloe-void/20"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            {activeFile}
          </button>
          <button
            onClick={() => setRightTab("preview")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 -mb-px",
              rightTab === "preview"
                ? "border-chloe-cyan text-chloe-cyan bg-chloe-void/50"
                : "border-transparent text-chloe-ash/50 hover:text-chloe-ash hover:bg-chloe-void/20"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
            {rightTab === "preview" && (
              <span className="h-1.5 w-1.5 rounded-full bg-chloe-cyan/60 animate-pulse" />
            )}
          </button>
          <div className="ml-auto flex items-center gap-3 px-4">
            <span className="font-mono text-[7px] text-chloe-ash/50 tracking-wider uppercase">
              <span className="text-chloe-pink/15">†</span> monaco
            </span>
            <span className="font-mono text-[7px] text-chloe-ash/50 tracking-wider uppercase">
              <span className="text-chloe-cyan/15">♰</span> live reload
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0">
          <div className={cn("h-full", rightTab !== "editor" && "hidden")}>
            <EditorPanel
              value={currentCode}
              onChange={handleCodeChange}
              language={getLanguage(activeFile)}
            />
          </div>
          <div className={cn("h-full", rightTab !== "preview" && "hidden")}>
            <PreviewPanel code={files["index.html"] ?? ""} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
