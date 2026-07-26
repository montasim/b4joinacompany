import { Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "beforejoin";

const globalMongo = globalThis as typeof globalThis & {
  __beforejoinMongo?: MongoClient;
};

export const mongoClient =
  globalMongo.__beforejoinMongo ??
  new MongoClient(uri, {
    serverApi: uri.startsWith("mongodb+srv")
      ? { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
      : undefined,
    connectTimeoutMS: 3000,
    serverSelectionTimeoutMS: 3000
  });

if (process.env.NODE_ENV !== "production") globalMongo.__beforejoinMongo = mongoClient;

export const mongoDb: Db = mongoClient.db(dbName);

export async function database() {
  await mongoClient.connect();
  return mongoDb;
}
