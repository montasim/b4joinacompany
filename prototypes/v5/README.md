# b4join V5 prototype

V5 extends the V4 company brief with source-linked legal context. Its primary
example is the repeated overtime signal on `company.html`.

## Recommended legal-context experience

```text
Reported conduct
  → applicability screen
  → legal test in a named, versioned source
  → evidence-completeness assessment
  → bounded status, questions and source links
```

The legal-context section:

- keeps reported conduct, legal tests, applicability and conclusions separate;
- uses four bounded statuses: Signal only, Potential issue, Corroborated
  concern, and Officially established;
- stops the overtime example at Signal only because mentions of overtime do
  not establish excessive hours, missing allowance or legal coverage;
- shows supporting signals, missing material records, unresolved
  applicability and the publication boundary in an evidence ledger;
- opens the exact PDF page for every referenced section;
- shows when a topic is matched versus displayed only as a scenario preview;
- identifies the records and company response needed before a status can be
  promoted;
- reserves Officially established for a regulator, inspector, tribunal or
  court record;
- supplies practical evidence requests instead of personalized legal advice;
- exposes source freshness and applicability limitations.

## Demonstrated topics

- **Working hours and overtime** — matched to the prototype brief using 14
  schedule-related sources; references sections 100, 102, and 108.
- **Late wage payment** — scenario preview referencing sections 122, 123,
  124A, and 132.
- **Unexpected deductions** — scenario preview referencing sections 125 and
  132.

## Source

The bundled source is
[`sources/Bangladesh-Labour-Act-2006-English.pdf`](sources/Bangladesh-Labour-Act-2006-English.pdf).
Its metadata identifies it as an English translation updated through 2018.
The interface therefore blocks current-law reliance, links to the Ministry's
legislative information, and notes that the Ministry lists later 2025 and 2026
changes. Current amendments, effective dates, rules, exemptions, EPZ coverage,
and role classification need separate verification.

## Pages

V5 preserves the complete V4 prototype. The new experience is on
[`company.html`](company.html); all other pages remain available for navigation
and context.

Open `index.html` directly or serve this directory with any static web server.
