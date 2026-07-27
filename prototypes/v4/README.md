# b4join V4 prototype

V4 is a simplified product direction for b4join. It preserves V3 unchanged and
reduces the public product to one primary journey:

```text
Search for a company
  → see an evidence-backed B4Join Brief
  → understand culture, work setup and salary context
  → leave with questions to verify
```

## Pages

- `index.html` — research home and company search
- `company.html` — the complete B4Join Brief
- `compare.html` — two-company evidence comparison
- `saved.html` — Google-gated private decision ledger with signed-out,
  populated example, and empty workspace states
- `extension.html` — independent browser extension with an interactive
  four-view product preview and manual GitHub installation path
- `auth.html` — Google-only authentication with tailored save/admin handoffs
  and explicit links to both static post-sign-in prototype states
- `admin.html` — Google-gated evidence review desk with a working example queue,
  source comparison, required decision basis, and local-only decision states
- `method.html` — an interactive provenance thread showing how reported,
  submitted, derived, and destination evidence travels from origin to limit
- `support.html` — public correction desk with evidence-method, technical-help,
  and independent-project support routes

## Design decisions

- One home for every fact; sources are not repeated across cards.
- The homepage starts with one company search and explains the four outcomes
  at a glance: culture, salary, work setup and questions to verify.
- Comparison uses the same role and evidence boundaries for both companies,
  never declares a winner, and keeps unavailable evidence visible.
- Company visuals keep stored third-party topic frequencies, exact
  author-selected story labels, submitted salary amounts, and unverified
  work-mode evidence separate—without producing a company score.
- Culture, work setup, salary, questions and sources use explicit evidence
  boundaries.
- Salary evidence is labeled as submitted, keeps an unknown pay period visible,
  and is never presented as company-verified.
- Work setup is a derived interpretation and begins collapsed.
- Salary begins expanded because compensation is a primary research need.
- Google sign-in is used only for private website features. The extension
  remains independent.
- Verified personal accounts enter the private Saved workspace. The configured
  admin account enters the restricted evidence review desk; visitors never
  choose their own role.
- The static sign-in action shows an explicit prototype handoff instead of
  claiming that Google authentication completed.
- The static role previews use session storage only to keep the signed-in
  header coherent across prototype pages. They are not an authorization model.
- The signed-out Saved page exposes no company or visitor data. Its populated
  preview uses clearly labeled generic prototype records and expands one
  checkpoint at a time.
- Support uses a source-backed correction note instead of a generic contact
  form. The static prototype prepares a structured email and never claims a
  correction was uploaded or queued.
- Method keeps the deterministic checkpoint engine distinct from optional Ask,
  distinguishes integrity validation from truth verification, and gives each
  evidence lane its own origin, transformation, use, and limitation.
- The extension page mirrors the released Brief, Stories, Jobs & salary, and
  Ask workflow, without exposing setup controls or implying a Web Store
  installation.

Open `index.html` directly or serve the directory with any static web server.
