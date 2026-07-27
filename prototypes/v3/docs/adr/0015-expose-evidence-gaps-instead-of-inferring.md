---
status: accepted
---

# Expose Evidence Gaps instead of inferring

When an Evidence Bundle cannot support the requested result, the Research API returns an explicit Evidence Gap, identifies missing evidence, links relevant Official Destinations, and offers neutral questions for direct verification. It will not ask AI to fill the gap, score the company, or treat absent negative Stories as positive evidence; no Generation Quota is consumed when generation does not occur, and the Evidence Gap remains part of the Checkpoint Revision.
