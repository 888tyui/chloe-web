# The Anatomy

Beneath Chloe's animated exterior is a carefully designed system. Here's how all the pieces connect — from the Live2D renderer in your browser to the Solana blockchain millions of miles away.

## System Overview

```
    [You] ----cursor----> [Live2D]
      |                      |
      |---messages---> [Chat AI] ---expressions---> [Live2D]
      |                      |
      |---code-------> [Code Editor]
      |                      |
      +--------request-----> [API Server]
                              /    |    \
                             /     |     \
                     [Jupiter] [Solana] [AI Engine]
                     (quotes)   (RPC)   (prompt)
```

### Node Descriptions

| Component | Description |
|-----------|-------------|
| You | Your browser, your wallet, your cursor movements |
| Live2D | PixiJS + Cubism 4 rendering engine — makes Chloe move and react |
| Chat AI | AI-powered conversation with mood analysis and expression triggers |
| Code Editor | Monaco editor with live preview — generates and renders HTML/CSS |
| API Server | Next.js API routes — proxies external services and protects your keys |
| Jupiter | DEX aggregator — finds the best swap routes across all Solana DEXes |
| Solana | Solana blockchain — where your tokens live and transactions execute |
| AI Engine | GPT language model — powers Chloe's intelligent responses |

## The Layers

CHLOE operates in three distinct layers:

| Layer | Description |
|-------|-------------|
| Client Layer | Everything in your browser — Live2D rendering, chat UI, code editor, wallet connection. This is what you see and touch. |
| Server Layer | Next.js API routes running on the backend. They proxy requests to external services so your API keys stay safe and CORS doesn't block you. |
| External Layer | The outside world — Solana blockchain for transactions, Jupiter for swap routing, AI models for conversation intelligence. |

## How Data Flows

All data moves in one direction. Here's what happens when you do something:

1. **You Act** — Type a message, click swap, move your mouse — any interaction starts here.
2. **Client Processes** — Your browser handles immediate reactions (Live2D eye tracking, editor rendering) and sends requests to the API when external data is needed.
3. **Server Proxies** — The API server forwards your request to the right external service — Jupiter for swaps, AI for chat, Solana RPC for balances.
4. **Response Returns** — Data flows back the same way: external service -> server -> client -> you see the result.

## Space Architecture

Each page in CHLOE is independently structured but shares common infrastructure:

| Space | Client Components | API Dependencies |
|-------|-------------------|-----------------|
| Agent | Live2D, Chat, Terminal, AMM Simulator | Chat API, Price API |
| DEX | Swap Form, Portfolio, Price Ticker, Wallet Assistant | Jupiter API, Solana RPC, Price API |
| Coder | Monaco Editor, Live Preview, File Tree, Chat | Code Generation API |
| Docs | Interactive renderer, TOC, Search | None (all static) |
| Labs | Experiment cards, Expression tester | None |
