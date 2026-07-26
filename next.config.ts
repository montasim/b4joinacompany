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
  },
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/saved",
        permanent: true
      },
      {
        source: "/states",
        destination: "/method",
        permanent: true
      },
      {
        source: "/connect-extension",
        destination: "/extension",
        permanent: true
      },
      {
        source: "/auth/sign-up",
        destination: "/auth/sign-in",
        permanent: true
      },
      {
        source: "/auth/recover",
        destination: "/auth/sign-in",
        permanent: true
      },
      {
        source: "/auth/reset-password",
        destination: "/auth/sign-in",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
