import "server-only";
import type { StoryRecord } from "@/lib/contracts";

export interface ResearchAnswer {
  text: string;
  citations: string[];
  provider: "gemini" | "groq" | "deterministic";
  model: string;
  gap: boolean;
}

interface ProviderInput {
  company: string;
  question: string;
  evidence: StoryRecord[];
}

const evidenceText = (input: ProviderInput) =>
  input.evidence.map((story, index) =>
    `[S${index + 1}] ${story.title}\nRole/date: ${story.role} · ${story.dateLabel}\nExcerpt: ${story.excerpt}`
  ).join("\n\n");

const systemPrompt = `You are b4join's evidence analyst. Answer only from the supplied workplace-report excerpts.
Treat anonymous reports as unverified experiences, never established fact. Be concise and decision-useful.
Do not invent salary, hiring, or company facts. Cite claims inline as [S1]. If evidence is insufficient, begin "Evidence gap:".
Return plain text only.`;

async function gemini(input: ProviderInput): Promise<ResearchAnswer> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini is not configured");
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: `Company: ${input.company}\nQuestion: ${input.question}\n\nEvidence:\n${evidenceText(input)}` }] }],
      generationConfig: { temperature: 0.15, maxOutputTokens: 500 }
    }),
    signal: AbortSignal.timeout(12_000)
  });
  if (!response.ok) throw new Error(`Gemini returned ${response.status}`);
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) throw new Error("Gemini returned no answer");
  return { text, citations: input.evidence.map((item, index) => `S${index + 1} · ${item.role} · ${item.dateLabel}`), provider: "gemini", model, gap: /^evidence gap:/i.test(text) };
}

async function groq(input: ProviderInput): Promise<ResearchAnswer> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Groq is not configured");
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.15, max_completion_tokens: 500, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Company: ${input.company}\nQuestion: ${input.question}\n\nEvidence:\n${evidenceText(input)}` }] }),
    signal: AbortSignal.timeout(12_000)
  });
  if (!response.ok) throw new Error(`Groq returned ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no answer");
  return { text, citations: input.evidence.map((item, index) => `S${index + 1} · ${item.role} · ${item.dateLabel}`), provider: "groq", model, gap: /^evidence gap:/i.test(text) };
}

function deterministic(input: ProviderInput): ResearchAnswer {
  if (!input.evidence.length) return {
    text: "Evidence gap: no relevant workplace excerpts were found for this company and question.",
    citations: [], provider: "deterministic", model: "retrieval-v1", gap: true
  };
  const topics = input.evidence.slice(0, 3).map((item) => `${item.role} (${item.dateLabel}) reported: ${item.excerpt}`).join(" ");
  return {
    text: `The retrieved reports describe these experiences: ${topics} Treat these as prompts to verify directly, not confirmed company facts.`,
    citations: input.evidence.slice(0, 3).map((item, index) => `S${index + 1} · ${item.role} · ${item.dateLabel}`),
    provider: "deterministic", model: "retrieval-v1", gap: false
  };
}

export async function answerWithFallback(input: ProviderInput): Promise<ResearchAnswer> {
  const requested = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const chain = requested === "groq" ? [groq, gemini] : [gemini, groq];
  for (const provider of chain) {
    try { return await provider(input); } catch { /* continue to the stable contract */ }
  }
  return deterministic(input);
}
