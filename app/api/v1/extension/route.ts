import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "b4joinacompany-extension-api",
    health: "/api/v1/extension/health",
    message: "Use the health endpoint to check the local research API."
  });
}
