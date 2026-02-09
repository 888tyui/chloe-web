interface ChatCompletionMessage {
  role: "developer" | "user" | "assistant";
  content: string;
}

interface OpenAIOptions {
  reasoningEffort?: "none" | "low" | "medium" | "high";
  verbosity?: "low" | "medium" | "high";
}

export async function getOpenAIResponse(
  systemPrompt: string,
  messages: ChatCompletionMessage[],
  maxTokens: number = 1000,
  options: OpenAIOptions = {}
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const { reasoningEffort = "none", verbosity } = options;

  const body: Record<string, unknown> = {
    model: "gpt-5.2",
    messages: [{ role: "developer", content: systemPrompt }, ...messages],
    max_completion_tokens: maxTokens,
    reasoning_effort: reasoningEffort,
    response_format: { type: "json_object" },
  };

  if (verbosity) {
    body.verbosity = verbosity;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[OpenAI] API error:", response.status, errBody.slice(0, 300));
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "{}";
  const finishReason = data.choices?.[0]?.finish_reason;
  const usage = data.usage;

  console.log("[OpenAI] finish_reason:", finishReason);
  console.log("[OpenAI] usage:", JSON.stringify(usage));
  console.log("[OpenAI] raw response length:", raw.length);
  console.log("[OpenAI] raw preview:", raw.slice(0, 300));

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("[OpenAI] JSON parse failed:", e);
    console.error("[OpenAI] Raw content:", raw.slice(0, 500));
    return { message: raw, mood: "neutral" };
  }
}
