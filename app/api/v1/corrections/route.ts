import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { apiError } from "@/lib/api";
import { database } from "@/lib/db";
const schema=z.object({companySlug:z.string().min(2),kind:z.enum(["website","linkedin","careers","identity","other"]),suggestedUrl:z.url().optional(),details:z.string().min(10).max(3000),email:z.email().optional()});
export async function POST(request:Request){
  const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return apiError(400,"INVALID_REQUEST","Provide the company, correction type, and supporting detail.");
  const record={id:randomUUID(),...parsed.data,status:"open",createdAt:new Date()};
  await (await database()).collection("corrections").insertOne(record);
  return NextResponse.json({id:record.id,status:record.status},{status:202});
}
