import { CountdownView } from "@/components/interview/CountdownView";
import { InterviewPanel } from "@/components/interview/InterviewPanel";

type InterviewScreenProps = {
  stage: "countdown" | "ai-speaking" | "listening" | "processing";
  level: number;
  countdown: number;
  question?: string;
  transcript?: string;
  onStartAnswering: () => void;
  onSubmit: () => void;
  onComplete: () => void;
};

export function InterviewScreen({
  stage,
  level,
  countdown,
  question,
  transcript,
  onStartAnswering,
  onSubmit,
  onComplete,
}: InterviewScreenProps) {
  const content =
    stage === "countdown" ? (
      <CountdownView count={countdown} />
    ) : (
      <InterviewPanel
        mode={stage === "ai-speaking" ? "speaking" : stage}
        level={level}
        question={question}
        transcript={transcript}
        onStartAnswering={onStartAnswering}
        onSubmit={onSubmit}
        onComplete={onComplete}
      />
    );
  return content;
}
