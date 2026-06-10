interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="relative rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 overflow-hidden">    
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-widest">Roast Summary</h2>
        </div>
        <p className="text-[#CCCCCC] text-base leading-relaxed pl-4 border-l-2 border-[#FF4500] italic">
          {summary}
        </p>
      </div>
    </div>
  );
}
