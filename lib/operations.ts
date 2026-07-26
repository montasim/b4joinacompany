import "server-only";
import { createHash } from "node:crypto";
import { database } from "@/lib/db";

const operationalAuthModel = "beforejoin:operation";
const operationModelField = "_opsModel";

const hash = (value:string) => createHash("sha256").update(`${process.env.BETTER_AUTH_SECRET ?? "dev"}:${value}`).digest("hex");
export function requestActor(request:Request) {
  const installation=request.headers.get("x-beforejoin-installation");
  const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return hash(installation || forwarded || "local-anonymous");
}

async function incrementCounter(id:string,limit:number,expiresAt:Date){
  const collection=(await database()).collection<{
    _id:string;
    _authModel:string;
    _opsModel:string;
    count:number;
    expiresAt:Date;
  }>("user");
  try {
    const result=await collection.findOneAndUpdate(
      {
        _id:`beforejoin:quota:${id}`,
        _authModel:operationalAuthModel,
        [operationModelField]:"generationQuota",
        $or:[{count:{$lt:limit}},{count:{$exists:false}}]
      },
      {
        $inc:{count:1},
        $setOnInsert:{
          _authModel:operationalAuthModel,
          [operationModelField]:"generationQuota",
          expiresAt
        }
      },
      {upsert:true,returnDocument:"after"}
    );
    return result?.count??null;
  } catch (error) {
    if(error instanceof Error && "code" in error && (error as Error & {code:number}).code===11000)return null;
    throw error;
  }
}

export async function consumeGeneration(actorHash:string) {
  if(!process.env.MONGODB_URI)return {allowed:true,daily:0,monthly:0};
  const now=new Date(), day=now.toISOString().slice(0,10), month=day.slice(0,7);
  const dailyLimit=Number(process.env.AI_DAILY_LIMIT??5), monthlyLimit=Number(process.env.AI_MONTHLY_LIMIT??50);
  const daily=await incrementCounter(`${actorHash}:d:${day}`,dailyLimit,new Date(now.getTime()+40*86400000));
  if(daily===null)return {allowed:false,daily:dailyLimit,monthly:0,scope:"daily" as const};
  const monthly=await incrementCounter(`${actorHash}:m:${month}`,monthlyLimit,new Date(now.getTime()+400*86400000));
  if(monthly===null)return {allowed:false,daily,monthly:monthlyLimit,scope:"monthly" as const};
  return {allowed:true,daily,monthly};
}

export async function logGeneration(input:{actorHash:string;requestId:string;provider:string;model:string;latencyMs:number;gap:boolean}) {
  if(!process.env.MONGODB_URI)return;
  try {
    const db=await database();
    await db.collection("user").insertOne({
      _authModel:operationalAuthModel,
      [operationModelField]:"generationLog",
      ...input,
      createdAt:new Date(),
      expiresAt:new Date(Date.now()+30*86400000)
    });
  } catch {
    // The answer remains usable even if best-effort operational logging fails.
  }
}
