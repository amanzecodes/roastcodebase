import Anthropic from "@anthropic-ai/sdk";
import { type RepoFile } from "./github.js";
import type { SecurityFinding } from "../../generated/prisma/client.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface DeveloperClassification {
  title: string;
  tagline: string;
  tellTaleSigns: string[];
}

export interface RoastResult {
  roastSummary: string;
  funnyObservations: string[];
  overallScore: number;
  codeQualityScore: number;
  securityScore: number;
  developerClassification: DeveloperClassification;
  securityFindings: SecurityFinding[];
}

function buildPrompt(owner: string, repo: string, files: RepoFile[]): string {
  const fileTree = files
    .map((f) => `${f.path} (${f.language || "unknown"})`)
    .join("\n");

  const fileContents = files
    .map(
      (f) => `
=== ${f.path} ===
${f.content}
`,
    )
    .join("\n");

  return `You are a savage but brilliant senior engineer doing a code review. You have been given access to a GitHub repository and your job is to:
1. Roast the codebase ruthlessly but accurately — point out bad patterns, lazy code, rookie mistakes, tech debt, and anything that would make a senior engineer cry.
2. Identify real security vulnerabilities — hardcoded secrets, SQL injection risks, missing auth checks, exposed env vars, insecure dependencies, etc.
3. Classify the developer based on code quality, architecture decisions, patterns used, naming conventions, error handling, security awareness, and overall maturity of the codebase.

Repository: ${owner}/${repo}

File tree:
${fileTree}

File contents:
${fileContents}

For the developer classification, pick ONE from the following list that best fits:
- "Junior Software Engineer" — basic mistakes, copy-paste code, no error handling, inconsistent naming
- "Mid-Level Software Engineer" — decent structure, some good patterns but inconsistencies, room to grow
- "Senior Software Engineer" — clean architecture, solid error handling, security aware, well structured
- "Vibe Coder" — clearly AI-generated or vibe coded, ships fast but the code is a mess underneath
- "Intern Escaped Into Production" — dangerously bad, should not be near a keyboard
- "Tutorial Follower" — everything looks like it was copied from a YouTube tutorial, no original thought
- "Overengineered Architect" — 47 abstractions for a to-do app, read too many design pattern books
- "Copy Paste Engineer" — stack overflow driven development, inconsistent patterns everywhere
- "The Lone Wolf" — no comments, no docs, no tests, only they understand this code
- "10x Developer (Self-Proclaimed)" — complex for no reason, clever code that nobody else can read

Each classification must have a short savage tagline and 4-5 tell-tale signs spotted in the actual code.

Respond ONLY with a valid JSON object matching this exact schema. No preamble, no markdown, no backticks — raw JSON only:

{
  "roastSummary": "A 2-3 sentence savage overall verdict on the codebase",
  "funnyObservations": [
    "Specific funny but accurate observation about the code",
    "Another observation",
    "At least 5 observations total"
  ],
  "overallScore": <number 1-100>,
  "codeQualityScore": <number 1-100>,
  "securityScore": <number 1-100>,
  "developerClassification": {
    "title": "One of the classification titles above",
    "tagline": "A short savage tagline for this classification",
    "tellTaleSigns": [
      "Specific thing spotted in this actual codebase",
      "Another specific thing",
      "At least 4 signs total"
    ]
  },
  "securityFindings": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFO",
      "category": "e.g. Hardcoded Secret, SQL Injection, Missing Auth, etc.",
      "title": "Short title of the finding",
      "description": "Clear explanation of the vulnerability and why it is dangerous",
      "filePath": "path/to/file.ts or null",
      "lineNumber": null
    }
  ]
}`;

}

export async function generateRoast(
  owner: string,
  repo: string,
  files: RepoFile[],
): Promise<RoastResult> {
  const prompt = buildPrompt(owner, repo, files);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();

  let result: RoastResult;
  try {
    result = JSON.parse(clean);
  } catch {
    throw new Error(`Claude returned invalid JSON: ${clean.slice(0, 200)}`);
  }

  return result;
}
