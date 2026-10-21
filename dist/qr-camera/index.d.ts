/**
 * Reading QR codes with the camera, for the apps' own scanners: the camera and the
 * reader (`useQrCamera`, the browser's own reader with jsQR from the app as fallback),
 * why the camera could not be used, and what that says in five languages. Each app
 * keeps its own `<video>` element, layout and what it does with a code.
 */
export { useQrCamera, type JsQrDecode, type QrCamera, type QrCameraOptions, } from "./use-qr-camera.js";
export { cameraAvailability, cameraProblemFrom, type CameraProblem } from "./problem.js";
export { CAMERA_PROBLEM_TEXTS } from "./texts.js";
