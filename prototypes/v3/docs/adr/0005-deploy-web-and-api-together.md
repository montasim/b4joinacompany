---
status: accepted
---

# Deploy the Website and Research API together on Netlify

The Next.js Website, Better Auth endpoints, and versioned `/api/v1` Research API will ship as one Netlify application while remaining logically separated behind shared application services. Both the Website and Extension consume the explicit Research API contract; extension functionality will not depend on Server Actions or React internals, preserving a later path to extract the API without changing its clients.
