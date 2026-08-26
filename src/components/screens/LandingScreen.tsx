import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CvDropzone } from "@/components/upload/CvDropzone";

type LandingScreenProps = {
  file: File | null;
  error: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  onAnalyze: () => void;
};

export function LandingScreen({
  file,
  error,
  onFile,
  onRemove,
  onAnalyze,
}: LandingScreenProps) {
  return (
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
        <CvDropzone file={file} onFile={onFile} onRemove={onRemove} />
        <p className="mt-4 min-h-5 text-sm text-rose-300">{error}</p>
        <Button
          disabled={!file}
          onClick={onAnalyze}
          className="mt-2 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        >
          Analyze my CV <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
