interface ObservationsProps {
  observations: string[];
}

export function Observations({ observations }: ObservationsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-[#555555] uppercase tracking-widest">Observations</h2>
      </div>
      <div className="space-y-3">
        {observations.map((obs, i) => (
          <div
            key={i}
            className="group flex gap-4 rounded-xl border border-[#1E1E1E] bg-[#141414] p-4 transition-colors hover:border-[#2A2A2A] hover:bg-[#171717]"
          >
            <span className="shrink-0 mt-0.5 text-sm font-bold font-mono text-[#FF4500] opacity-60 group-hover:opacity-100 transition-opacity">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-base text-[#888888] leading-relaxed group-hover:text-[#AAAAAA] transition-colors">
              {obs}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
