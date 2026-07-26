import "server-only";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { database } from "@/lib/db";
import { DATASET_ROOT, datasetFile } from "@/lib/dataset-path";
import type { DatasetUpdateState } from "@/lib/dataset-update-contract";
export type { DatasetUpdateState } from "@/lib/dataset-update-contract";

type MutableState = DatasetUpdateState & { child?: ReturnType<typeof spawn> };
type DatasetDocument = { _id: string; [key: string]: unknown };

const initialState = (): MutableState => ({
  status: "idle",
  runId: null,
  startedAt: null,
  finishedAt: null,
  step: null,
  logs: [],
  error: null,
  syncedToMongo: false
});

const globalDatasetUpdate = globalThis as typeof globalThis & {
  __beforejoinDatasetUpdate?: MutableState;
};

function currentState() {
  globalDatasetUpdate.__beforejoinDatasetUpdate ??= initialState();
  return globalDatasetUpdate.__beforejoinDatasetUpdate;
}

export function datasetUpdateState(): DatasetUpdateState {
  const state = currentState();
  return {
    status: state.status,
    runId: state.runId,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    step: state.step,
    logs: state.logs.slice(-40),
    error: state.error,
    syncedToMongo: state.syncedToMongo
  };
}

export function datasetUpdatesEnabled() {
  return process.env.DATASET_UPDATE_ENABLED !== "false" &&
    (process.env.NODE_ENV !== "production" || process.env.DATASET_UPDATE_ENABLED === "true");
}

function addLog(message: string) {
  const state = currentState();
  state.logs.push(message.trim());
  state.logs = state.logs.filter(Boolean).slice(-80);
}

function readJsonl<T>(fileName: string) {
  return readFile(datasetFile(fileName), "utf8").then((contents) =>
    contents
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T)
  );
}

async function syncDatasetToMongo(runId: string) {
  const [companies, stories, comments, threads, summary] = await Promise.all([
    readJsonl<Record<string, unknown>>("companies.jsonl"),
    readJsonl<Record<string, unknown>>("stories.jsonl"),
    readJsonl<Record<string, unknown>>("comments.jsonl"),
    readJsonl<Record<string, unknown>>("comment_threads.jsonl"),
    readFile(datasetFile("analytics_summary.json"), "utf8").then((value) => JSON.parse(value) as Record<string, unknown>)
  ]);
  const db = await database();

  async function replaceRecords(collectionName: string, records: Record<string, unknown>[], idField: string) {
    if (!records.length) return;
    const collection = db.collection<DatasetDocument>(collectionName);
    await collection.bulkWrite(
      records.map((record) => ({
        replaceOne: {
          filter: { _id: String(record[idField]) },
          replacement: { ...record, _id: String(record[idField]), datasetRecordType: collectionName },
          upsert: true
        }
      })),
      { ordered: false }
    );
  }

  await replaceRecords("dataset_companies", companies, "company_slug");
  await replaceRecords("dataset_stories", stories, "story_id");
  await replaceRecords("dataset_comments", comments, "comment_id");
  await replaceRecords("dataset_comment_threads", threads, "story_id");
  await Promise.all([
    db.collection("dataset_companies").createIndex({ company_slug: 1 }, { unique: true }),
    db.collection("dataset_stories").createIndex({ story_id: 1 }, { unique: true }),
    db.collection("dataset_stories").createIndex({ company_url: 1 }),
    db.collection("dataset_comments").createIndex({ comment_id: 1 }, { unique: true }),
    db.collection("dataset_comments").createIndex({ story_id: 1 }),
    db.collection("dataset_comment_threads").createIndex({ story_id: 1 }, { unique: true })
  ]);
  await db.collection<DatasetDocument>("dataset_sync_runs").insertOne({
    _id: runId,
    status: "success",
    runId,
    completedAt: new Date(),
    counts: {
      companies: companies.length,
      stories: stories.length,
      comments: comments.length,
      commentThreads: threads.length
    },
    summary
  });
}

type PipelineStep = { label: string; script: string; args: string[] };

const pipeline: PipelineStep[] = [
  {
    label: "Discovering new stories and companies",
    script: "scripts/scraper.py",
    args: ["crawl", "--refresh", "--delay", process.env.DATASET_UPDATE_DELAY ?? "1.0", "--workers", process.env.DATASET_UPDATE_WORKERS ?? "3"]
  },
  {
    label: "Refreshing every paginated comment thread",
    script: "scripts/scraper.py",
    args: ["comments", "--refresh", "--delay", process.env.DATASET_UPDATE_DELAY ?? "1.0", "--workers", process.env.DATASET_UPDATE_WORKERS ?? "3"]
  },
  { label: "Enriching records and privacy metadata", script: "scripts/enrich_dataset.py", args: [] },
  { label: "Updating company web-profile records", script: "scripts/enrich_company_web_profiles.py", args: [] },
  { label: "Writing Parquet exports", script: "scripts/export_parquet.py", args: [] },
  { label: "Refreshing release manifest and checksums", script: "scripts/refresh_manifest.py", args: [] },
  { label: "Validating the refreshed dataset", script: "scripts/validate_dataset.py", args: [] }
];

const datasetPython =
  process.env.DATASET_PYTHON ??
  (existsSync(path.join(DATASET_ROOT, ".venv/bin/python"))
    ? path.join(DATASET_ROOT, ".venv/bin/python")
    : "python3");

function runStep(step: PipelineStep) {
  return new Promise<void>((resolve, reject) => {
    const state = currentState();
    state.step = step.label;
    addLog(`→ ${step.label}`);
    const child = spawn(datasetPython, [path.join(DATASET_ROOT, step.script), ...step.args], {
      cwd: DATASET_ROOT,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    state.child = child;
    const consume = (chunk: Buffer) => {
      chunk.toString().split(/\r?\n/).forEach((line) => {
        if (line.trim()) addLog(line);
      });
    };
    child.stdout.on("data", consume);
    child.stderr.on("data", consume);
    child.once("error", reject);
    child.once("close", (code) => {
      state.child = undefined;
      if (code === 0) resolve();
      else reject(new Error(`${step.script} exited with code ${code ?? "unknown"}`));
    });
  });
}

export function startDatasetUpdate() {
  const state = currentState();
  if (state.status === "running") return null;
  const runId = crypto.randomUUID();
  Object.assign(state, {
    status: "running",
    runId,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    step: "Preparing local update",
    logs: [],
    error: null,
    syncedToMongo: false
  });

  void (async () => {
    try {
      for (const step of pipeline) await runStep(step);
      state.step = "Syncing refreshed records into MongoDB";
      addLog("→ Syncing companies, stories, comments, and thread indexes into MongoDB");
      await syncDatasetToMongo(runId);
      Object.assign(state, {
        status: "success",
        step: "Update complete",
        finishedAt: new Date().toISOString(),
        syncedToMongo: true
      });
      addLog("✓ Local dataset and app database are up to date");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Dataset update failed";
      Object.assign(state, {
        status: "error",
        step: "Update stopped",
        finishedAt: new Date().toISOString(),
        error: message
      });
      addLog(`✕ ${message}`);
    }
  })();

  return datasetUpdateState();
}
