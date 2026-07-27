---
status: accepted
---

# Require explicit selection for ambiguous Company Matches

Company search may use normalized aliases, partial names, typo tolerance, domains, and LinkedIn slugs, but it will never silently resolve multiple plausible Company Matches. Ambiguous results must show distinguishing aliases, location, and Official Destinations for user selection, and all downstream checkpoints and Workspace Data store the selected canonical Company Identity identifier rather than entered text.
