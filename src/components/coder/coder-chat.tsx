"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CoderChatProps {
  onCodeGenerated: (code: string) => void;
  currentCode: string;
}

interface ChatMsg {
  id: string;
  role: "assistant" | "user";
  content: string;
  codeAttached?: boolean;
  suggestions?: string[];
}

const CODE_TEMPLATES: Record<string, string> = {
  button: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0A0A0A; font-family: monospace; }
    .btn { padding: 12px 32px; background: #FF1493; color: white; border: none; font-size: 14px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.15em; clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%); transition: all 0.2s; }
    .btn:hover { background: #FF006E; box-shadow: 0 0 20px rgba(255,20,147,0.5); transform: skewX(-2deg); }
  </style>
</head>
<body>
  <button class="btn">Execute</button>
</body>
</html>`,
  card: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0A0A0A; font-family: monospace; }
    .card { width: 300px; padding: 24px; background: #0F0F13; border: 1px solid rgba(255,20,147,0.2); clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
    .card h2 { margin: 0 0 8px; background: linear-gradient(135deg, #FF1493, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; letter-spacing: 0.1em; }
    .card p { color: #6A6A88; font-size: 12px; line-height: 1.6; }
    .tag { display: inline-block; padding: 4px 12px; border: 1px solid rgba(0,255,255,0.3); color: #00FFFF; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>CHLOE Card</h2>
    <p>A fractured card component with the menheera dark aesthetic.</p>
    <span class="tag">UI Component</span>
  </div>
</body>
</html>`,
  form: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0A0A0A; font-family: monospace; }
    .form { width: 320px; padding: 32px; background: #0F0F13; border: 1px solid rgba(255,20,147,0.15); }
    .form h2 { margin: 0 0 20px; color: #E8E8F0; text-transform: uppercase; letter-spacing: 0.15em; font-size: 14px; }
    .field { margin-bottom: 16px; }
    .field label { display: block; font-size: 10px; color: #6A6A88; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.2em; }
    .field input { width: 100%; padding: 10px 14px; border: 1px solid rgba(255,20,147,0.2); background: #0A0A0A; color: #E8E8F0; font-size: 12px; font-family: monospace; box-sizing: border-box; outline: none; }
    .field input:focus { border-color: #FF1493; box-shadow: 0 0 10px rgba(255,20,147,0.2); }
    .btn { width: 100%; padding: 12px; background: #FF1493; color: white; border: none; font-size: 12px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.15em; }
    .btn:hover { background: #FF006E; }
  </style>
</head>
<body>
  <form class="form" onsubmit="event.preventDefault()">
    <h2>Sign Up</h2>
    <div class="field"><label>Name</label><input type="text" placeholder="Enter your name" /></div>
    <div class="field"><label>Email</label><input type="email" placeholder="Enter your email" /></div>
    <button class="btn" type="submit">Create Account</button>
  </form>
</body>
</html>`,
  landing: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0A0A0A; font-family: monospace; color: #E8E8F0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .hero { text-align: center; padding: 40px; }
    .hero h1 { font-size: 3rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; background: linear-gradient(135deg, #FF1493, #00FFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px; }
    .hero p { color: #6A6A88; font-size: 14px; max-width: 400px; margin: 0 auto 32px; line-height: 1.6; }
    .cta { display: inline-block; padding: 14px 40px; background: #FF1493; color: white; text-decoration: none; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; transition: all 0.2s; }
    .cta:hover { background: #FF006E; box-shadow: 0 0 30px rgba(255,20,147,0.4); }
    .divider { width: 60px; height: 1px; background: rgba(255,20,147,0.3); margin: 24px auto; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Project Name</h1>
    <div class="divider"></div>
    <p>A brief description of your project. Replace this with something meaningful.</p>
    <a href="#" class="cta">Get Started</a>
  </div>
</body>
</html>`,
  navbar: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0A0A0A; font-family: monospace; }
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; border-bottom: 1px solid rgba(255,20,147,0.15); background: #0F0F13; }
    .nav-brand { font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; background: linear-gradient(135deg, #FF1493, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a { color: #6A6A88; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; transition: color 0.2s; }
    .nav-links a:hover { color: #FF1493; }
    .nav-btn { padding: 8px 20px; background: transparent; border: 1px solid rgba(0,255,255,0.3); color: #00FFFF; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; }
    .nav-btn:hover { background: rgba(0,255,255,0.1); }
  </style>
</head>
<body>
  <nav class="nav">
    <span class="nav-brand">Brand</span>
    <div class="nav-links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Features</a>
      <a href="#">Contact</a>
    </div>
    <button class="nav-btn">Connect</button>
  </nav>
</body>
</html>`,
};

function detectTemplate(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("landing") || lower.includes("hero") || lower.includes("homepage")) return "landing";
  if (lower.includes("nav") || lower.includes("header") || lower.includes("menu")) return "navbar";
  if (lower.includes("form") || lower.includes("signup") || lower.includes("sign up") || lower.includes("login") || lower.includes("input")) return "form";
  if (lower.includes("card") || lower.includes("tile") || lower.includes("panel")) return "card";
  if (lower.includes("button") || lower.includes("btn") || lower.includes("cta")) return "button";
  return null;
}

const INITIAL_MSG: ChatMsg = {
  id: "init",
  role: "assistant",
  content: "welcome to the code space. ♡\n\ntell me what you want to build — a button, card, form, landing page... or just describe it.\n\nI'll generate it, you refine it.",
  suggestions: ["make a button", "create a landing page", "build a form"],
};

export function CoderChat({ onCodeGenerated, currentCode }: CoderChatProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: msgText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Try API call
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: messages
            .filter((m) => m.id !== "init")
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
          context: "coder",
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const message = data.message || "here you go. ♡";
      const suggestions = Array.isArray(data.suggestions) ? data.suggestions : undefined;
      let codeAttached = false;

      // Handle code from API response
      if (data.code) {
        if (typeof data.code === "object" && data.code.content) {
          onCodeGenerated(data.code.content);
          codeAttached = true;
        } else if (typeof data.code === "string" && data.code.trim()) {
          onCodeGenerated(data.code);
          codeAttached = true;
        }
      }

      // Handle mock response with _template marker
      if (data._template) {
        if (data._template === "clear") {
          onCodeGenerated("");
        } else if (CODE_TEMPLATES[data._template]) {
          onCodeGenerated(CODE_TEMPLATES[data._template]);
          codeAttached = true;
        }
      }

      const assistantMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: message,
        codeAttached,
        suggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback to local template matching
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

      const lower = msgText.toLowerCase();
      const tmpl = detectTemplate(msgText);
      let replyText: string;
      let codeAttached = false;
      let suggestions: string[] | undefined;

      if (lower.includes("clear") || lower.includes("reset")) {
        onCodeGenerated("");
        replyText = "editor cleared. ready for something new... what shall we build? †";
        suggestions = ["make a button", "create a card", "build a landing page"];
      } else if (tmpl && CODE_TEMPLATES[tmpl]) {
        onCodeGenerated(CODE_TEMPLATES[tmpl]);
        codeAttached = true;
        const names: Record<string, string> = {
          button: "button component",
          card: "card component",
          form: "sign-up form",
          landing: "landing page hero",
          navbar: "navigation bar",
        };
        replyText = `here's a ${names[tmpl]} for you. check the editor — you can modify the code directly. ♡`;
        suggestions = ["add hover animation", "change the colors", "make it bigger"];
      } else if (lower.includes("help") || lower.includes("what can")) {
        replyText = "I can generate UI components for you. Try: button, card, form, landing, navbar — or describe what you need. ♡";
        suggestions = ["make a button", "create a landing page", "build a form"];
      } else {
        replyText = "I'm not sure what component that is... try asking for a button, card, form, landing page, or navbar. ♡";
        suggestions = ["make a button", "create a landing page", "build a form"];
      }

      const assistantMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
        codeAttached,
        suggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col gap-1", msg.role === "user" && "items-end")}>
            {msg.role === "assistant" && (
              <span className="font-mono text-[8px] text-chloe-pink/40 tracking-wider uppercase">
                chloe
              </span>
            )}
            <div
              className={cn(
                "font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-w-[90%]",
                msg.role === "assistant"
                  ? "text-chloe-smoke/70 border-l-2 border-chloe-pink/20 pl-2.5"
                  : "text-foreground bg-chloe-elevated/30 border border-chloe-elevated/50 px-2.5 py-1.5"
              )}
            >
              {msg.content}
            </div>
            {msg.codeAttached && (
              <span className="font-mono text-[8px] text-chloe-cyan/50 tracking-wider flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-chloe-cyan/50" />
                code pushed to editor
              </span>
            )}
            {/* Suggestion chips */}
            {msg.suggestions && msg.suggestions.length > 0 && msg.role === "assistant" && (
              <div className="flex flex-wrap gap-1 mt-1">
                {msg.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="font-mono text-[8px] text-chloe-smoke/35 border border-chloe-elevated/40 bg-chloe-abyss/20 px-2 py-0.5 transition-all duration-200 hover:border-chloe-pink/30 hover:text-chloe-pink hover:bg-chloe-pink/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-chloe-pink/40 tracking-wider uppercase">
              chloe
            </span>
            <Loader2 className="h-3 w-3 text-chloe-pink/40 animate-spin" />
            <span className="font-mono text-[9px] text-chloe-ash/50">thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-chloe-elevated/40 p-2.5">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="describe what to build..."
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-chloe-void border border-chloe-elevated/50 px-2.5 py-2 font-mono text-[11px] text-foreground placeholder:text-chloe-ash/50 focus:outline-none focus:border-chloe-pink/30 disabled:opacity-50"
          />
          <Button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            size="sm"
            className="h-auto px-3 bg-chloe-pink text-white hover:bg-chloe-pink-hot hover:shadow-[0_0_10px_#FF149340] disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <span className="block mt-1.5 font-mono text-[7px] text-chloe-ash/50 tracking-wider text-center">
          enter to send † shift+enter for newline
        </span>
      </div>
    </div>
  );
}
