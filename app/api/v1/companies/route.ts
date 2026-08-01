import { NextRequest, NextResponse } from "next/server";
import type { EvidenceCoverageFilter } from "@/lib/contracts";
import { searchCompanyDirectory } from "@/lib/research";

const coverageFilters = new Set<EvidenceCoverageFilter>([
  "all",
  "deshimula",
  "both",
  "deshimula_only",
  "betonkemon_only",
  "review",
]);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const requestedCoverage = request.nextUrl.searchParams.get("coverage") ?? "all";
  const coverage = coverageFilters.has(requestedCoverage as EvidenceCoverageFilter)
    ? (requestedCoverage as EvidenceCoverageFilter)
    : "all";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 12);
  const limit = Math.max(
    1,
    Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 12, 25),
  );
  return NextResponse.json({
    items: await searchCompanyDirectory(query, limit, coverage),
    query,
    coverage,
  });
}
