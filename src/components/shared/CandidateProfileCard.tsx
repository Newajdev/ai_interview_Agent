import { Mail, Phone, UserRound } from "lucide-react";
import type { Candidate } from "@/types/interview";

type CandidateProfileCardProps = {
  candidate: Candidate;
};

export function CandidateProfileCard({ candidate }: CandidateProfileCardProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-semibold tracking-widest text-slate-400">
        CANDIDATE PROFILE
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
          <UserRound size={20} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold">
            {candidate.name ?? "Your profile"}
          </h2>
          <p className="text-cyan-300">
            {candidate.professionalTitle ?? "Professional candidate"}
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-2 text-sm text-slate-400">
        <p className="flex items-center gap-2">
          <Mail size={15} />
          {candidate.email ?? "Email not detected"}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={15} />
          {candidate.phone ?? "Phone not detected"}
        </p>
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {candidate.skills.length ? (
          candidate.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">
            No skills could be reliably extracted.
          </span>
        )}
      </div>
    </aside>
  );
}
