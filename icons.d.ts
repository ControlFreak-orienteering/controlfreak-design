/**
 * Turns a data URL (from a `?inline` import of a file in `controlfreak-design/assets/`)
 * into the response for an icon request, with its content type, cacheable for a day.
 */
export function iconResponse(dataUrl: string): Response;
