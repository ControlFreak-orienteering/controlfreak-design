/**
 * A problem that is known before asking for the camera, or null when it can be tried.
 *
 * @param env - Whether the page is a secure context and the browser has `getUserMedia`.
 */
export function cameraAvailability(env) {
    if (!env.isSecureContext)
        return "insecure";
    if (!env.hasGetUserMedia)
        return "unsupported";
    return null;
}
/**
 * The error from `getUserMedia` (or from playing the video) as one of the problems.
 * Browsers throw a `DOMException` whose `name` says what happened; anything unknown is
 * `failed`.
 */
export function cameraProblemFrom(error) {
    const name = typeof error === "object" && error !== null && "name" in error
        ? String(error.name)
        : "";
    switch (name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
        case "SecurityError":
            return "denied";
        case "NotFoundError":
        case "DevicesNotFoundError":
        case "OverconstrainedError":
            return "notFound";
        default:
            return "failed";
    }
}
