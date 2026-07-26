import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { database } from "@/lib/db";
import { sessionFrom } from "@/lib/session";
export async function POST(request:Request){
  const session=await sessionFrom(request); if(!session)return apiError(401,"AUTH_REQUIRED","Sign in before pairing an extension.");
  const code=randomBytes(18).toString("base64url"); const codeHash=createHash("sha256").update(code).digest("hex");
  await (await database()).collection("pairingCodes").insertOne({codeHash,userId:session.user.id,expiresAt:new Date(Date.now()+10*60_000),usedAt:null,createdAt:new Date()});
  return NextResponse.json({code,expiresInSeconds:600});
}
