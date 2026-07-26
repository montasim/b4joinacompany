import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { authMongoDb } from "@/lib/auth-storage";

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const authSecret = process.env.BETTER_AUTH_SECRET;
const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();

if (process.env.NODE_ENV === "production") {
  const missing = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NEXT_PUBLIC_APP_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OWNER_EMAIL"
  ].filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(
      `Missing required production authentication settings: ${missing.join(", ")}`
    );
  }
}

export const auth = betterAuth({
  appName: "b4join",
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",
  secret: authSecret ?? "development-only-secret-change-before-production",
  database: mongodbAdapter(authMongoDb),
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ],
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
      }
    : undefined,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: ownerEmail && user.email.toLowerCase() === ownerEmail
              ? "owner"
              : "user"
          }
        })
      }
    }
  }
});

export type Session = typeof auth.$Infer.Session;
