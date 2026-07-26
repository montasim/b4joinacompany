import { NextResponse } from "next/server";
import type { ApiError } from "@/lib/contracts";
export function apiError(status:number,code:string,message:string){
  return NextResponse.json<ApiError>({error:{code,message,requestId:crypto.randomUUID()}},{status});
}
