---
status: accepted
---

# Pin saved checkpoints and refresh them explicitly

Every saved Decision Checkpoint will retain an immutable Checkpoint Revision tied to the Published Snapshot that produced its questions and citations. When newer evidence exists, the Website and Extension will show that a refresh is available and create a new revision only after the user requests it; previous revisions remain inspectable, while applicable private answers and notes carry forward.
