import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { extensionCompany } from "@/lib/extension-contract";
import {
  getCompany,
  getCompanyQuestions,
  getCompanyWorkArrangement,
} from "@/lib/research";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim();
  if (!slug) return apiError(400, "INVALID_COMPANY", "A company slug is required.");
  const company = await getCompany(slug);
  if (!company) return apiError(404, "COMPANY_NOT_FOUND", "No company matched this identifier.");
  const [questions, workArrangement] = await Promise.all([
    getCompanyQuestions(company.slug, company.name),
    getCompanyWorkArrangement(company.slug),
  ]);
  return NextResponse.json(extensionCompany(company, questions, workArrangement));
}
