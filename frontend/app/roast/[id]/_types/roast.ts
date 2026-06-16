export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type RoastStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface DeveloperClassification {
  title: string;
  tagline: string;
  tellTaleSigns: string[];
}

export interface SecurityFinding {
  id: string;
  createdAt: Date;
  roastId: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  filePath: string | null;
  lineNumber: number | null;
}

export interface RoastResult {
  roastSummary: string;
  funnyObservations: string[];
  overallScore: number;
  codeQualityScore: number;
  securityScore: number;
  developerClassification: DeveloperClassification;
}

export interface Roast {
  id: string;
  createdAt: Date;
  result: RoastResult | null;
  userId: string;
  repoOwner: string;
  repoName: string;
  repoUrl: string;
  repoDescription: string | null;
  defaultBranch: string | null;
  fileCount: number | null;
  totalBytes: number | null;
  status: RoastStatus;
  shareSlug: string;
  isPublic: boolean;
  completedAt: Date | null;
  securityFindings: SecurityFinding[];
}
