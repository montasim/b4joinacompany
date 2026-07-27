# BeforeJoin Research

This context defines the language for a website and browser extension that turn company evidence into questions a person can verify before joining and keep the resulting private research synchronized.

## Language

**Company Identity**:
The canonical company record that connects aliases, workplace evidence, and verified official destinations.
_Avoid_: Company name, employer result

**Company Match**:
A search candidate that identifies one Company Identity using its canonical name, aliases, domain, LinkedIn slug, location, and match explanation.
_Avoid_: Search result, fuzzy company

**Story**:
A workplace experience associated with a Company Identity when resolvable.
_Avoid_: Review, workplace report, post

**Research Source**:
A traceable origin supporting a Story, Official Destination, Hiring Signal, Salary Evidence, or Decision Checkpoint.
_Avoid_: Reference, proof

**Evidence Excerpt**:
A short, relevant passage from a Story displayed with its metadata and a link to the original Deshi Mula page; it is not a republication of the complete Story.
_Avoid_: Story copy, full text, AI summary

**Evidence Bundle**:
The deterministic set of Research Sources selected for one Company Identity, role, decision stage, and research priority.
_Avoid_: Prompt context, AI input, search results

**Evidence Gap**:
An explicit absence or insufficiency of Research Sources needed to support a requested claim or answer.
_Avoid_: Negative signal, zero score, unknown company quality

**Evidence Question**:
One focused, company-scoped question submitted by a User Account for an evidence-grounded answer.
_Avoid_: Chat message, prompt, search query

**Generated Answer**:
An AI-produced response to an Evidence Question, grounded in an Evidence Bundle and returned with citations or an explicit Evidence Gap.
_Avoid_: Chat response, verified answer, opinion

**Generation Quota**:
The adjustable allowance governing how many contextual AI generations a User Account or Installation Token may request within a time window.
_Avoid_: Credit, token balance, subscription

**Decision Checkpoint**:
An evidence-backed set of up to three supported questions a person can verify while applying, interviewing, or reviewing an offer, with any unsupported slot represented as an Evidence Gap.
_Avoid_: Company score, verdict, saved brief

**Checkpoint Revision**:
An immutable Decision Checkpoint result whose questions, evidence, and citations are tied to exactly one Published Snapshot.
_Avoid_: Version, latest checkpoint

**Checkpoint Refresh**:
A user-authorized creation of a new Checkpoint Revision from a newer Published Snapshot, preserving applicable private answers and notes.
_Avoid_: Automatic update, background sync

**Evidence Update Notice**:
An in-app or optional email notification that newer relevant evidence exists for a saved Decision Checkpoint without changing its current Checkpoint Revision.
_Avoid_: Refresh, automatic update, alert

**Checkpoint Export**:
A user-created PDF or Markdown copy of selected Decision Checkpoint questions, evidence summaries, citations, and optionally answers, labeled with its Published Snapshot and export date.
_Avoid_: Public share, live checkpoint, backup

**Research Workspace**:
The private, user-owned collection of saved Company Identities, Decision Checkpoints, answers, notes, comparisons, and research history.
_Avoid_: Dashboard, saved page, personal database

**Workspace Data**:
The deletable private content and interaction history owned by a User Account within its Research Workspace.
_Avoid_: Dataset, public evidence, analytics

**Workspace Revision**:
A server-issued version identifier that a Website or Extension mutation must present so concurrent Workspace Data changes can be merged or rejected safely.
_Avoid_: Timestamp, client version, last write

**Workspace Conflict**:
An explicit response produced when two clients change the same Workspace Data field from the same Workspace Revision and user review is required.
_Avoid_: Sync failure, silent overwrite, latest wins

**Pending Mutation**:
An idempotent Workspace Data change queued by the Extension while offline and replayed against its expected Workspace Revision after connectivity returns.
_Avoid_: Local save, retry, cached request

**Deletion Marker**:
A retained synchronization record proving that Workspace Data was deleted so a stale Pending Mutation cannot recreate it.
_Avoid_: Soft-deleted content, archived item, hidden record

**Operational Record**:
A metadata-only record of a request's identity, provider, model, timing, usage, outcome, and citation count that contains no raw Workspace Data or Evidence Bundle.
_Avoid_: Request dump, prompt log, conversation log

**Published Snapshot**:
An immutable, locally validated release of curated research records activated atomically for Research API reads.
_Avoid_: Dataset dump, cache version

**Official Destination**:
A verified company-controlled website, LinkedIn profile, or careers page.
_Avoid_: Company link, social link

**Hiring Signal**:
A sourced indication that a company is recruiting, carrying an observation date and a recent, stale, or closed availability state.
_Avoid_: Job guess, opening

**Salary Evidence**:
A sourced compensation disclosure or explicit absence of a numerical range.
_Avoid_: Salary estimate, salary fact

**Correction Report**:
A notice that a Company Identity, Official Destination, or Research Source association may be incorrect and requires curator verification.
_Avoid_: Story submission, direct edit, complaint

**Enrichment Candidate**:
A web-discovered company alias, Official Destination, Hiring Signal, or Salary Evidence item awaiting curator verification and publication.
_Avoid_: Live evidence, verified result, checkpoint source

**Research API**:
The shared interface through which the Website and Extension access published company evidence, generated Decision Checkpoints, and an authenticated User Account's Research Workspace.
_Avoid_: Website API, extension API

**Website**:
The BeforeJoin decision workspace for turning evidence into questions, comparing opportunities, recording answers, and revisiting a decision over time.
_Avoid_: Deshi Mula replacement, extension on the web, review dashboard

**Extension**:
The Deshi Mula in-context research overlay for quickly decoding the active Company Identity and inspecting company metrics, Stories, Hiring Signals, Salary Evidence, and cited answers without leaving the source site.
_Avoid_: Website wrapper, Research Workspace, miniature BeforeJoin

**User Account**:
The authenticated identity shared by the Website and Extension that owns one Research Workspace.
_Avoid_: Installation, visitor, profile

**Anonymous Visitor**:
An unauthenticated person who can inspect public evidence and temporary generic research but owns no Research Workspace.
_Avoid_: Guest account, free user

**Installation Token**:
An anonymous credential issued to one Extension installation for pre-authentication quotas and abuse controls.
_Avoid_: User Account, session

**Pairing Code**:
A short-lived, single-use code issued by the Website after authentication and exchanged by one Extension installation for a Device Session.
_Avoid_: Access token, password, copied cookie

**Device Session**:
A revocable, Extension-scoped authenticated session created through a Pairing Code and stored only by that Extension installation.
_Avoid_: Installation Token, Website cookie, permanent API key

**Administrator**:
An authorized platform operator who manages accounts, quotas, corrections, snapshots, provider health, and diagnostics without owning User Account Workspace Data.
_Avoid_: User, moderator, workspace owner

**Owner**:
An Administrator who controls administrator roles, providers, Published Snapshot activation, global quotas, and other system-wide settings.
_Avoid_: Superuser, root user

**Operator**:
An Administrator who handles corrections, abuse, sessions, usage, diagnostics, and support without authority over roles, providers, or Published Snapshot activation.
_Avoid_: Moderator, support user

**Support Access**:
A time-bounded, audited authorization for an Administrator to inspect the minimum Workspace Data required to resolve one explicit support case.
_Avoid_: Admin visibility, impersonation, unrestricted access
