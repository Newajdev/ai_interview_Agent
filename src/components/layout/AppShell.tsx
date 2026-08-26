import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
  eyebrow?: string;
};

export function AppShell({ children, eyebrow = "Personalized AI practice" }: AppShellProps) {
  return (
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
            {eyebrow}
          </span>
        </header>
        {children}
      </div>
    </main>
  );
}
