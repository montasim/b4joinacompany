import { NextResponse } from "next/server";

import { datasetStats } from "@/lib/research";

export async function GET() {
  const stats = await datasetStats();
  return NextResponse.json({
    ok: true,
    service: "b4join-extension-api",
    snapshotVersion: stats.snapshotDate,
    snapshotDate: stats.snapshotDate,
    companies: stats.companies,
    stories: stats.stories,
  });
}
