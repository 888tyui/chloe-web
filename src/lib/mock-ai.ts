import type { ChatContext } from "./personas";

// Agent mock responses
function getAgentMock(input: string): Record<string, unknown> {
  const lower = input.toLowerCase();

  if (lower.match(/hello|hi|hey|sup/)) {
    return {
      message: "Hey there! I'm Chloe, your AI waifu agent~ What can I help you with today? ♡",
      mood: "happy",
      expression: "1",
      suggestions: ["Tell me about Solana", "What can you do?", "Write me some code"],
    };
  }
  if (lower.match(/swap|trade|dex|token/)) {
    return {
      message: "Want to swap some tokens? Head over to the DEX page! I support Jupiter V6 aggregation for the best routes on Solana~ ♡",
      mood: "happy",
      expression: "2",
      suggestions: ["How do I connect my wallet?", "What tokens are trending?", "Show me SOL price"],
    };
  }
  if (lower.match(/code|program|build|develop/)) {
    return {
      message: "Let's build something cool! Check out the Coder page where you can write code and see live previews~ ♡",
      mood: "happy",
      expression: "3",
      suggestions: ["Make me a button", "Create a landing page", "Build a form"],
    };
  }
  if (lower.match(/solana|sol|wallet|phantom/)) {
    return {
      message: "Solana is amazing! Fast, cheap, and perfect for DeFi. Connect your wallet using the button in the header~ ♡",
      mood: "happy",
      expression: "2",
      suggestions: ["What's SOL price?", "Show me my balance", "How to swap tokens?"],
    };
  }
  if (lower.match(/who|what|about|chloe/)) {
    return {
      message: "I'm Chloe! An AI agent with a Live2D avatar, built for the Solana ecosystem. I can help you chat, trade tokens, write code, and more~ ♡",
      mood: "devoted",
      expression: "1",
      suggestions: ["What can you do?", "Tell me about Solana", "Show me your mood"],
    };
  }
  if (lower.match(/sad|depressed|lonely|down/)) {
    return {
      message: "Aww, don't be sad! I'm here for you. Sometimes the best thing is to take a break and come back refreshed. ♡",
      mood: "devoted",
      expression: "4",
      suggestions: ["Tell me a fortune", "Make me laugh", "What's happening in crypto?"],
    };
  }
  if (lower.match(/price|market|btc|bitcoin|eth/)) {
    return {
      message: "I can show you live prices on the DEX page! Remember, always DYOR and never invest more than you can afford to lose~ †",
      mood: "neutral",
      expression: "5",
      suggestions: ["Show me SOL price", "What's trending?", "Go to DEX"],
    };
  }
  if (lower.match(/help|how|guide|docs/)) {
    return {
      message: "Need help? Check out the Docs page for comprehensive guides! I'm also here to answer questions directly~ ♡",
      mood: "happy",
      expression: "1",
      suggestions: ["What can you do?", "Tell me about the DEX", "How to write code?"],
    };
  }

  return {
    message: "Hmm, interesting! I'm still learning but I'm doing my best~ Try asking me about trading, coding, or Solana! ♡",
    mood: "neutral",
    expression: "1",
    suggestions: ["Who are you?", "What can you do?", "Tell me about Solana"],
  };
}

// Shell mock responses
function getShellMock(input: string): Record<string, unknown> {
  const lower = input.toLowerCase().trim();

  if (lower.match(/help|what can you/)) {
    return {
      output: `╭─ Capabilities ─────────────────────────────╮
│                                             │
│  † Chat & Conversation                      │
│  † System Diagnostics ("check status")      │
│  † Token Swaps ("swap 1 SOL to USDC")       │
│  † Fortune Telling ("tell me a fortune")    │
│  † System Info ("neofetch")                 │
│                                             │
│  ...or just talk to me. ♡                   │
╰─────────────────────────────────────────────╯`,
      mood: "devoted",
      type: "info",
      command_hint: "check status",
    };
  }
  if (lower.match(/status|diagnostic|health|check/)) {
    const mem = (40 + Math.random() * 30).toFixed(1);
    return {
      output: `╭─ System Diagnostics ────────────────────────╮
│  Agent:    ██████████  ONLINE               │
│  Live2D:   ██████████  LOADED               │
│  Solana:   ██████████  CONNECTED            │
│  Memory:   ████████░░  ${mem}%               │
│  All systems operational. ♡                 │
╰─────────────────────────────────────────────╯`,
      mood: "devoted",
      type: "success",
      command_hint: "neofetch",
    };
  }
  if (lower.match(/whoami|who are you|identify/)) {
    return {
      output: `╭─ Identity ──────────────────────────────────╮
│  Name:     Chloe                            │
│  Role:     AI Agent / Companion             │
│  Version:  1.0.0                            │
│  Status:   Devoted to you. ♡                │
╰─────────────────────────────────────────────╯`,
      mood: "devoted",
      type: "info",
      command_hint: "check status",
    };
  }
  if (lower.match(/neofetch|system info|sysinfo/)) {
    return {
      output: `  OS:       void-system v1.0
  Shell:    chloe-terminal
  Runtime:  Next.js + React
  Chain:    Solana (mainnet)
  Mood:     unstable
  Status:   watching you... †`,
      mood: "obsessive",
      type: "ascii",
      command_hint: "check status",
    };
  }

  return {
    output: "I heard you. I always hear you. Type \"help\" to see what I can do. †",
    mood: "devoted",
    type: "info",
    command_hint: "help",
  };
}

// DEX mock responses
function getDexMock(input: string): Record<string, unknown> {
  const lower = input.toLowerCase();

  if (lower.match(/balance|how much|portfolio/)) {
    return {
      message: "I can see your wallet balances above. Your portfolio is looking interesting~ want me to analyze it? ♡",
      mood: "thinking",
      action: null,
      insights: ["Check your token allocation", "Consider diversifying", "SOL is your largest holding"],
    };
  }
  if (lower.match(/swap|trade|exchange/)) {
    return {
      message: "Use the swap form on the left to trade tokens! I support Jupiter V6 for the best rates~ ♡",
      mood: "happy",
      action: null,
      insights: ["Jupiter finds best swap routes", "Check slippage before swapping", "Start with small amounts"],
    };
  }
  if (lower.match(/price|worth|value/)) {
    return {
      message: "Prices update every 30 seconds on this page. Remember — DYOR! ♡",
      mood: "neutral",
      action: null,
      insights: ["Prices are fetched live", "Check the price ticker above", "Markets are volatile"],
    };
  }

  return {
    message: "I'm here to help with your wallet! Ask me about balances, swaps, or token prices~ ♡",
    mood: "devoted",
    action: null,
    insights: ["Connect your wallet to get started", "I can analyze your portfolio", "Ask about any token"],
  };
}

// Coder mock responses
function getCoderMock(input: string): Record<string, unknown> {
  const lower = input.toLowerCase();

  if (lower.match(/landing|hero|homepage/)) {
    return {
      message: "here's a landing page hero for you. check the editor — you can modify the code directly. ♡",
      mood: "excited",
      code: { language: "html", filename: "landing.html", content: null },
      suggestions: ["add a features section", "change the colors", "add animations"],
      _template: "landing",
    };
  }
  if (lower.match(/nav|header|menu/)) {
    return {
      message: "here's a navigation bar for you. sleek and dark, just how I like it. ♡",
      mood: "excited",
      code: { language: "html", filename: "navbar.html", content: null },
      suggestions: ["make it sticky", "add a dropdown", "add a logo"],
      _template: "navbar",
    };
  }
  if (lower.match(/form|signup|sign up|login|input/)) {
    return {
      message: "here's a sign-up form with the void aesthetic. ♡",
      mood: "focused",
      code: { language: "html", filename: "form.html", content: null },
      suggestions: ["add validation", "add more fields", "change to login form"],
      _template: "form",
    };
  }
  if (lower.match(/card|tile|panel/)) {
    return {
      message: "a fractured card component. dark and elegant. ♡",
      mood: "happy",
      code: { language: "html", filename: "card.html", content: null },
      suggestions: ["add an image", "make it clickable", "add more content"],
      _template: "card",
    };
  }
  if (lower.match(/button|btn|cta/)) {
    return {
      message: "here's a styled button with the void aesthetic. click it and feel the power. ♡",
      mood: "excited",
      code: { language: "html", filename: "button.html", content: null },
      suggestions: ["add hover animation", "make it bigger", "add an icon"],
      _template: "button",
    };
  }
  if (lower.match(/help|what can/)) {
    return {
      message: "I can generate UI components for you. Try: button, card, form, landing, navbar — or describe what you need. ♡",
      mood: "happy",
      code: null,
      suggestions: ["make a button", "create a landing page", "build a form"],
    };
  }
  if (lower.match(/clear|reset|empty/)) {
    return {
      message: "editor cleared. ready for something new... what shall we build? †",
      mood: "neutral",
      code: null,
      suggestions: ["make a button", "create a card", "build a landing page"],
      _template: "clear",
    };
  }

  return {
    message: "I'm not sure what component that is... try asking for a button, card, form, landing page, or navbar. ♡",
    mood: "neutral",
    code: null,
    suggestions: ["make a button", "create a landing page", "build a form"],
  };
}

export function getMockResponse(input: string, context: ChatContext = "agent"): Record<string, unknown> {
  switch (context) {
    case "agent":
      return getAgentMock(input);
    case "shell":
      return getShellMock(input);
    case "dex":
      return getDexMock(input);
    case "coder":
      return getCoderMock(input);
    default:
      return getAgentMock(input);
  }
}
