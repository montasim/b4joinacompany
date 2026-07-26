import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongodb"],
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  outputFileTracingIncludes: {
    "/*": [
      "../github-dataset-release/data/companies.jsonl",
      "../github-dataset-release/data/company_web_profiles.jsonl",
      "../github-dataset-release/data/stories.jsonl",
      "../github-dataset-release/data/comments.jsonl",
      "../github-dataset-release/data/comment_threads.jsonl",
      "../github-dataset-release/data/company_work_arrangements.jsonl",
      "../github-dataset-release/data/analytics_summary.json"
    ]
  },
  experimental: {
    typedEnv: true
  }
};

export default nextConfig;
