import type { FindingSeverity } from "../../generated/prisma/enums.js";
import type { RoastResult } from "../services/roast.js";

const VALID_SEVERITIES = new Set<string>(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
export function validateRoastResult(raw: unknown): RoastResult {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Roast result must be an object');
  }

  const r = raw as Record<string, unknown>;

  if (typeof r.roastSummary !== 'string' || !r.roastSummary.trim()) {
    throw new Error('Invalid roastSummary');
  }
  if (
    !Array.isArray(r.funnyObservations) ||
    r.funnyObservations.length === 0 ||
    r.funnyObservations.some((o) => typeof o !== 'string')
  ) {
    throw new Error('Invalid funnyObservations');
  }

  for (const key of ['overallScore', 'codeQualityScore', 'securityScore'] as const) {
    if (typeof r[key] !== 'number' || !isFinite(r[key] as number)) {
      throw new Error(`Invalid ${key}`);
    }
  }

  const dc = r.developerClassification;
  if (!dc || typeof dc !== 'object') throw new Error('Invalid developerClassification');
  const d = dc as Record<string, unknown>;
  if (typeof d.title !== 'string' || !d.title.trim()) throw new Error('Invalid developerClassification.title');
  if (typeof d.tagline !== 'string' || !d.tagline.trim()) throw new Error('Invalid developerClassification.tagline');
  if (!Array.isArray(d.tellTaleSigns) || d.tellTaleSigns.some((s) => typeof s !== 'string')) {
    throw new Error('Invalid developerClassification.tellTaleSigns');
  }

  if (!Array.isArray(r.securityFindings)) throw new Error('Invalid securityFindings');
  for (const f of r.securityFindings) {
    if (!f || typeof f !== 'object') throw new Error('Invalid security finding entry');
    const finding = f as Record<string, unknown>;
    if (!VALID_SEVERITIES.has(finding.severity as string)) {
      throw new Error(`Invalid severity value: ${finding.severity}`);
    }
    if (typeof finding.category !== 'string') throw new Error('Invalid finding category');
    if (typeof finding.title !== 'string') throw new Error('Invalid finding title');
    if (typeof finding.description !== 'string') throw new Error('Invalid finding description');
    if (finding.filePath !== null && typeof finding.filePath !== 'string') {
      throw new Error('Invalid finding filePath');
    }
    if (finding.lineNumber !== null && typeof finding.lineNumber !== 'number') {
      throw new Error('Invalid finding lineNumber');
    }
  }

  const dc2 = r.developerClassification as Record<string, unknown>;
  return {
    roastSummary: r.roastSummary as string,
    funnyObservations: r.funnyObservations as string[],
    overallScore: Math.min(100, Math.max(1, Math.round(r.overallScore as number))),
    codeQualityScore: Math.min(100, Math.max(1, Math.round(r.codeQualityScore as number))),
    securityScore: Math.min(100, Math.max(1, Math.round(r.securityScore as number))),
    developerClassification: {
      title: dc2.title as string,
      tagline: dc2.tagline as string,
      tellTaleSigns: dc2.tellTaleSigns as string[],
    },
    securityFindings: (r.securityFindings as Array<Record<string, unknown>>).map((f) => ({
      severity: f.severity as FindingSeverity,
      category: f.category as string,
      title: f.title as string,
      description: f.description as string,
      filePath: (f.filePath as string | null) ?? null,
      lineNumber: (f.lineNumber as number | null) ?? null,
    })),
  };
}