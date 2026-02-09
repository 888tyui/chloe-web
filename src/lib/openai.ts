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
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "{}";

  try {
    return JSON.parse(raw);
  } catch {
    // Fallback: wrap raw text in a basic structure
    return { message: raw, mood: "neutral" };
  }
}
