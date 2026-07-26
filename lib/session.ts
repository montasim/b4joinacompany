import "server-only";
import { createHash } from "node:crypto";
import { auth } from "@/lib/auth";
import { database } from "@/lib/db";

export async function sessionFrom(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function workspaceActor(request:Request) {
  const session=await sessionFrom(request);
  if(session)return {userId:session.user.id,kind:"web" as const};
  const authorization=request.headers.get("authorization");
  if(!authorization?.startsWith("Bearer "))return null;
  const tokenHash=createHash("sha256").update(authorization.slice(7)).digest("hex");
  const record=await (await database()).collection("extensionSessions").findOneAndUpdate(
    {tokenHash,revokedAt:null},{$set:{lastSeenAt:new Date()}},{returnDocument:"after"}
  );
  return record?{userId:String(record.userId),kind:"extension" as const,sessionId:String(record.id)}:null;
}
