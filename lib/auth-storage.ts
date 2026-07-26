import type {
  Db,
  Document,
  FindOneAndDeleteOptions,
  FindOneAndUpdateOptions
} from "mongodb";

import { mongoDb } from "@/lib/db";

const storage = mongoDb.collection("user");
const modelField = "_authModel";

function modelMatch(model: string): Document {
  return model === "user"
    ? { $or: [{ [modelField]: "user" }, { [modelField]: { $exists: false } }] }
    : { [modelField]: model };
}

function scopedFilter(model: string, filter: Document = {}): Document {
  return { $and: [modelMatch(model), filter] };
}

function scopeLookup(stage: Document): Document {
  if (!stage.$lookup) return stage;

  const lookup = { ...stage.$lookup };
  const joinedModel = String(lookup.from);
  const originalPipeline = Array.isArray(lookup.pipeline) ? lookup.pipeline : [];

  return {
    $lookup: {
      ...lookup,
      from: "user",
      pipeline: [{ $match: modelMatch(joinedModel) }, ...originalPipeline]
    }
  };
}

/**
 * Better Auth normally creates one MongoDB collection per model. The current
 * Atlas cluster is at its collection limit, so auth records share the existing
 * `user` collection and are separated by a private model discriminator.
 */
export const authMongoDb = {
  collection(model: string) {
    return {
      insertOne(document: Document, options?: Document) {
        return storage.insertOne({ ...document, [modelField]: model }, options);
      },
      aggregate(pipeline: Document[] = [], options?: Document) {
        return storage.aggregate(
          [{ $match: modelMatch(model) }, ...pipeline.map(scopeLookup)],
          options
        );
      },
      findOneAndUpdate(filter: Document, update: Document, options: FindOneAndUpdateOptions = {}) {
        return storage.findOneAndUpdate(scopedFilter(model, filter), update, options);
      },
      updateMany(filter: Document, update: Document, options?: Document) {
        return storage.updateMany(scopedFilter(model, filter), update, options);
      },
      deleteOne(filter: Document, options?: Document) {
        return storage.deleteOne(scopedFilter(model, filter), options);
      },
      deleteMany(filter: Document, options?: Document) {
        return storage.deleteMany(scopedFilter(model, filter), options);
      },
      findOneAndDelete(filter: Document, options: FindOneAndDeleteOptions = {}) {
        return storage.findOneAndDelete(scopedFilter(model, filter), options);
      }
    };
  }
} as unknown as Db;
