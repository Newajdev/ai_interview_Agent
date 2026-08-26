import { MicrophoneCheck } from "@/components/microphone/MicrophoneCheck";

type MicrophoneScreenProps = {
  requesting: boolean;
  level: number;
  onReady: () => void;
};

export function MicrophoneScreen({
  requesting,
  level,
  onReady,
}: MicrophoneScreenProps) {
  return (
    <MicrophoneCheck requesting={requesting} level={level} onReady={onReady} />
  );
}
