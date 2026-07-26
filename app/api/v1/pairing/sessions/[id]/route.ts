import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { database } from "@/lib/db";
import { sessionFrom } from "@/lib/session";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await sessionFrom(request); if(!session)return apiError(401,"AUTH_REQUIRED","Sign in to revoke an extension session.");
  const {id}=await params;
  const result=await (await database()).collection("extensionSessions").updateOne({id,userId:session.user.id,revokedAt:null},{$set:{revokedAt:new Date()}});
  return result.matchedCount?NextResponse.json({revoked:true}):apiError(404,"SESSION_NOT_FOUND","No active extension session matched this identifier.");
}
