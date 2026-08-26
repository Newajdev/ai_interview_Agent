import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateProfileCard } from "@/components/shared/CandidateProfileCard";
import type { Candidate } from "@/types/interview";

type ProfileScreenProps = {
  candidate: Candidate;
  onStart: () => void;
};

export function ProfileScreen({ candidate, onStart }: ProfileScreenProps) {
  return (
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
        <Button
          onClick={onStart}
          className="mt-9 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        >
          Start interview <ArrowRight />
        </Button>
      </div>
      <CandidateProfileCard candidate={candidate} />
    </section>
  );
}
