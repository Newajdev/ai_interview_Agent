"use client";

import { useEffect, useReducer } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InterviewScreen } from "@/components/screens/InterviewScreen";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { MicrophoneScreen } from "@/components/screens/MicrophoneScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { useMicrophone } from "@/hooks/useMicrophone";
import { api } from "@/services/api/client";
import type { Candidate, InterviewState } from "@/types/interview";

type State = {
  stage: InterviewState;
  file: File | null;
  candidate: Candidate | null;
  error: string | null;
  countdown: number;
};
const initialState: State = {
  stage: "idle",
  file: null,
  candidate: null,
  error: null,
  countdown: 3,
};
const updateState = (state: State, update: Partial<State>): State => ({
  ...state,
  ...update,
});

export function InterviewExperience() {
  const [state, dispatch] = useReducer(updateState, initialState);
  const microphone = useMicrophone();

  const analyze = async () => {
    if (!state.file) return;
    dispatch({ stage: "processing-cv", error: null });
    try {
      const { candidate } = await api.analyzeCv(state.file);
      dispatch({ candidate, stage: "profile-ready" });
    } catch (cause) {
      dispatch({
        stage: "error",
        error:
          cause instanceof Error ? cause.message : "Unable to analyze your CV.",
      });
    }
  };

  const setupMicrophone = async () => {
    dispatch({ stage: "requesting-microphone", error: null });
    try {
      await microphone.start();
      dispatch({ stage: "testing-microphone" });
    } catch (cause) {
      dispatch({
        stage: "error",
        error:
          cause instanceof Error
            ? cause.message
            : "Unable to access your microphone.",
      });
    }
  };

  useEffect(() => {
    if (state.stage === "testing-microphone" && microphone.error)
      dispatch({ stage: "error", error: microphone.error });
  }, [microphone.error, state.stage]);

  useEffect(() => {
    if (state.stage !== "countdown") return;
    if (!state.countdown) {
      dispatch({ stage: "ai-speaking" });
      return;
    }
    const timer = window.setTimeout(
      () => dispatch({ countdown: state.countdown - 1 }),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [state.countdown, state.stage]);

  let screen: React.ReactNode;
  if (state.stage === "processing-cv") {
    screen = <ProcessingScreen />;
  } else if (state.stage === "profile-ready" && state.candidate) {
    screen = (
      <ProfileScreen candidate={state.candidate} onStart={setupMicrophone} />
    );
  } else if (
    state.stage === "requesting-microphone" ||
    state.stage === "testing-microphone"
  ) {
    screen = (
      <MicrophoneScreen
        requesting={state.stage === "requesting-microphone"}
        level={microphone.level}
        onReady={() => dispatch({ stage: "countdown", countdown: 3 })}
      />
    );
  } else if (
    state.stage === "countdown" ||
    state.stage === "ai-speaking" ||
    state.stage === "listening" ||
    state.stage === "processing"
  ) {
    screen = (
      <InterviewScreen
        stage={state.stage}
        level={microphone.level}
        countdown={state.countdown}
        onStartAnswering={() => dispatch({ stage: "listening" })}
        onSubmit={() => dispatch({ stage: "processing" })}
      />
    );
  } else {
    screen = (
      <LandingScreen
        file={state.file}
        error={state.error}
        onFile={(file) => dispatch({ file, error: null })}
        onRemove={() => dispatch({ file: null })}
        onAnalyze={analyze}
      />
    );
  }

  return <AppShell>{screen}</AppShell>;
}
