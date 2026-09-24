// ─────────────────────────────────────────────────────────────────────────────
// Cross-origin access for the funnel pages.
//
// The pages moved to borsogastudio.com/plans/ (Astro, static, on Hostinger).
// These functions stayed here on Vercel, because minting a Vercel Blob upload
// token needs a private token and the file links are HMAC-signed — neither can
// move to the client. So the form posts are now cross-origin.
//
// They send `content-type: application/json`, which is NOT a CORS-simple
// request, so the browser fires a preflight OPTIONS first. Answer it, and echo
// the origin on the real response too.
//
// Allow-list, not "*": these endpoints write to the CRM, the database and blob
// storage. `*` would let any page on the internet post leads as us.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED = new Set([
  "https://borsogastudio.com",
  "https://www.borsogastudio.com",
  // The funnel's own origin, while plans.borsogastudio.com still serves
  // /mutati/ and anything not yet migrated.
  "https://plans.borsogastudio.com",
  // Local preview of the Astro site (`astro dev` / `astro preview`).
  "http://localhost:4321",
  "http://localhost:4331",
]);

// Per-PR test deployments of the Astro site on Vercel (project `borsoga-studio`,
// team `samcard1999s-projects`), both the per-commit URL and the per-branch
// alias. Only the project and team parts are fixed; the middle is a hash or
// `git-<branch>`.
const PREVIEW_RE =
  /^https:\/\/borsoga-studio-[a-z0-9-]+-samcard1999s-projects\.vercel\.app$/;

/**
 * True when the request comes from a test deployment. Those must behave like
 * production up to the point of writing — validate, answer, show the thank-you
 * page — and write nothing: no lead, no CRM, no email.
 *
 * The Origin header can be forged outside a browser, but forging it only buys
 * a request that does nothing, so it is safe to trust in this direction.
 */
export const isPreview = (req: any): boolean =>
  PREVIEW_RE.test(String(req.headers?.origin || ""));

/**
 * Applies the CORS headers. Returns true when the request was a preflight and
 * has already been answered — the caller must then return immediately.
 */
export function cors(req: any, res: any): boolean {
  const origin = req.headers?.origin;
  if (origin && (ALLOWED.has(origin) || PREVIEW_RE.test(origin))) {
    res.setHeader("access-control-allow-origin", origin);
    // The response varies by Origin, so a shared cache must not serve one
    // origin's response to another.
    res.setHeader("vary", "origin");
  }
  res.setHeader("access-control-allow-methods", "POST, GET, HEAD, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
