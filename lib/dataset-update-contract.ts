export type DatasetUpdateStatus = "idle" | "running" | "success" | "error";

export interface DatasetUpdateState {
  status: DatasetUpdateStatus;
  runId: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  step: string | null;
  logs: string[];
  error: string | null;
  syncedToMongo: boolean;
}
