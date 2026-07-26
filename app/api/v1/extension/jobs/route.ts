import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { getCompany } from "@/lib/research";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("company")?.trim();
  const company = slug ? await getCompany(slug) : null;
  if (!company) return apiError(404, "COMPANY_NOT_FOUND", "No company matched this identifier.");

  return NextResponse.json({
    snapshotVersion: company.snapshotDate,
    checkedAt: company.snapshotDate,
    jobs: company.careersUrl
      ? [
          {
            id: `${company.slug}-careers`,
            title: "Open careers destination",
            detail: "Check the official careers page for roles available now.",
            source: "Official careers page",
            sourceUrl: company.careersUrl,
            observedAt: company.snapshotDate,
            status: "unknown",
            salaryDisclosure: null,
          },
        ]
      : [],
    salary: {
      status: "unavailable",
      label: "No sourced salary disclosure",
      summary: "No numerical salary evidence is published in the current dataset snapshot.",
      source: null,
      observedAt: null,
    },
    careerUrl: company.careersUrl,
  });
}
