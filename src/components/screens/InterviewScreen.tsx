import { CountdownView } from "@/components/interview/CountdownView";
import { InterviewPanel } from "@/components/interview/InterviewPanel";

type InterviewScreenProps = {
  stage: "countdown" | "ai-speaking" | "listening" | "processing";
  level: number;
  countdown: number;
  onStartAnswering: () => void;
  onSubmit: () => void;
};

export function InterviewScreen({
  stage,
  level,
  countdown,
  onStartAnswering,
  onSubmit,
}: InterviewScreenProps) {
  const content =
    stage === "countdown" ? (
      <CountdownView count={countdown} />
    ) : (
      <InterviewPanel
        mode={stage === "ai-speaking" ? "speaking" : stage}
        level={level}
        onStartAnswering={onStartAnswering}
        onSubmit={onSubmit}
      />
    );
  return content;
}
