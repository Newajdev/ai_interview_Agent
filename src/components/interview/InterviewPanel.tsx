import { Timer, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioMeter } from "@/components/microphone/AudioMeter";

type InterviewPanelProps = {
  mode: "speaking" | "listening" | "processing";
  level: number;
  onStartAnswering?: () => void;
  onSubmit?: () => void;
};

export function InterviewPanel({
  mode,
  level,
  onStartAnswering,
  onSubmit,
}: InterviewPanelProps) {
  const content =
    mode === "processing" ? (
      <section className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <span className="mx-auto mb-6 block h-10 w-10 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
          <p className="text-lg">Analyzing your response...</p>
        </div>
      </section>
    ) : mode === "listening" ? (
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-cyan-300">YOUR TURN · LISTENING</p>
        <AudioMeter level={level} />
        <p className="mt-4 text-slate-400">
          Your answer transcript will appear here when speech recognition is
          connected.
        </p>
        <Button
          onClick={onSubmit}
          className="mt-8 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        >
          Submit response
        </Button>
      </section>
    ) : (
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12">
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
            Welcome. I&apos;ve reviewed your background. Could you introduce
            yourself and tell me about the work you&apos;re most proud of?
          </p>
          <Button
            onClick={onStartAnswering}
            variant="outline"
            className="mt-9 border-cyan-300/40 text-cyan-200"
          >
            Start answering
          </Button>
        </div>
      </section>
    );

  return content;
}
