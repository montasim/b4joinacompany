import { NextResponse } from "next/server";
import { z } from "zod";

import { answerWithFallback } from "@/lib/ai";
import { apiError } from "@/lib/api";
import { consumeGeneration, logGeneration, requestActor } from "@/lib/operations";
import { getCompany, getStories } from "@/lib/research";

const inputSchema = z.object({
  company: z.string().min(2).max(120),
  question: z.string().min(3).max(800),
});

export async function POST(request: Request) {
  const started = Date.now();
  const requestId = crypto.randomUUID();
  const actorHash = requestActor(request);
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(400, "INVALID_REQUEST", "Provide a company and focused question.");

  const company = await getCompany(parsed.data.company);
  if (!company) return apiError(404, "COMPANY_NOT_FOUND", "No company matched this identifier.");
  const quota = await consumeGeneration(actorHash);
  if (!quota.allowed) {
    return apiError(429, "GENERATION_QUOTA_REACHED", "The current AI generation allowance is used.");
  }

  const matched = await getStories(company.slug, parsed.data.question, 8);
  const evidence = matched.length ? matched : await getStories(company.slug, "", 5);
  const generated = await answerWithFallback({
    company: company.name,
    question: parsed.data.question,
    evidence,
  });
  await logGeneration({
    actorHash,
    requestId,
    provider: generated.provider,
    model: generated.model,
    latencyMs: Date.now() - started,
    gap: generated.gap,
  });

  return NextResponse.json({
    answer: generated.text,
    citations: evidence.slice(0, generated.citations.length).map((story, index) => ({
      id: `S${index + 1}`,
      storyId: story.id,
      title: story.title,
      url: story.sourceUrl,
    })),
    provider: generated.provider,
    model: generated.model,
    snapshotVersion: company.snapshotDate,
    requestId,
  });
}
