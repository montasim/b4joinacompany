import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError } from "@/lib/api";
import { resolveAdminRole, type AdminRole } from "@/lib/admin-session";
import type { Session } from "@/lib/auth";
import { database } from "@/lib/db";
import { sessionFrom } from "@/lib/session";

const decisionSchema = z.object({
  id: z.string().min(1).max(200),
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().min(3).max(300),
  note: z.string().max(1200).optional()
});

type CorrectionRecord = {
  id: string;
  companySlug: string;
  kind: "website" | "linkedin" | "careers" | "identity" | "other";
  suggestedUrl?: string;
  details: string;
  status: string;
  createdAt: Date;
};

export const dynamic = "force-dynamic";

async function adminFrom(
  request: Request
): Promise<
  | { ok: false; error: "signed-out" | "forbidden" }
  | { ok: true; session: Session; role: AdminRole }
> {
  const session = await sessionFrom(request);
  if (!session) return { ok: false, error: "signed-out" };
  const role = resolveAdminRole(session);
  if (!role) return { ok: false, error: "forbidden" };
  return { ok: true, session, role };
}

function adminError(error: "signed-out" | "forbidden") {
  if (error === "forbidden") {
    return apiError(
      403,
      "ADMIN_ACCESS_DENIED",
      "This account does not have evidence-review access."
    );
  }
  return apiError(
    401,
    "ADMIN_AUTH_REQUIRED",
    "An authorized reviewer session is required."
  );
}

export async function GET(request: Request) {
  const admin = await adminFrom(request);
  if (!admin.ok) {
    return adminError(admin.error);
  }

  try {
    const corrections = await (await database())
      .collection<CorrectionRecord>("corrections")
      .find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(
      {
        source: "correction_submissions",
        items: corrections.map((correction) => ({
          id: correction.id,
          companySlug: correction.companySlug,
          kind: correction.kind,
          suggestedUrl: correction.suggestedUrl ?? null,
          details: correction.details,
          status: correction.status,
          createdAt: correction.createdAt.toISOString()
        }))
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return apiError(
      503,
      "REVIEW_QUEUE_UNAVAILABLE",
      "The protected review queue is temporarily unavailable."
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await adminFrom(request);
  if (!admin.ok) {
    return adminError(admin.error);
  }

  const parsed = decisionSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsed.success) {
    return apiError(
      400,
      "INVALID_REVIEW_DECISION",
      "Choose a decision reason and provide a valid review item."
    );
  }

  const { id, decision, reason, note } = parsed.data;
  const status =
    decision === "approved" ? "approved_for_revision" : "rejected";

  try {
    const result = await (await database())
      .collection<CorrectionRecord>("corrections")
      .findOneAndUpdate(
        { id, status: "open" },
        {
          $set: {
            status,
            decisionReason: reason,
            reviewerNote: note?.trim() || null,
            reviewerRole: admin.role,
            reviewedAt: new Date()
          }
        },
        { returnDocument: "after" }
      );

    if (!result) {
      return apiError(
        409,
        "REVIEW_ITEM_CHANGED",
        "This item is no longer waiting for review. Refresh the queue."
      );
    }

    return NextResponse.json({
      id,
      status,
      message:
        decision === "approved"
          ? "Approved for the next revision."
          : "Change rejected."
    });
  } catch {
    return apiError(
      503,
      "REVIEW_DECISION_UNAVAILABLE",
      "The decision could not be recorded. The published snapshot was not changed."
    );
  }
}
