"use client";

import { useState } from "react";
import {
  FileCode2,
  FileText,
  FilePlus,
  Trash2,
  Download,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (name: string) => void;
  onCreateFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
  onDownload: () => void;
}

function getFileIcon(name: string) {
  if (name.endsWith(".html")) return <FileCode2 className="h-3.5 w-3.5 text-chloe-pink/60" />;
  if (name.endsWith(".css")) return <FileText className="h-3.5 w-3.5 text-chloe-cyan/60" />;
  if (name.endsWith(".js") || name.endsWith(".ts"))
    return <FileText className="h-3.5 w-3.5 text-yellow-500/60" />;
  return <FileText className="h-3.5 w-3.5 text-chloe-ash/60" />;
}

function getLanguageTag(name: string) {
  if (name.endsWith(".html")) return "HTML";
  if (name.endsWith(".css")) return "CSS";
  if (name.endsWith(".js")) return "JS";
  if (name.endsWith(".ts")) return "TS";
  if (name.endsWith(".json")) return "JSON";
  return "";
}

const NEW_FILE_OPTIONS = [
  { ext: ".html", label: "HTML" },
  { ext: ".css", label: "CSS" },
  { ext: ".js", label: "JS" },
];

export function FileTree({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onDownload,
}: FileTreeProps) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newExt, setNewExt] = useState(".html");

  const fileNames = Object.keys(files).sort();
  const totalSize = Object.values(files).reduce((sum, c) => sum + new Blob([c]).size, 0);
  const sizeStr = totalSize < 1024 ? `${totalSize}B` : `${(totalSize / 1024).toFixed(1)}KB`;

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const fullName = name.includes(".") ? name : `${name}${newExt}`;
    if (files[fullName]) return;
    onCreateFile(fullName);
    setNewName("");
    setShowNew(false);
  };

  const handleNewKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") {
      setShowNew(false);
      setNewName("");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chloe-elevated/30 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <FolderOpen className="h-3 w-3 text-chloe-pink/50" />
          <span className="font-mono text-[8px] text-chloe-ash/50 uppercase tracking-[0.2em]">
            codespace
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[7px] text-chloe-ash/50 mr-1">
            {fileNames.length} files · {sizeStr}
          </span>
          <button
            onClick={() => setShowNew(!showNew)}
            title="New file"
            className="p-1 text-chloe-ash/60 hover:text-chloe-pink transition-colors"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* New file form */}
      {showNew && (
        <div className="border-b border-chloe-elevated/20 px-3 py-2 space-y-1.5 bg-chloe-void/50">
          <div className="flex gap-1">
            {NEW_FILE_OPTIONS.map((opt) => (
              <button
                key={opt.ext}
                onClick={() => setNewExt(opt.ext)}
                className={cn(
                  "font-mono text-[8px] px-1.5 py-0.5 border transition-all",
                  newExt === opt.ext
                    ? "border-chloe-pink/40 text-chloe-pink bg-chloe-pink/5"
                    : "border-chloe-elevated/40 text-chloe-ash/60 hover:text-chloe-ash"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleNewKeyDown}
              placeholder="filename"
              autoFocus
              className="flex-1 bg-chloe-void border border-chloe-elevated/40 px-2 py-1 font-mono text-[10px] text-foreground placeholder:text-chloe-ash/50 focus:outline-none focus:border-chloe-pink/30"
            />
            <Button
              onClick={handleCreate}
              disabled={!newName.trim()}
              size="sm"
              className="h-auto px-2 py-1 bg-chloe-pink text-white text-[9px] hover:bg-chloe-pink-hot disabled:opacity-30"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto py-1">
        {fileNames.map((name) => (
          <div
            key={name}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all",
              activeFile === name
                ? "bg-chloe-pink/8 border-l-2 border-chloe-pink"
                : "border-l-2 border-transparent hover:bg-chloe-elevated/10"
            )}
            onClick={() => onSelectFile(name)}
          >
            {getFileIcon(name)}
            <span
              className={cn(
                "flex-1 font-mono text-[11px] truncate",
                activeFile === name ? "text-chloe-pink" : "text-chloe-smoke/80"
              )}
            >
              {name}
            </span>
            <span className="font-mono text-[7px] text-chloe-ash/50 tracking-wider">
              {getLanguageTag(name)}
            </span>
            {fileNames.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(name);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-chloe-ash/50 hover:text-chloe-blood transition-all"
                title="Delete file"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Download */}
      <div className="shrink-0 border-t border-chloe-elevated/30 p-2.5">
        <Button
          onClick={onDownload}
          variant="ghost"
          size="sm"
          className="w-full h-7 gap-1.5 font-mono text-[9px] text-chloe-ash/50 hover:text-chloe-cyan hover:bg-chloe-cyan/5 border border-chloe-elevated/30 hover:border-chloe-cyan/20 uppercase tracking-wider"
        >
          <Download className="h-3 w-3" />
          Download .zip
        </Button>
      </div>
    </div>
  );
}
