'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { MonitorDown, Square } from "lucide-react";
import type { CaptureFrame } from "@/lib/types";
import { MacroVideoRecorder } from "@/lib/video";

export function ScreenRecorder({
  onFramesCaptured
}: {
  onFramesCaptured: (frames: CaptureFrame[]) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [previewFrames, setPreviewFrames] = useState<CaptureFrame[]>([]);
  const recorderRef = useRef<MacroVideoRecorder | null>(null);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  const stopCapture = useCallback(() => {
    (async () => {
      if (!recorderRef.current) return;
      const frames = await recorderRef.current.stop();
      recorderRef.current = null;
      setRecording(false);
      if (frames.length) {
        onFramesCaptured(frames);
        setPreviewFrames(frames);
      }
    })();
  }, [onFramesCaptured]);

  const startCapture = useCallback(async () => {
    try {
      const recorder = new MacroVideoRecorder();
      recorderRef.current = recorder;
      await recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Screen capture failed", error);
      stopCapture();
    }
  }, [stopCapture]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-100">Záznam obrazovky</p>
          <p className="text-xs text-slate-400">
            Počas nahrávania sa uložia snímky viazané na aktuálny krok.
          </p>
        </div>
        {recording ? (
          <button
            className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white"
            onClick={stopCapture}
          >
            <Square className="h-4 w-4" />
            Zastaviť
          </button>
        ) : (
          <button
            className="inline-flex items-center gap-1 rounded-md border border-primary-500 px-3 py-1 text-xs font-semibold text-primary-100 hover:bg-primary-500/10"
            onClick={startCapture}
          >
            <MonitorDown className="h-4 w-4" />
            Spustiť záznam
          </button>
        )}
      </div>
      {previewFrames.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {previewFrames.slice(-3).map((frame) => (
            <div key={frame.id} className="overflow-hidden rounded-md border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.dataUrl} alt="frame" className="h-20 w-full object-cover" />
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-slate-400">
        Po ukončení nahrávania bude možné pozrieť si snímky v detaile kroku.
      </p>
    </div>
  );
}
