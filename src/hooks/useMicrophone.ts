"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useMicrophone() {
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef<number | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const stop = useCallback(() => {
    recorder.current?.stop();
    recorder.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (frame.current) cancelAnimationFrame(frame.current);
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone access is not supported by this browser.");
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      context.createMediaStreamSource(stream.current).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        setLevel(Math.min(1, data.reduce((sum, value) => sum + Math.abs(value - 128), 0) / data.length / 35));
        frame.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (cause) {
      stop();
      const name = cause instanceof Error ? cause.name : "";
      setError(name === "NotAllowedError" ? "Microphone permission was denied." : "No microphone is available.");
      throw cause;
    }
  }, [stop]);

  const record = useCallback(() => {
    if (!stream.current) throw new Error("Microphone is not ready.");
    if (!MediaRecorder.isTypeSupported("audio/webm")) throw new Error("Audio recording is not supported by this browser.");
    chunks.current = [];
    const mediaRecorder = new MediaRecorder(stream.current, { mimeType: "audio/webm" });
    recorder.current = mediaRecorder;
    mediaRecorder.start();
    return new Promise<Blob>((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      mediaRecorder.onerror = () => reject(new Error("Audio recording failed."));
      mediaRecorder.onstop = () => resolve(new Blob(chunks.current, { type: "audio/webm" }));
    });
  }, []);

  useEffect(() => stop, [stop]);
  return { level, error, start, stop, record };
}
