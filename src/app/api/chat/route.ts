import { NextRequest, NextResponse } from "next/server";
import { getMockResponse } from "@/lib/mock-ai";
import { getOpenAIResponse } from "@/lib/openai";
import { getSystemPrompt, type ChatContext } from "@/lib/personas";

const MAX_TOKENS: Record<ChatContext, number> = {
  agent: 1000,
  shell: 1000,
  dex: 1000,
  coder: 4000,
};

export async function POST(req: NextRequest) {
  try {
    const { message, history, context = "agent" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const chatContext = (context as ChatContext) || "agent";

    // Use OpenAI if configured, otherwise fall back to mock
    if (process.env.OPENAI_API_KEY) {
      const systemPrompt = getSystemPrompt(chatContext);
      const messages = [
        ...(history || []).map(
          (m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })
        ),
        { role: "user" as const, content: message },
      ];

      if (chatContext === "coder") {
        console.log("[CODER API] Sending to OpenAI, message:", message);
        console.log("[CODER API] Max tokens:", MAX_TOKENS[chatContext]);
      }

      const response = await getOpenAIResponse(
        systemPrompt,
        messages,
        MAX_TOKENS[chatContext] ?? 1000,
        chatContext === "coder"
          ? { reasoningEffort: "none" }
          : { reasoningEffort: "none", verbosity: "low" }
      );

      if (chatContext === "coder") {
        console.log("[CODER API] OpenAI response keys:", Object.keys(response));
        console.log("[CODER API] Has code?", !!response.code, "type:", typeof response.code);
        if (response.code && typeof response.code === "object") {
          const code = response.code as Record<string, unknown>;
          console.log("[CODER API] code.content length:", typeof code.content === "string" ? code.content.length : "N/A");
        }
        console.log("[CODER API] Full response:", JSON.stringify(response).slice(0, 500));
      }

      return NextResponse.json(response);
    }

    // Mock response with slight delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const response = getMockResponse(message, chatContext);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
