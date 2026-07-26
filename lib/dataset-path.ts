import path from "node:path";

/** The release folder is the local source of truth for the app's offline dataset. */
export const DATASET_ROOT = path.resolve(process.cwd(), "../github-dataset-release");
export const DATASET_DATA = path.join(DATASET_ROOT, "data");
export const DATASET_SCRIPTS = path.join(DATASET_ROOT, "scripts");

export function datasetFile(fileName: string) {
  return path.join(DATASET_DATA, fileName);
}
