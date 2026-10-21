import { type RefObject } from "react";
import { type CameraProblem } from "./problem.js";
/**
 * jsQR's function, as the app imports it: `() => import("jsqr").then((m) => m.default)`.
 * The package does not depend on jsQR; the app passes it, so it is only loaded when
 * the browser has no QR reader of its own.
 */
export type JsQrDecode = (data: Uint8ClampedArray, width: number, height: number) => {
    data: string;
} | null;
/** What `useQrCamera` needs. */
export type QrCameraOptions = {
    /**
     * Called with each QR code's text and when the camera picture was taken (ms since
     * 1970, this device's clock). Return `true` to stop filming (the camera is released).
     */
    onCode: (text: string, capturedAt: number) => boolean;
    /** Loads jsQR, the fallback reader for browsers without `BarcodeDetector`. */
    loadJsQr: () => Promise<JsQrDecode>;
    /** How often the picture is read, in ms; 250 by default (four times a second). */
    intervalMs?: number;
    /** Whether the camera should be on; true by default. Off releases it. */
    active?: boolean;
    /**
     * Scale the picture down to at most this width before jsQR reads it: faster, and a
     * code that fills part of the picture is read just as well. Full size by default,
     * which dense codes such as the frames of a QR film need.
     */
    maxReadWidth?: number;
};
/** What `useQrCamera` gives back. */
export type QrCamera = {
    /** To attach to a `<video muted playsInline>` element. */
    video: RefObject<HTMLVideoElement | null>;
    /** Why the camera could not be used, or null. */
    problem: CameraProblem | null;
};
/**
 * Films with the back camera (the webcam on a computer) and reads QR codes in the
 * picture, for the apps' own scanners: Run's course codes, Event's connection codes and
 * QR films, the start clock's start list and clock code.
 *
 * The camera is only asked for while the component is shown (and `active`), never when
 * the module is loaded, so the server can render the page without it. It is released
 * when `onCode` returns true, when `active` turns false and when the component goes
 * away. The capture time comes from the browser's own time for the picture where it
 * gives one, otherwise from just before the picture is read, so reading time is not
 * counted (the start clock's clock sync depends on it).
 */
export declare function useQrCamera({ onCode, loadJsQr, intervalMs, active, maxReadWidth, }: QrCameraOptions): QrCamera;
