---
status: accepted
---

# Resolve concurrent workspace writes with server revisions

The Research API is authoritative for Workspace Data and issues a Workspace Revision for every mutable record. Website and Extension mutations must include the revision they read: independent field changes may merge, but competing changes to the same field return an explicit Workspace Conflict instead of using silent last-write-wins behavior. The Extension queues offline changes as idempotent Pending Mutations, and retained Deletion Markers prevent stale clients from restoring deleted Workspace Data.
