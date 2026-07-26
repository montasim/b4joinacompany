import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { extensionStory } from "@/lib/extension-contract";
import { getCompany, getStories } from "@/lib/research";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("company")?.trim();
  if (!slug || !(await getCompany(slug))) {
    return apiError(404, "COMPANY_NOT_FOUND", "No company matched this identifier.");
  }
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const vibe = request.nextUrl.searchParams.get("vibe") ?? "";
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") ?? 20), 1), 50);
  const stories = (await getStories(slug, query, 50))
    .filter((story) => !vibe || story.vibe === vibe)
    .slice(0, limit);
  return NextResponse.json({
    snapshotVersion: (await getCompany(slug))?.snapshotDate,
    total: stories.length,
    items: stories.map(extensionStory),
  });
}
