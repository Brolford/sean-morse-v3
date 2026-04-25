/**
 * Image URL helpers for Squarespace CDN-hosted assets.
 *
 * All project imagery on this site comes from images.squarespace-cdn.com,
 * which supports a `?format=Nw` query param to deliver a specific width.
 * Without it, the CDN serves the original full-resolution file (often 5MB+),
 * which destroys mobile LCP.
 *
 * - `withSize` normalizes a single URL to a target width.
 * - `buildSrcset` emits a multi-width srcset string so the browser picks
 *   the right candidate based on the page's `sizes` attribute.
 */

const DEFAULT_WIDTHS = [500, 750, 1100, 1500, 2500];

/** Append/replace ?format=Nw on a Squarespace URL. Falls through unchanged
 *  if the URL doesn't parse cleanly. */
export function withSize(src: string, width: number): string {
  try {
    const url = new URL(src);
    url.searchParams.set('format', `${width}w`);
    return url.toString();
  } catch {
    return src;
  }
}

/** Comma-separated `srcset` covering common viewport widths × DPRs. */
export function buildSrcset(src: string, widths: number[] = DEFAULT_WIDTHS): string {
  return widths
    .map(w => `${withSize(src, w)} ${w}w`)
    .join(', ');
}
