import { type SecurityFinding, type Severity } from '../_types/roast';

const SEVERITY_STYLES: Record<Severity, { badge: string; dot: string; cardBorder: string; cardBg: string }> = {
  CRITICAL: {
    badge:      'bg-red-500/10 text-red-400 border border-red-500/20',
    dot:        'bg-red-500',
    cardBorder: 'border-red-500/20',
    cardBg:     'bg-red-500/5',
  },
  HIGH: {
    badge:      'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    dot:        'bg-orange-500',
    cardBorder: 'border-orange-500/10',
    cardBg:     'bg-[#0F0F0F]',
  },
  MEDIUM: {
    badge:      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    dot:        'bg-yellow-500',
    cardBorder: 'border-[#222]',
    cardBg:     'bg-[#0F0F0F]',
  },
  LOW: {
    badge:      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot:        'bg-blue-400',
    cardBorder: 'border-[#222]',
    cardBg:     'bg-[#0F0F0F]',
  },
  INFO: {
    badge:      'bg-[#2A2A2A] text-[#888888] border border-[#333]',
    dot:        'bg-[#555]',
    cardBorder: 'border-[#1E1E1E]',
    cardBg:     'bg-[#0F0F0F]',
  },
};

const FileIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="#555">
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
  </svg>
);

function FindingCard({ finding }: { finding: SecurityFinding }) {
  const styles = SEVERITY_STYLES[finding.severity];
  const isCritical = finding.severity === 'CRITICAL';

  return (
    <div className={`rounded-lg border p-4 ${styles.cardBorder} ${styles.cardBg}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {isCritical ? (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          ) : (
            <span className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${styles.dot}`} />
          )}
          <span className="text-base font-semibold text-[#EDEDED] truncate">{finding.title}</span>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
          {finding.severity}
        </span>
      </div>
      <p className="text-sm text-[#555555] mb-2 font-medium">{finding.category}</p>
      <p className="text-base text-[#777777] leading-relaxed">{finding.description}</p>
      {(finding.filePath || finding.lineNumber) && (
        <div className="mt-3 flex items-center gap-1.5">
          <FileIcon />
          <code className="text-sm text-[#555555] font-mono">
            {finding.filePath}
            {finding.lineNumber ? `:${finding.lineNumber}` : ''}
          </code>
        </div>
      )}
    </div>
  );
}

interface SecurityFindingsProps {
  findings: SecurityFinding[];
}

export function SecurityFindings({ findings }: SecurityFindingsProps) {
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#555555] uppercase tracking-widest">Security Findings</h2>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {highCount} high
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {findings.map((finding, i) => (
          <FindingCard key={i} finding={finding} />
        ))}
      </div>
    </div>
  );
}
