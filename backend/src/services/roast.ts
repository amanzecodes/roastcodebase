import Anthropic from "@anthropic-ai/sdk";
import { type RepoFile } from "./github.js";
import type { FindingSeverity } from "../../generated/prisma/client.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface DeveloperClassification {
  title: string;
  tagline: string;
  tellTaleSigns: string[];
}

export interface RoastSecurityFinding {
  severity: FindingSeverity;
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
  securityFindings: RoastSecurityFinding[];
}

const submitRoastTool: Anthropic.Tool = {
  name: "submit_roast",
  description: "Submit the completed roast analysis results for the repository",
  input_schema: {
    type: "object",
    properties: {
      roastSummary: {
        type: "string",
        description: "A 2-3 sentence savage overall verdict on the codebase",
      },
      funnyObservations: {
        type: "array",
        items: { type: "string" },
        description: "At least 5 specific funny but accurate observations about the code",
      },
      overallScore: { type: "number", description: "Overall score 1-100" },
      codeQualityScore: { type: "number", description: "Code quality score 1-100" },
      securityScore: { type: "number", description: "Security score 1-100" },
      developerClassification: {
        type: "object",
        properties: {
          title: { type: "string" },
          tagline: { type: "string" },
          tellTaleSigns: { type: "array", items: { type: "string" } },
        },
        required: ["title", "tagline", "tellTaleSigns"],
      },
      securityFindings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            severity: {
              type: "string",
              enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
            },
            category: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            filePath: { anyOf: [{ type: "string" }, { type: "null" }] },
            lineNumber: { anyOf: [{ type: "number" }, { type: "null" }] },
          },
          required: ["severity", "category", "title", "description", "filePath", "lineNumber"],
        },
      },
    },
    required: [
      "roastSummary",
      "funnyObservations",
      "overallScore",
      "codeQualityScore",
      "securityScore",
      "developerClassification",
      "securityFindings",
    ],
  },
};

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

When you have finished the analysis, call the submit_roast tool with your findings.`;
}

export async function generateRoast(
  owner: string,
  repo: string,
  files: RepoFile[],
): Promise<RoastResult> {
  const prompt = buildPrompt(owner, repo, files);

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    tools: [submitRoastTool],
    tool_choice: { type: "tool", name: "submit_roast" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUseBlock = message.content.find((b) => b.type === "tool_use");

  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block");
  }

  return toolUseBlock.input as RoastResult;
}
