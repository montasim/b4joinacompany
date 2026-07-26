import { createHash, randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { database } from "@/lib/db";
const schema=z.object({code:z.string().min(10),deviceName:z.string().min(2).max(100)});
export async function POST(request:Request){
  const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return apiError(400,"INVALID_REQUEST","Pairing code and device name are required.");
  const db=await database(); const now=new Date(); const codeHash=createHash("sha256").update(parsed.data.code).digest("hex");
  const pair=await db.collection("pairingCodes").findOneAndUpdate({codeHash,usedAt:null,expiresAt:{$gt:now}},{$set:{usedAt:now}});
  if(!pair)return apiError(410,"PAIRING_CODE_EXPIRED","This pairing code is invalid, expired, or already used.");
  const token=randomBytes(32).toString("base64url"); const tokenHash=createHash("sha256").update(token).digest("hex"); const sessionId=randomUUID();
  await db.collection("extensionSessions").insertOne({id:sessionId,userId:pair.userId,deviceName:parsed.data.deviceName,tokenHash,createdAt:now,lastSeenAt:now,revokedAt:null});
  return NextResponse.json({sessionId,token,tokenType:"Bearer"});
}
