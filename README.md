# b4join

Production implementation of the approved V4 prototype. b4join turns workplace reports and official company destinations into candidate questions that remain traceable to dated evidence.

Company checkpoints are personalized locally: a deterministic signal engine ranks management, pay, stability, growth, workload, culture, workplace, and hiring questions from that company’s stories and attached comments. It does not call an AI provider or send report text outside the app.

The static prototype is preserved in `../beforejoin-prototype-v4`. This directory is the Next.js application.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS with reusable shadcn-compatible primitives
- Better Auth with Google sign-in
- MongoDB for authentication and private saved workspaces
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

Google is the only sign-in method and every signed-in account opens its own
private Saved workspace. The browser extension remains independently usable
without a b4join account.

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
- The source dataset at `../github-dataset-release/data` is maintained manually
  with the dataset repository's command-line scripts. The app never starts a
  scrape or changes the dataset through its web interface.

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
| POST | `/api/v1/corrections` | Submit a correction for manual follow-up |

All API failures use `{ "error": { "code", "message", "requestId" } }`.

## Validation

```bash
pnpm check
```

## Manual dataset updates

Dataset maintenance stays outside the web app. Run collectors only when a new
source capture is intended, then rebuild and validate the versioned release:

```bash
cd ../github-dataset-release

# Optional: capture newly published stories and paginated comments.
python3 scripts/scraper.py crawl --refresh --delay 1.0 --workers 3
python3 scripts/scraper.py comments --refresh --delay 1.0 --workers 3

# Refresh derived work-setup and company-destination records.
python3 scripts/extract_work_arrangements.py
python3 scripts/enrich_company_web_profiles.py

# Rebuild release artifacts, exports, checksums, and validation.
python3 scripts/prepare_release.py

# Bundle the validated release for deployment, then verify the app.
cd ../b4join
rsync -a ../github-dataset-release/data/ ./data/
pnpm check
```

During local development, b4join reads the sibling
`../github-dataset-release/data` directory when it exists. Deployed builds read
the bundled `./data` copy. Dataset changes are never written to MongoDB by the
app.
