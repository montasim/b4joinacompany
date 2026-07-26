import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { workspaceActor } from "@/lib/session";
import { createCheckpoint, listCheckpoints } from "@/lib/workspace";
const schema=z.object({companySlug:z.string().min(2),stage:z.string().min(2),role:z.string().min(2),priority:z.string().min(2),note:z.string().max(5000).default(""),snapshotVersion:z.string().min(4)});
export async function GET(request:Request){
  const actor=await workspaceActor(request); if(!actor)return apiError(401,"AUTH_REQUIRED","Sign in or pair the extension to access the private workspace.");
  return NextResponse.json({items:await listCheckpoints(actor.userId)});
}
export async function POST(request:Request){
  const actor=await workspaceActor(request); if(!actor)return apiError(401,"AUTH_REQUIRED","Sign in or pair the extension to save a checkpoint.");
  const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return apiError(400,"INVALID_REQUEST","Checkpoint context is incomplete.");
  return NextResponse.json(await createCheckpoint(actor.userId,parsed.data),{status:201});
}
