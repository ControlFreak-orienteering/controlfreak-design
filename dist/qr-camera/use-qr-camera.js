import { useEffect, useRef, useState } from "react";
import { cameraAvailability, cameraProblemFrom } from "./problem.js";
/**
 * Picks the reader: the browser's own `BarcodeDetector` when it reads QR codes (faster,
 * and easy on the battery), otherwise jsQR on a scaled-down copy of the picture.
 */
async function makeReader(loadJsQr, maxReadWidth) {
    const Detector = globalThis.BarcodeDetector;
    if (Detector) {
        try {
            const formats = (await Detector.getSupportedFormats?.()) ?? [];
            if (formats.includes("qr_code")) {
                const detector = new Detector({ formats: ["qr_code"] });
                return async (video) => (await detector.detect(video))[0]?.rawValue ?? null;
            }
        }
        catch {
            // The reader is there but does not work; jsQR takes over.
        }
    }
    const decode = await loadJsQr();
    const canvas = document.createElement("canvas");
    return async (video) => {
        const scale = Math.min(1, maxReadWidth / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context)
            return null;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        return decode(image.data, image.width, image.height)?.data ?? null;
    };
}
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
export function useQrCamera({ onCode, loadJsQr, intervalMs = 250, active = true, maxReadWidth = Infinity, }) {
    const video = useRef(null);
    const [problem, setProblem] = useState(null);
    // The latest callbacks, so that the camera is not restarted when the parent re-renders.
    const codeRef = useRef(onCode);
    codeRef.current = onCode;
    const loadRef = useRef(loadJsQr);
    loadRef.current = loadJsQr;
    useEffect(() => {
        if (!active)
            return;
        let stream = null;
        let timer = null;
        let frameHandle = null;
        let stopped = false;
        // When the latest shown picture was taken, if the browser says so.
        let lastCaptureAt = null;
        const stop = () => {
            stopped = true;
            if (timer !== null)
                clearInterval(timer);
            const v = video.current;
            if (frameHandle !== null)
                v?.cancelVideoFrameCallback?.(frameHandle);
            stream?.getTracks().forEach((track) => track.stop());
            stream = null;
        };
        const unavailable = cameraAvailability({
            isSecureContext: window.isSecureContext,
            hasGetUserMedia: typeof navigator.mediaDevices?.getUserMedia === "function",
        });
        if (unavailable) {
            setProblem(unavailable);
            return stop;
        }
        setProblem(null);
        // Chrome and Safari say when each picture was taken; that is more exact than the
        // clock when the picture is read, since the camera always lags a little.
        const watchFrames = (v) => {
            if (!v.requestVideoFrameCallback)
                return;
            const onFrame = (_now, metadata) => {
                lastCaptureAt =
                    metadata.captureTime !== undefined ? performance.timeOrigin + metadata.captureTime : null;
                if (!stopped)
                    frameHandle = v.requestVideoFrameCallback(onFrame);
            };
            frameHandle = v.requestVideoFrameCallback(onFrame);
        };
        void (async () => {
            let media;
            try {
                media = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                    audio: false,
                });
            }
            catch (e) {
                if (!stopped)
                    setProblem(cameraProblemFrom(e));
                return;
            }
            // Closed while the browser asked for permission: release the camera at once.
            if (stopped) {
                media.getTracks().forEach((track) => track.stop());
                return;
            }
            stream = media;
            try {
                const v = video.current;
                if (!v)
                    return;
                v.srcObject = media;
                await v.play();
                watchFrames(v);
                const read = await makeReader(loadRef.current, maxReadWidth);
                if (stopped)
                    return;
                let busy = false;
                timer = setInterval(() => {
                    const current = video.current;
                    if (busy || stopped || !current || current.videoWidth === 0)
                        return;
                    busy = true;
                    const capturedAt = lastCaptureAt ?? Date.now();
                    read(current)
                        .then((text) => {
                        if (stopped || text === null)
                            return;
                        if (codeRef.current(text, capturedAt))
                            stop();
                    })
                        .catch(() => {
                        // A picture that could not be read; the next one gets a try.
                    })
                        .finally(() => {
                        busy = false;
                    });
                }, intervalMs);
            }
            catch (e) {
                if (!stopped) {
                    stop();
                    setProblem(cameraProblemFrom(e));
                }
            }
        })();
        return stop;
    }, [active, intervalMs, maxReadWidth]);
    return { video, problem };
}
