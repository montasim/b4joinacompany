import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCompany, getCompanyWorkArrangement } from "@/lib/research";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const company=await getCompany(slug);
  if (!company) return apiError(404,"COMPANY_NOT_FOUND","No company matched this identifier.");
  const workArrangement = await getCompanyWorkArrangement(company.slug);
  return NextResponse.json({ ...company, workArrangement });
}
