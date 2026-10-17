/**
 * Serves the family's icons (assets/) from an app's own server, at fixed paths such as
 * /favicon.ico, so that every app shows the same icons without keeping copies of them.
 *
 * Browsers ask for icons at fixed paths (/favicon.ico, the paths in a web app manifest),
 * so the files cannot simply be bundled under hashed names. Instead each app has one small
 * server route per icon that imports the file from this package with Vite's `?inline`
 * (which turns it into a data URL in the server bundle) and answers with
 * `iconResponse(dataUrl)`.
 *
 * Plain JavaScript with no dependencies, so it runs in any server runtime (Node,
 * Cloudflare Workers).
 */

/** How long browsers and caches may keep an icon: a day. */
const MAX_AGE_SECONDS = 86400;

/**
 * Turns a data URL into the response for an icon request.
 *
 * @param {string} dataUrl - The icon as a data URL, e.g. from
 *   `import icon from "controlfreak-design/assets/favicon.ico?inline"`. Both base64 and
 *   URL-encoded data URLs work (Vite writes SVG files URL-encoded).
 * @returns {Response} The icon with its content type, cacheable for a day.
 */
export function iconResponse(dataUrl) {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) return new Response("Not Found", { status: 404 });
  const [, type, base64, payload] = match;
  let body;
  if (base64) {
    const binary = atob(payload);
    body = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) body[i] = binary.charCodeAt(i);
  } else {
    body = new TextEncoder().encode(decodeURIComponent(payload));
  }
  return new Response(body, {
    headers: {
      "content-type": type,
      "cache-control": `public, max-age=${MAX_AGE_SECONDS}`,
    },
  });
}
