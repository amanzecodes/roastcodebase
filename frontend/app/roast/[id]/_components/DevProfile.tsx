import { type DeveloperClassification } from '../_types/roast';

interface DevProfileProps {
  profile: DeveloperClassification;
}

export function DevProfileCard({ profile }: DevProfileProps) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
      <h2 className="text-sm font-semibold text-[#555555] uppercase tracking-widest mb-5">
        Developer Classification
      </h2>

      <div className="rounded-lg border p-4 mb-5 border-[#FF4500]/20 bg-[#FF4500]/5">
        <p className="text-3xl font-bold tracking-tight text-[#FF4500]">{profile.title}</p>
        <p className="text-base text-[#666666] mt-1 italic">{profile.tagline}</p>
      </div>

      <div>
        <p className="text-sm text-[#444444] uppercase tracking-widest mb-3">Tell-tale signs</p>
        <ul className="space-y-2">
          {profile.tellTaleSigns.map((tell, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#333]" />
              <p className="text-base text-[#777777] leading-relaxed">{tell}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
