import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { getCompany, getCompanySalaryEvidence } from "@/lib/research";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("company")?.trim();
  const company = slug ? await getCompany(slug) : null;
  if (!company) return apiError(404, "COMPANY_NOT_FOUND", "No company matched this identifier.");
  const salaryEvidence = await getCompanySalaryEvidence(company.slug);
  const salarySource = salaryEvidence[0] ?? null;
  const salaryContributors = salaryEvidence.reduce(
    (total, record) => total + (record.sampleSize ?? 0),
    0
  );

  return NextResponse.json({
    snapshotVersion: company.snapshotDate,
    checkedAt: salarySource?.capturedAt ?? company.snapshotDate,
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
      status: salaryEvidence.length > 0 ? "unverified" : "unavailable",
      label:
        salaryEvidence.length > 0
          ? "Community-reported role ranges"
          : "No sourced salary evidence",
      summary:
        salaryEvidence.length > 0
          ? `${salaryEvidence.length} role ranges${salaryContributors > 0 ? ` from ${salaryContributors.toLocaleString()} submitted records` : ""}. Pay period is not specified by the source.`
          : "No numerical salary evidence is published in the current dataset snapshot.",
      source: salarySource ? "Beton Kemon" : null,
      sourceUrl: salarySource?.sourceUrl ?? null,
      observedAt: salarySource?.capturedAt ?? null,
      verificationStatus: salarySource?.verificationStatus ?? null,
      disclaimer:
        salarySource?.disclaimer ??
        "No numerical salary evidence is available for this company.",
      roles: salaryEvidence.map((record) => ({
        id: record.id,
        role: record.role,
        minimumBdt: record.salaryRange.minimumBdt,
        maximumBdt: record.salaryRange.maximumBdt,
        currency: record.salaryRange.currency,
        payPeriod: record.salaryRange.payPeriod,
        sampleSize: record.sampleSize,
        bonus: record.bonus,
        sourceUrl: record.sourceUrl,
        verificationStatus: record.verificationStatus,
      })),
    },
    careerUrl: company.careersUrl,
  });
}
