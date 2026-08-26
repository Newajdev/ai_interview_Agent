"use client";
import { useEffect, useReducer } from "react";
import { ArrowRight, Check, Mic, Sparkles, Timer, Volume2 } from "lucide-react";
import { CvDropzone } from "@/components/upload/CvDropzone";
import { AudioMeter } from "@/components/microphone/AudioMeter";
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
const initial: State = {
  stage: "idle",
  file: null,
  candidate: null,
  error: null,
  countdown: 3,
};
function reducer(state: State, action: Partial<State>) {
  return { ...state, ...action };
}
const stages = [
  "Uploading your CV",
  "Extracting document content",
  "Analyzing your experience",
  "Identifying technical skills",
  "Preparing your personalized interview",
];
export default function Home() {
  const [state, dispatch] = useReducer(reducer, initial);
  const microphone = useMicrophone();
  const analyze = async () => {
    if (!state.file) return;
    dispatch({ stage: "processing-cv", error: null });
    try {
      const { candidate } = await api.analyzeCv(state.file);
      dispatch({ candidate, stage: "profile-ready" });
    } catch (cause) {
      dispatch({
        error:
          cause instanceof Error ? cause.message : "Unable to analyze your CV.",
        stage: "error",
      });
    }
  };
  const setup = async () => {
    try {
      if (state.candidate?.id) {
        const { interview } = await api.createInterview(state.candidate.id);
        await api.startInterview(interview.id);
      }
      dispatch({ stage: "requesting-microphone" });
      await microphone.start();
      dispatch({ stage: "testing-microphone" });
    } catch (cause) {
      dispatch({
        stage: "error",
        error:
          cause instanceof Error
            ? cause.message
            : "Unable to start your interview.",
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
    const id = setTimeout(
      () => dispatch({ countdown: state.countdown - 1 }),
      1000,
    );
    return () => clearTimeout(id);
  }, [state.stage, state.countdown]);
  const shell = (content: React.ReactNode) => (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_-15%,#164e63,transparent_38%),#080b12] px-5 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-slate-950">
              <Sparkles size={18} />
            </span>
            Intervue
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            Personalized AI practice
          </span>
        </header>
        {content}
      </div>
    </main>
  );
  if (state.stage === "processing-cv")
    return shell(
      <section className="mx-auto max-w-xl pt-12">
        <p className="text-sm font-semibold tracking-widest text-cyan-300">
          CV ANALYSIS
        </p>
        <h1 className="mt-3 text-4xl font-semibold">
          Building your interview brief.
        </h1>
        <div className="mt-10 space-y-5">
          {stages.map((item, i) => (
            <div key={item} className="flex items-center gap-4 text-slate-300">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full ${i === 0 ? "bg-cyan-300 text-slate-950" : "bg-white/10"}`}
              >
                {i + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>,
    );
  if (state.stage === "profile-ready" && state.candidate)
    return shell(
      <section className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="mb-3 text-sm font-medium text-cyan-300">
            PROFILE ANALYSIS COMPLETE
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your personalized interview is ready.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
            Our AI interviewer has analyzed your background and will adapt
            questions based on your experience and technical skills.
          </p>
          <button
            onClick={setup}
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
          >
            Start interview <ArrowRight size={17} />
          </button>
        </div>
        <aside className="rounded-3xl border border-white/10 bg-white/[.05] p-6">
          <p className="text-xs font-semibold tracking-widest text-slate-400">
            CANDIDATE PROFILE
          </p>
          <h2 className="mt-5 text-2xl font-semibold">
            {state.candidate.name ?? "Your profile"}
          </h2>
          <p className="text-cyan-300">
            {state.candidate.professionalTitle ?? "Professional candidate"}
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-400">
            <p>{state.candidate.email ?? "Email not detected"}</p>
            <p>{state.candidate.phone ?? "Phone not detected"}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {state.candidate.skills.length ? (
              state.candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">
                No skills could be reliably extracted.
              </span>
            )}
          </div>
        </aside>
      </section>,
    );
  if (
    state.stage === "requesting-microphone" ||
    state.stage === "testing-microphone"
  )
    return shell(
      <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[.05] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
          <Mic />
        </span>
        <p className="mt-6 text-sm font-medium tracking-widest text-cyan-300">
          MICROPHONE CHECK
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Let’s make sure we can hear you clearly.
        </h1>
        <p className="mt-3 text-slate-400">
          {state.stage === "requesting-microphone"
            ? "Requesting access…"
            : "Listening… speak normally to test your audio."}
        </p>
        <AudioMeter level={microphone.level} />
        <div className="mt-4 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200">
          {microphone.level > 0.04
            ? "Your microphone is picking up sound."
            : "Waiting for your voice…"}
        </div>
        <button
          onClick={() => dispatch({ stage: "countdown", countdown: 3 })}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
        >
          I’m ready <Check size={17} />
        </button>
      </section>,
    );
  if (state.stage === "countdown")
    return shell(
      <section className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-cyan-300">YOUR INTERVIEW IS ABOUT TO BEGIN</p>
          <p className="mt-6 text-9xl font-semibold tabular-nums">
            {state.countdown || "Go"}
          </p>
        </div>
      </section>,
    );
  if (state.stage === "ai-speaking")
    return shell(
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[.05] p-8 sm:p-12">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-2 text-cyan-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            AI SPEAKING
          </span>
          <span className="flex items-center gap-1">
            <Timer size={15} />
            00:00
          </span>
        </div>
        <div className="mt-12 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cyan-300 text-slate-950">
            <Volume2 size={32} />
          </span>
          <p className="mt-8 text-lg leading-8">
            Welcome. I’ve reviewed your background. Could you introduce yourself
            and tell me about the work you’re most proud of?
          </p>
          <button
            onClick={() => dispatch({ stage: "listening" })}
            className="mt-9 rounded-xl border border-cyan-300/40 px-5 py-3 text-cyan-200"
          >
            Start answering
          </button>
        </div>
      </section>,
    );
  if (state.stage === "listening")
    return shell(
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[.05] p-8 text-center">
        <p className="text-cyan-300">YOUR TURN · LISTENING</p>
        <AudioMeter level={microphone.level} />
        <p className="mt-4 text-slate-400">
          Your answer transcript will appear here when speech recognition is
          connected.
        </p>
        <button
          onClick={() => dispatch({ stage: "processing" })}
          className="mt-8 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
        >
          Submit response
        </button>
      </section>,
    );
  if (state.stage === "processing")
    return shell(
      <section className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <span className="mx-auto mb-6 block h-10 w-10 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
          <p className="text-lg">Analyzing your response…</p>
        </div>
      </section>,
    );
  return shell(
    <section className="mx-auto max-w-2xl pt-10 text-center">
      <p className="mb-4 text-sm font-medium tracking-[.2em] text-cyan-300">
        INTERVIEW, REIMAGINED
      </p>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
        AI-powered interview experience.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400">
        Upload your CV and experience a personalized AI interview based on your
        skills, experience, and professional background.
      </p>
      <div className="mx-auto mt-10 max-w-xl">
        <CvDropzone
          file={state.file}
          onFile={(file) => dispatch({ file, error: null })}
          onRemove={() => dispatch({ file: null })}
        />
        {state.error && (
          <p className="mt-4 text-sm text-rose-300">{state.error}</p>
        )}
        <button
          disabled={!state.file}
          onClick={analyze}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze my CV <ArrowRight size={17} />
        </button>
      </div>
    </section>,
  );
}
