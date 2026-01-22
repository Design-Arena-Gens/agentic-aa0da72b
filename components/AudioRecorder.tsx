'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import type { AudioNote } from "@/lib/types";
import { uid } from "@/lib/utils";

export function AudioRecorder({ onAudioCaptured }: { onAudioCaptured: (note: AudioNote) => void }) {
  const [recording, setRecording] = useState(false);
  const [previewNotes, setPreviewNotes] = useState<AudioNote[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
    };
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;
      startRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const blobUrl = URL.createObjectURL(blob);
        const duration = Date.now() - startRef.current;
        const note: AudioNote = {
          id: uid("audio"),
          timestamp: Date.now(),
          blobUrl,
          duration
        };
        onAudioCaptured(note);
        setPreviewNotes((prev) => [...prev.slice(-2), note]);
        recorder.stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Audio recording failed", error);
    }
  }, [onAudioCaptured]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-slate-100">Audio komentár</p>
          <p className="text-xs text-slate-400">Nahraj slovný popis kroku a priraď ho k makru.</p>
        </div>
        {recording ? (
          <button
            onClick={stopRecording}
            className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white"
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="inline-flex items-center gap-1 rounded-md border border-primary-500 px-3 py-1 text-xs font-semibold text-primary-100 hover:bg-primary-500/10"
          >
            <Mic className="h-4 w-4" />
            Nahrať
          </button>
        )}
      </div>
      {previewNotes.length > 0 && (
        <div className="mt-3 space-y-2">
          {previewNotes.map((note) => (
            <div key={note.id} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
              <span>Audio {Math.round(note.duration / 1000)}s</span>
              <audio controls src={note.blobUrl} className="h-6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
