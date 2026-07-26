import { NextRequest, NextResponse } from "next/server";
import { searchCompanies } from "@/lib/research";
export async function GET(request:NextRequest){
  const query=request.nextUrl.searchParams.get("q")??"";
  const limit=Math.min(Number(request.nextUrl.searchParams.get("limit")??12),25);
  return NextResponse.json({items:await searchCompanies(query,limit),query});
}
