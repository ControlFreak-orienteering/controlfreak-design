/**
 * Why the camera cannot be used, as a code the app turns into its own text (or the
 * shared one in `CAMERA_PROBLEM_TEXTS`).
 *
 * - `insecure`: the page is not opened over https, where browsers refuse the camera.
 * - `unsupported`: the browser has no camera access at all.
 * - `denied`: the user, or the browser's settings, did not allow the camera.
 * - `notFound`: the device has no camera (or none that fits).
 * - `failed`: anything else, e.g. the camera is busy in another app.
 */
export type CameraProblem = "insecure" | "unsupported" | "denied" | "notFound" | "failed";

/**
 * A problem that is known before asking for the camera, or null when it can be tried.
 *
 * @param env - Whether the page is a secure context and the browser has `getUserMedia`.
 */
export function cameraAvailability(env: {
  isSecureContext: boolean;
  hasGetUserMedia: boolean;
}): CameraProblem | null {
  if (!env.isSecureContext) return "insecure";
  if (!env.hasGetUserMedia) return "unsupported";
  return null;
}

/**
 * The error from `getUserMedia` (or from playing the video) as one of the problems.
 * Browsers throw a `DOMException` whose `name` says what happened; anything unknown is
 * `failed`.
 */
export function cameraProblemFrom(error: unknown): CameraProblem {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String((error as { name: unknown }).name)
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
