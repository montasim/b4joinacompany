const allowedDestinations = new Set([
  "/",
  "/admin",
  "/answer",
  "/compare",
  "/extension",
  "/export",
  "/history",
  "/method",
  "/notifications",
  "/saved",
  "/support"
]);

export function safeAuthNext(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate?.startsWith("/") || candidate.startsWith("//")) return "/saved";

  const pathname = candidate.split(/[?#]/, 1)[0];
  if (allowedDestinations.has(pathname)) return candidate;
  if (/^\/company\/[a-z0-9-]+$/i.test(pathname)) return candidate;
  return "/saved";
}
