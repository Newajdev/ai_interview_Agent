import { Check, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioMeter } from "@/components/microphone/AudioMeter";

type MicrophoneCheckProps = {
  requesting: boolean;
  level: number;
  onReady: () => void;
};

export function MicrophoneCheck({ requesting, level, onReady }: MicrophoneCheckProps) {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300"><Mic /></span>
      <p className="mt-6 text-sm font-medium tracking-widest text-cyan-300">MICROPHONE CHECK</p>
      <h1 className="mt-3 text-3xl font-semibold">Let&apos;s make sure we can hear you clearly.</h1>
      <p className="mt-3 text-slate-400">{requesting ? "Requesting access..." : "Listening... speak normally to test your audio."}</p>
      <AudioMeter level={level} />
      <div className="mt-4 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200">{level > 0.04 ? "Your microphone is picking up sound." : "Waiting for your voice..."}</div>
      <Button onClick={onReady} className="mt-6 bg-cyan-300 text-slate-950 hover:bg-cyan-200"><Check /> I&apos;m ready</Button>
    </section>
  );
}
