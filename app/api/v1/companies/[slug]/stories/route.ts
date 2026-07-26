import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCompany, getStories } from "@/lib/research";
export async function GET(request:NextRequest,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(!await getCompany(slug))return apiError(404,"COMPANY_NOT_FOUND","No company matched this identifier.");
  const query=request.nextUrl.searchParams.get("q")??"";
  const items=(await getStories(slug,query,30)).map((story)=>({
    id:story.id,companySlug:story.companySlug,title:story.title,excerpt:story.excerpt,role:story.role,
    date:story.date,dateLabel:story.dateLabel,vibe:story.vibe,reactions:story.reactions,comments:story.comments,sourceUrl:story.sourceUrl
  }));
  return NextResponse.json({items,query});
}
