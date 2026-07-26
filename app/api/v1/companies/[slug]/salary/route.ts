import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import {
  getCompany,
  getCompanySalaryEvidence,
} from "@/lib/research";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) {
    return apiError(
      404,
      "COMPANY_NOT_FOUND",
      "No company matched this identifier.",
    );
  }

  const records = await getCompanySalaryEvidence(company.slug);
  return NextResponse.json({
    company: {
      slug: company.slug,
      name: company.name,
    },
    status: records.length > 0 ? "unverified" : "unavailable",
    verificationStatus: records[0]?.verificationStatus ?? null,
    disclaimer:
      records[0]?.disclaimer ??
      "No community-reported role salary evidence is available for this company.",
    payPeriod: "unspecified",
    observedAt: records[0]?.capturedAt ?? null,
    source: records[0]
      ? {
          name: "Beton Kemon",
          url: records[0].sourceUrl,
        }
      : null,
    roles: records.map((record) => ({
      id: record.id,
      role: record.role,
      range: record.salaryRange,
      sampleSize: record.sampleSize,
      bonus: record.bonus,
    })),
  });
}
