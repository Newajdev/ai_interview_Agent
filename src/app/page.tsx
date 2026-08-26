"use client";

import { useEffect, useReducer } from "react";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CandidateProfileCard } from "@/components/shared/CandidateProfileCard";
import { ProcessingSteps } from "@/components/shared/ProcessingSteps";
import { CountdownView } from "@/components/interview/CountdownView";
import { InterviewPanel } from "@/components/interview/InterviewPanel";
import { MicrophoneCheck } from "@/components/microphone/MicrophoneCheck";
import { CvDropzone } from "@/components/upload/CvDropzone";
import { Button } from "@/components/ui/button";
import { useMicrophone } from "@/hooks/useMicrophone";
import { api } from "@/services/api/client";
import type { Candidate, InterviewState } from "@/types/interview";

type State = { stage: InterviewState; file: File | null; candidate: Candidate | null; error: string | null; countdown: number };
const initialState: State = { stage: "idle", file: null, candidate: null, error: null, countdown: 3 };
const updateState = (state: State, update: Partial<State>): State => ({ ...state, ...update });

export default function Home() {
  const [state, dispatch] = useReducer(updateState, initialState);
  const microphone = useMicrophone();

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

  if (state.stage === "processing-cv") return <AppShell><section className="mx-auto max-w-xl pt-12"><p className="text-sm font-semibold tracking-widest text-cyan-300">CV ANALYSIS</p><h1 className="mt-3 text-4xl font-semibold">Building your interview brief.</h1><ProcessingSteps /></section></AppShell>;

  if (state.stage === "profile-ready" && state.candidate) return <AppShell><section className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><div><p className="mb-3 text-sm font-medium text-cyan-300">PROFILE ANALYSIS COMPLETE</p><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your personalized interview is ready.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">Our AI interviewer has analyzed your background and will adapt questions based on your experience and technical skills.</p><Button onClick={setupMicrophone} className="mt-9 bg-cyan-300 text-slate-950 hover:bg-cyan-200">Start interview <ArrowRight /></Button></div><CandidateProfileCard candidate={state.candidate} /></section></AppShell>;

  if (state.stage === "requesting-microphone" || state.stage === "testing-microphone") return <AppShell><MicrophoneCheck requesting={state.stage === "requesting-microphone"} level={microphone.level} onReady={() => dispatch({ stage: "countdown", countdown: 3 })} /></AppShell>;
  if (state.stage === "countdown") return <AppShell><CountdownView count={state.countdown} /></AppShell>;
  if (state.stage === "ai-speaking" || state.stage === "listening" || state.stage === "processing") return <AppShell><InterviewPanel mode={state.stage === "ai-speaking" ? "speaking" : state.stage} level={microphone.level} onStartAnswering={() => dispatch({ stage: "listening" })} onSubmit={() => dispatch({ stage: "processing" })} /></AppShell>;

  return <AppShell><section className="mx-auto max-w-2xl pt-10 text-center"><p className="mb-4 text-sm font-medium tracking-[.2em] text-cyan-300">INTERVIEW, REIMAGINED</p><h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">AI-powered interview experience.</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400">Upload your CV and experience a personalized AI interview based on your skills, experience, and professional background.</p><div className="mx-auto mt-10 max-w-xl"><CvDropzone file={state.file} onFile={(file) => dispatch({ file, error: null })} onRemove={() => dispatch({ file: null })} /><p className="mt-4 min-h-5 text-sm text-rose-300">{state.error}</p><Button disabled={!state.file} onClick={analyze} className="mt-2 bg-cyan-300 text-slate-950 hover:bg-cyan-200">Analyze my CV <ArrowRight /></Button></div></section></AppShell>;
}
