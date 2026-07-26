import path from "node:path";
import { existsSync } from "node:fs";

/** Prefer the sibling release during local development; fall back to bundled data on deploy. */
const siblingRoot = path.resolve(process.cwd(), "../github-dataset-release");
const bundledRoot = path.resolve(process.cwd());
export const DATASET_ROOT = process.env.DATASET_ROOT
  ? path.resolve(process.env.DATASET_ROOT)
  : existsSync(path.join(siblingRoot, "scripts"))
    ? siblingRoot
    : bundledRoot;
export const DATASET_DATA = path.join(DATASET_ROOT, "data");
export const DATASET_SCRIPTS = path.join(DATASET_ROOT, "scripts");

export function datasetFile(fileName: string) {
  return path.join(DATASET_DATA, fileName);
}
