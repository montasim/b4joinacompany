# b4join

Production implementation of the approved V4 prototype. b4join turns workplace reports and official company destinations into candidate questions that remain traceable to dated evidence.

Company checkpoints are personalized locally: a deterministic signal engine ranks management, pay, stability, growth, workload, culture, workplace, and hiring questions from that company’s stories and attached comments. It does not call an AI provider or send report text outside the app.

The static prototype is preserved in `../beforejoin-prototype-v4`. This directory is the Next.js application.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS with reusable shadcn-compatible primitives
- Better Auth with Google sign-in
- MongoDB for auth/workspace/synced records, with the versioned release files as the local dataset source
- Gemini → Groq → deterministic AI adapter chain
- Netlify deployment configuration
- Locally processed Deshi Mula dataset, served through versioned APIs

## Local setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Set `MONGODB_URI`, a 32+ character `BETTER_AUTH_SECRET`, and at least `GEMINI_API_KEY` for generated answers. If no AI key is set, Ask returns the cited deterministic fallback. Groq is optional.

Google is the only sign-in method. Set `OWNER_EMAIL` to the Google account that should open the admin review desk; all other accounts open the private Saved workspace. The browser extension remains independently usable without a b4join account.

## Important boundaries

- Public API story results include short excerpts and original links, never the private raw body.
- Workplace reports remain attributed experiences, not verified facts.
- Reported work arrangement and schedule fields are deterministic derivatives of
  unverified stories/comments. They are never presented as company policy, and
  `unknown` never defaults to onsite.
- Community salary ranges remain `unverified_user_submitted`, retain source and
  sample-size context, and use an unspecified pay period rather than an inferred
  monthly/annual label.
- An absent salary range or hiring result is shown as an evidence gap, not a negative signal.
- Saved checkpoints are immutable revisions. Refreshing creates a new revision.
- AI-provider prompts and answers are not stored in operational logs. Logs contain metadata only and expire after 30 days.
- The source dataset at `../github-dataset-release/data` is the local release source. The admin update control refreshes it only after an authenticated local admin action.

## Research API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Dataset and provider readiness |
| GET | `/api/v1/companies?q=...` | Alias, name, website, and LinkedIn search |
| GET | `/api/v1/companies/:slug` | Company identity, destinations, and unverified derived work-arrangement evidence |
| GET | `/api/v1/companies/:slug/stories?q=...` | Public evidence excerpts |
| GET | `/api/v1/companies/:slug/hiring` | Dated hiring signals |
| GET | `/api/v1/companies/:slug/salary` | Unverified source-attributed role salary ranges |
| GET | `/api/v1/extension/company?slug=...` | Extension-ready company brief, questions, and unverified reported work setup |
| GET | `/api/v1/extension/jobs?company=...` | Extension-ready careers destination and unverified role salary evidence |
| POST | `/api/v1/ask` | Provider-neutral cited answer |
| GET/POST | `/api/v1/workspace/checkpoints` | Authenticated private checkpoints |
| PATCH | `/api/v1/workspace/checkpoints/:id` | Optimistic revision update |
| POST | `/api/v1/corrections` | Create a review task |
| GET/PATCH | `/api/v1/admin/review-queue` | Owner/operator-only correction review docket |
| GET/POST | `/api/v1/admin/dataset-update` | Owner/operator-only local dataset update status and start control |

All API failures use `{ "error": { "code", "message", "requestId" } }`.

## Validation

```bash
pnpm check
```

The build traces the local dataset files and update scripts into the server output. For local updates, configure Google OAuth and the owner email, then open `/admin` and use “Update records.” The pipeline runs the crawler, paginated comment refresh, enrichment, Parquet export, manifest refresh, validation, and MongoDB upsert in sequence.

Useful local update variables:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OWNER_EMAIL=you@example.com
DATASET_UPDATE_ENABLED=true
DATASET_PYTHON=python3
DATASET_UPDATE_DELAY=1.0
DATASET_UPDATE_WORKERS=3
```
