/**
 * Resolves a path coming from Sheets data (e.g. "/barbers/barber-1.svg")
 * against the app's actual base path.
 *
 * Vite rewrites build-time asset references (index.html, imports) to
 * include the configured base path automatically, but it can't touch
 * runtime strings like `barber.photo` from a spreadsheet — so on GitHub
 * Pages (served from /lobos-barberia/, not /) an absolute "/barbers/…" path
 * would 404. This fixes that, and passes through full URLs unchanged so a
 * barber's photo can also just be a link (Google Drive, Imgur, etc.) typed
 * straight into the sheet — no code change needed to swap in a real photo.
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL; // siempre termina en "/"
  return base + path.replace(/^\/+/, "");
}
