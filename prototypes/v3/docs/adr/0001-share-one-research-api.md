---
status: superseded by ADR-0002
---

# Share one Research API across the website and extension

The read-only BeforeJoin website and Deshi Mula Extended extension will consume the same versioned Research API backed by the same published evidence. This avoids separate website and extension APIs producing different Company Identities, sources, or Decision Checkpoints; the website will not own saved notes, checklists, or other personal state.
