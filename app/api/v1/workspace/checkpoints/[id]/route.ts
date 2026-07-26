import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { workspaceActor } from "@/lib/session";
import { updateCheckpoint } from "@/lib/workspace";
const schema=z.object({expectedRevision:z.number().int().positive(),stage:z.string().optional(),role:z.string().optional(),priority:z.string().optional(),note:z.string().max(5000).optional(),snapshotVersion:z.string().optional()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const actor=await workspaceActor(request); if(!actor)return apiError(401,"AUTH_REQUIRED","Sign in to update a private website checkpoint.");
  const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return apiError(400,"INVALID_REQUEST","The checkpoint update is invalid.");
  const {expectedRevision,...patch}=parsed.data; const {id}=await params;
  const updated=await updateCheckpoint(actor.userId,id,expectedRevision,patch);
  return updated?NextResponse.json(updated):apiError(409,"REVISION_CONFLICT","This checkpoint changed elsewhere. Reload before saving again.");
}
