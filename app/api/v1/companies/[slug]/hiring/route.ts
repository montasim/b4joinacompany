import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCompany } from "@/lib/research";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const company=await getCompany(slug);
  if(!company)return apiError(404,"COMPANY_NOT_FOUND","No company matched this identifier.");
  return NextResponse.json({companySlug:slug,checkedAt:company.snapshotDate,items:company.careersUrl?[{id:`${slug}-careers`,title:"Open careers destination",location:null,employmentType:null,url:company.careersUrl,state:"stale",observedAt:company.snapshotDate,disclaimer:"This is a dated hiring signal, not a confirmed open role."}]:[]});
}
