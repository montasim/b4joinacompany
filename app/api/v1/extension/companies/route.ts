import { NextRequest, NextResponse } from "next/server";

import { extensionCompany } from "@/lib/extension-contract";
import { getCompany } from "@/lib/research";

export async function GET(request: NextRequest) {
  const slugs = (request.nextUrl.searchParams.get("slugs") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, 40);
  const records = await Promise.all(slugs.map((slug) => getCompany(slug)));
  return NextResponse.json({
    items: records.filter((company) => company !== null).map((company) => extensionCompany(company)),
  });
}
