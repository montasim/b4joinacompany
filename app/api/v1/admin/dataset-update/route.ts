import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAdminContext } from "@/lib/admin-session";
import { datasetUpdateState, datasetUpdatesEnabled, startDatasetUpdate } from "@/lib/dataset-update";

export async function GET() {
  const admin = await getAdminContext();
  if (!admin) return apiError(401, "ADMIN_AUTH_REQUIRED", "Sign in with the configured admin Google account.");
  if (!datasetUpdatesEnabled()) return apiError(403, "LOCAL_UPDATE_DISABLED", "Dataset updates are disabled outside the local app.");
  return NextResponse.json(datasetUpdateState());
}

export async function POST() {
  const admin = await getAdminContext();
  if (!admin) return apiError(401, "ADMIN_AUTH_REQUIRED", "Sign in with the configured admin Google account.");
  if (!datasetUpdatesEnabled()) return apiError(403, "LOCAL_UPDATE_DISABLED", "Dataset updates are disabled outside the local app.");
  const state = startDatasetUpdate();
  if (!state) return apiError(409, "UPDATE_ALREADY_RUNNING", "A dataset update is already running.");
  return NextResponse.json(state, { status: 202 });
}
