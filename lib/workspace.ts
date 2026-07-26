import "server-only";
import { randomUUID } from "node:crypto";
import { database } from "@/lib/db";

export interface StoredCheckpoint {
  id: string;
  userId: string;
  companySlug: string;
  stage: string;
  role: string;
  priority: string;
  note: string;
  revision: number;
  snapshotVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function listCheckpoints(userId: string) {
  return (await database()).collection<StoredCheckpoint>("checkpoints").find({ userId }).sort({ updatedAt: -1 }).toArray();
}

export async function createCheckpoint(userId: string, input: Omit<StoredCheckpoint, "id"|"userId"|"revision"|"createdAt"|"updatedAt">) {
  const now = new Date();
  const checkpoint: StoredCheckpoint = { ...input, id: randomUUID(), userId, revision: 1, createdAt: now, updatedAt: now };
  await (await database()).collection<StoredCheckpoint>("checkpoints").insertOne(checkpoint);
  await (await database()).collection("checkpointRevisions").insertOne({ ...checkpoint, checkpointId: checkpoint.id });
  return checkpoint;
}

export async function updateCheckpoint(userId: string, id: string, expectedRevision: number, patch: Partial<Pick<StoredCheckpoint,"stage"|"role"|"priority"|"note"|"snapshotVersion">>) {
  const nextRevision = expectedRevision + 1;
  const result = await (await database()).collection<StoredCheckpoint>("checkpoints").findOneAndUpdate(
    { id, userId, revision: expectedRevision },
    { $set: { ...patch, updatedAt: new Date() }, $setOnInsert: {}, $inc: { revision: 1 } },
    { returnDocument: "after" }
  );
  if (!result) return null;
  await (await database()).collection("checkpointRevisions").insertOne({ ...result, checkpointId: id, revision: nextRevision });
  return result;
}
