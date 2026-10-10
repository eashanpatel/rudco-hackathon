import OpenAI from "openai";

export const NICRRON_BASE_URL = "https://api.nicrron.ai/v1";

export const models = {
  parse: process.env.NICRRON_MODEL_PARSE || "anthropic/claude-sonnet-5",
  fast: process.env.NICRRON_MODEL_FAST || "nicrron/auto",
  embed: process.env.NICRRON_MODEL_EMBED || "openai/text-embedding-3-small",
};

let client: OpenAI | null = null;

export function llm(): OpenAI {
  if (!client) {
    if (!process.env.NICRRON_API_KEY) {
      throw new Error("NICRRON_API_KEY is not set. Add it to .env.local.");
    }
    client = new OpenAI({
      apiKey: process.env.NICRRON_API_KEY,
      baseURL: NICRRON_BASE_URL,
    });
  }
  return client;
}

export type CallUsage = {
  model: string;
  promptTokens: number;
  completionTokens: number;
  costUsd: number | null; // only if the gateway reports it
  cacheHit: boolean;
  ms: number;
};

export type JsonCallResult = { text: string; usage: CallUsage };

/** One chat completion asking for a JSON object back. */
export async function callJson(opts: {
  system: string;
  user: string;
  model?: string;
}): Promise<JsonCallResult> {
  const model = opts.model ?? models.parse;
  const t0 = Date.now();
  const { data, response } = await llm()
    .chat.completions.create({
      model,
      // Claude 5 models reject `temperature`; determinism comes from the
      // exact-match cache (identical request => cached response).
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
    })
    .withResponse();

  const u = data.usage as (OpenAI.CompletionUsage & { cost?: number }) | undefined;
  const headerCost = response.headers.get("x-nicrron-cost");
  const costUsd =
    typeof u?.cost === "number" ? u.cost : headerCost ? Number(headerCost) : null;

  return {
    text: data.choices[0]?.message?.content ?? "",
    usage: {
      model: data.model || model,
      promptTokens: u?.prompt_tokens ?? 0,
      completionTokens: u?.completion_tokens ?? 0,
      costUsd,
      cacheHit: response.headers.get("x-nicrron-cache") === "HIT",
      ms: Date.now() - t0,
    },
  };
}
