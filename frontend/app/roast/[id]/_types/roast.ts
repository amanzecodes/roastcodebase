export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type DevLevel = 'NEWBIE' | 'JUNIOR' | 'VIBE_CODER' | 'MID_LEVEL' | 'SENIOR';

export interface DevProfile {
  level: DevLevel;
  label: string;
  tagline: string;
  tells: string[];
}

export interface SecurityFinding {
  severity: Severity;
  category: string;
  title: string;
  description: string;
  filePath: string | null;
  lineNumber: number | null;
}

export interface RoastResult {
  repo: string;
  roastSummary: string;
  funnyObservations: string[];
  overallScore: number;
  codeQualityScore: number;
  securityScore: number;
  securityFindings: SecurityFinding[];
  devProfile: DevProfile;
}
