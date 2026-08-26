import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultSteps = [
  "Uploading your CV",
  "Extracting document content",
  "Analyzing your experience",
  "Identifying technical skills",
  "Preparing your personalized interview",
];

type ProcessingStepsProps = {
  activeStep?: number;
  steps?: string[];
};

export function ProcessingSteps({ activeStep = 1, steps = defaultSteps }: ProcessingStepsProps) {
  return (
    <div className="mt-10 space-y-5" aria-live="polite">
      {steps.map((step, index) => {
        const complete = index < activeStep;
        const active = index === activeStep;
        return (
          <div key={step} className={cn("flex items-center gap-4", complete || active ? "text-slate-200" : "text-slate-500")}>
            <span className={cn("grid h-7 w-7 place-items-center rounded-full", complete ? "bg-emerald-300 text-slate-950" : active ? "bg-cyan-300 text-slate-950" : "bg-white/10")}>
              {complete ? <Check size={15} /> : active ? <LoaderCircle size={15} className="animate-spin" /> : index + 1}
            </span>
            {step}
          </div>
        );
      })}
    </div>
  );
}
