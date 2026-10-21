// What the camera problems are called and say; the camera itself needs a browser.
import { test } from "node:test";
import assert from "node:assert/strict";

import { CAMERA_PROBLEM_TEXTS, cameraAvailability, cameraProblemFrom } from "../dist/qr-camera/index.js";
import { LANGS } from "../dist/i18n/index.js";

test("says why the camera cannot be used before asking", () => {
  assert.equal(cameraAvailability({ isSecureContext: false, hasGetUserMedia: false }), "insecure");
  assert.equal(cameraAvailability({ isSecureContext: true, hasGetUserMedia: false }), "unsupported");
  assert.equal(cameraAvailability({ isSecureContext: true, hasGetUserMedia: true }), null);
});

test("turns the browser's errors into problems", () => {
  const err = (name) => Object.assign(new Error("x"), { name });
  assert.equal(cameraProblemFrom(err("NotAllowedError")), "denied");
  assert.equal(cameraProblemFrom(err("SecurityError")), "denied");
  assert.equal(cameraProblemFrom(err("NotFoundError")), "notFound");
  assert.equal(cameraProblemFrom(err("OverconstrainedError")), "notFound");
  assert.equal(cameraProblemFrom(err("NotReadableError")), "failed");
  assert.equal(cameraProblemFrom(undefined), "failed");
});

test("every language says every problem", () => {
  for (const lang of LANGS) {
    assert.deepEqual(Object.keys(CAMERA_PROBLEM_TEXTS[lang]).sort(), [
      "denied",
      "failed",
      "insecure",
      "notFound",
      "unsupported",
    ]);
  }
});
