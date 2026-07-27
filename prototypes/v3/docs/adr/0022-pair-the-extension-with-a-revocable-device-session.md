---
status: accepted
---

# Pair the extension with a revocable device session

Connecting an Extension to a User Account opens the Website and requires an authenticated user to authorize that installation. The Website then issues a short-lived, single-use Pairing Code that the Extension exchanges for a revocable, Extension-scoped Device Session. Better Auth Website cookies and session tokens are never copied into Extension storage; anonymous Installation Tokens remain separate and are replaced for authenticated requests only by the Device Session.
