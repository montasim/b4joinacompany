import { NextResponse } from "next/server";
import { z } from "zod";
import { answerWithFallback } from "@/lib/ai";
import { apiError } from "@/lib/api";
import { getCompany, getStories } from "@/lib/research";
import { consumeGeneration, logGeneration, requestActor } from "@/lib/operations";
const inputSchema=z.object({companySlug:z.string().min(2).max(120),question:z.string().min(8).max(500)});
export async function POST(request:Request){
  const started=Date.now(), requestId=crypto.randomUUID(), actorHash=requestActor(request);
  const parsed=inputSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return apiError(400,"INVALID_REQUEST","Provide a companySlug and a focused question of at least 8 characters.");
  const company=await getCompany(parsed.data.companySlug);
  if(!company)return apiError(404,"COMPANY_NOT_FOUND","No company matched this identifier.");
  const quota=await consumeGeneration(actorHash);
  if(!quota.allowed)return apiError(429,"GENERATION_QUOTA_REACHED",quota.scope==="daily"?"Today’s AI allowance is used. Try again tomorrow.":"This month’s AI allowance is used.");
  const evidence=await getStories(company.slug,parsed.data.question,8);
  const fallbackEvidence=evidence.length?evidence:await getStories(company.slug,"",5);
  const answer=await answerWithFallback({company:company.name,question:parsed.data.question,evidence:fallbackEvidence});
  await logGeneration({actorHash,requestId,provider:answer.provider,model:answer.model,latencyMs:Date.now()-started,gap:answer.gap});
  return NextResponse.json({...answer,snapshotVersion:company.snapshotDate,companySlug:company.slug,quota:{dailyUsed:quota.daily,monthlyUsed:quota.monthly},requestId});
}
