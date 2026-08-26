import { ProcessingSteps } from "@/components/shared/ProcessingSteps";

export function ProcessingScreen() {
  return (
    <section className="mx-auto max-w-xl pt-12">
      <p className="text-sm font-semibold tracking-widest text-cyan-300">
        CV ANALYSIS
      </p>
      <h1 className="mt-3 text-4xl font-semibold">
        Building your interview brief.
      </h1>
      <ProcessingSteps />
    </section>
  );
}
