const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function scoreGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

function scoreTagline(score: number): string {
  if (score >= 80) return 'Actually decent';
  if (score >= 60) return 'Not terrible';
  if (score >= 40) return 'Needs work';
  if (score >= 20) return 'Needs prayer';
  return 'Delete the repo';
}

interface ScoreRingProps {
  score: number;
  label: string;
}

export function ScoreRing({ score, label }: ScoreRingProps) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <svg width="96" height="96" className="-rotate-90">
          <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#1E1E1E" strokeWidth="8" />
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="text-2xl font-bold text-[#EDEDED]">{score}</span>
          <span className="text-sm font-bold mt-0.5" style={{ color }}>{scoreGrade(score)}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-[#666666] uppercase tracking-widest">{label}</p>
        <p className="text-sm text-[#444444] mt-0.5 italic">{scoreTagline(score)}</p>
      </div>
    </div>
  );
}
