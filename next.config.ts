import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongodb"],
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  outputFileTracingIncludes: {
    "/*": [
      "data/companies.jsonl",
      "data/company_web_profiles.jsonl",
      "data/stories.jsonl",
      "data/comments.jsonl",
      "data/comment_threads.jsonl",
      "data/company_work_arrangements.jsonl",
      "data/analytics_summary.json"
    ]
  },
  experimental: {
    typedEnv: true
  }
};

export default nextConfig;
