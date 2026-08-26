"use client";

import { useEffect, useReducer, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InterviewScreen } from "@/components/screens/InterviewScreen";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { MicrophoneScreen } from "@/components/screens/MicrophoneScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { useMicrophone } from "@/hooks/useMicrophone";
import { api } from "@/services/api/client";
import type { Candidate, InterviewState } from "@/types/interview";

type State = { stage: InterviewState; file: File | null; candidate: Candidate | null; error: string | null; countdown: number; interviewId: string | null; question: string | null; transcript: string | null };
const initialState: State = { stage: "idle", file: null, candidate: null, error: null, countdown: 3, interviewId: null, question: null, transcript: null };
const updateState = (state: State, update: Partial<State>): State => ({ ...state, ...update });

export function InterviewExperience() {
  const [state, dispatch] = useReducer(updateState, initialState);
  const microphone = useMicrophone();
  const recording = useRef<Promise<Blob> | null>(null);

  const analyze = async () => {
    if (!state.file) return;
    dispatch({ stage: "processing-cv", error: null });
    try {
      const { candidate } = await api.analyzeCv(state.file);
      dispatch({ candidate, stage: "profile-ready" });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to analyze your CV." });
    }
  };

  const setupMicrophone = async () => {
    dispatch({ stage: "requesting-microphone", error: null });
    try {
      await microphone.start();
      dispatch({ stage: "testing-microphone" });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to access your microphone." });
    }
  };

  const beginInterview = async () => {
    if (!state.candidate?.id) return dispatch({ stage: "error", error: "Candidate information is missing." });
    try {
      const created = await api.createInterview(state.candidate.id);
      const started = await api.startInterview(created.interview.id);
      dispatch({ interviewId: created.interview.id, question: started.interview.firstQuestion ?? null, stage: "countdown", countdown: 3 });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to create the interview." });
    }
  };

  const startRecording = () => {
    try {
      recording.current = microphone.record();
      dispatch({ stage: "listening" });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to record your answer." });
    }
  };

  const submitRecording = async () => {
    if (!state.interviewId || !recording.current) return;
    dispatch({ stage: "processing" });
    microphone.stop();
    try {
      const audio = await recording.current;
      const result = await api.submitAnswer(state.interviewId, audio);
      const source = new Audio(`data:${result.audio.contentType};base64,${result.audio.base64}`);
      await source.play().catch(() => undefined);
      dispatch({ transcript: result.transcript, question: result.question, stage: "ai-speaking" });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to process your answer." });
    } finally {
      recording.current = null;
    }
  };

  const complete = async () => {
    if (!state.interviewId) return;
    try {
      await api.completeInterview(state.interviewId);
      await api.createEvaluation(state.interviewId);
      dispatch({ stage: "completed" });
    } catch (cause) {
      dispatch({ stage: "error", error: cause instanceof Error ? cause.message : "Unable to complete the interview." });
    }
  };

  useEffect(() => {
    if (state.stage === "testing-microphone" && microphone.error) dispatch({ stage: "error", error: microphone.error });
  }, [microphone.error, state.stage]);

  useEffect(() => {
    if (state.stage !== "countdown") return;
    if (!state.countdown) {
      dispatch({ stage: "ai-speaking" });
      return;
    }
    const timer = window.setTimeout(() => dispatch({ countdown: state.countdown - 1 }), 1000);
    return () => window.clearTimeout(timer);
  }, [state.countdown, state.stage]);

  let screen: React.ReactNode;
  if (state.stage === "processing-cv") screen = <ProcessingScreen />;
  else if (state.stage === "profile-ready" && state.candidate) screen = <ProfileScreen candidate={state.candidate} onStart={setupMicrophone} />;
  else if (state.stage === "requesting-microphone" || state.stage === "testing-microphone") screen = <MicrophoneScreen requesting={state.stage === "requesting-microphone"} level={microphone.level} onReady={beginInterview} />;
  else if (state.stage === "countdown" || state.stage === "ai-speaking" || state.stage === "listening" || state.stage === "processing") screen = <InterviewScreen stage={state.stage} level={microphone.level} countdown={state.countdown} question={state.question ?? undefined} transcript={state.transcript ?? undefined} onStartAnswering={startRecording} onSubmit={submitRecording} onComplete={complete} />;
  else screen = <LandingScreen file={state.file} error={state.error} onFile={(file) => dispatch({ file, error: null })} onRemove={() => dispatch({ file: null })} onAnalyze={analyze} />;

  return <AppShell>{screen}</AppShell>;
}
