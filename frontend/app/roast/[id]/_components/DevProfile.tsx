import { type DevProfile, type DevLevel } from '../_types/roast';

const LEVEL_STYLES: Record<DevLevel, { accent: string; muted: string }> = {
  NEWBIE:     { accent: 'text-purple-400',  muted: 'border-purple-500/20 bg-purple-500/5' },
  JUNIOR:     { accent: 'text-blue-400',    muted: 'border-blue-500/20 bg-blue-500/5' },
  VIBE_CODER: { accent: 'text-[#FF4500]',  muted: 'border-[#FF4500]/20 bg-[#FF4500]/5' },
  MID_LEVEL:  { accent: 'text-yellow-400', muted: 'border-yellow-500/20 bg-yellow-500/5' },
  SENIOR:     { accent: 'text-green-400',  muted: 'border-green-500/20 bg-green-500/5' },
};

interface DevProfileProps {
  profile: DevProfile;
}

export function DevProfileCard({ profile }: DevProfileProps) {
  const styles = LEVEL_STYLES[profile.level];

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
      <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-widest mb-5">
        Developer Classification
      </h2>

      <div className={`rounded-lg border p-4 mb-5 ${styles.muted}`}>
        <p className={`text-2xl font-bold tracking-tight ${styles.accent}`}>{profile.label}</p>
        <p className="text-sm text-[#666666] mt-1 italic">{profile.tagline}</p>
      </div>

      <div>
        <p className="text-xs text-[#444444] uppercase tracking-widest mb-3">Tell-tale signs</p>
        <ul className="space-y-2">
          {profile.tells.map((tell, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#333]" />
              <p className="text-sm text-[#777777] leading-relaxed">{tell}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
