import { Octokit } from "@octokit/rest";
import getAppOctokit from "../util/getAppOctokit.js";
import getLanguage from "../util/getLanguage.js";

const ALLOWED_EXTENSIONS = [
  // JavaScript / TypeScript
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  // Python
  '.py', '.pyw',
  // Ruby
  '.rb', '.rake', '.gemspec',
  // PHP
  '.php', '.phtml',
  // Java
  '.java',
  // Kotlin
  '.kt', '.kts',
  // Swift
  '.swift',
  // Dart / Flutter
  '.dart',
  // Go
  '.go',
  // Rust
  '.rs',
  // C / C++
  '.c', '.h', '.cpp', '.hpp', '.cc', '.hh',
  // C#
  '.cs',
  // Scala
  '.scala', '.sc',
  // Elixir / Erlang
  '.ex', '.exs', '.erl', '.hrl',
  // Haskell
  '.hs', '.lhs',
  // Lua
  '.lua',
  // R
  '.r', '.R',
  // Shell
  '.sh', '.bash', '.zsh', '.fish', '.ps1',
  // Config / Data
  '.json', '.toml', '.yaml', '.yml', '.xml', '.ini', '.cfg', '.conf',
  // Database
  '.sql', '.prisma',
  // Infrastructure
  '.tf', '.hcl',
  // Mobile
  '.gradle', '.pbxproj', '.xcconfig',
  // Web
  '.html', '.css', '.scss', '.sass', '.less', '.svelte', '.vue',
  // Docs
  '.md', '.mdx', '.txt', '.rst',
  // Env
  '.env', '.env.example', '.env.sample',
  // Docker / CI
  '.dockerfile',
];


const IGNORED_PATHS = [
  // JavaScript
  'node_modules', '.next', '.nuxt', '.svelte-kit',
  // Python
  'venv', '.venv', 'env', '__pycache__', '.eggs', 'egg-info', '.pytest_cache', '.mypy_cache',
  // Ruby
  '.bundle',
  // Java / Kotlin / Android
  '.gradle', 'gradle', 'build', 'captures', '.externalNativeBuild',
  // iOS / Swift
  'Pods', 'DerivedData', '.build', 'xcuserdata',
  // Dart / Flutter
  '.dart_tool', '.flutter-plugins', '.flutter-plugins-dependencies',
  // Rust
  'target',
  // Go
  'vendor',
  // PHP
  'vendor',
  // General build output
  'dist', 'out', 'bin', 'obj', '.cache', 'coverage', '.nyc_output',
  // Version control
  '.git',
  // IDE
  '.idea', '.vscode',
  // Lock files
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'Gemfile.lock', 'poetry.lock', 'Cargo.lock', 'composer.lock',
  'pubspec.lock',
];

const MAX_FILES = 50;
const MAX_TOTAL_BYTES = 100_000; // 100KB

export interface RepoFile {
  path: string;
  content: string;
  sizeBytes: number;
  language: string | null;
}

function shouldIgnore(path: string): boolean {
  return IGNORED_PATHS.some((ignored) => path.includes(ignored));
}

function hasAllowedExtension(path: string): boolean {
  return ALLOWED_EXTENSIONS.some((ext) => path.endsWith(ext));
}

export async function getInstallationOctokit(
  installationId: string,
): Promise<Octokit> {
  const appOctokit = getAppOctokit();

  const { token } = (await appOctokit.auth({
    type: "installation",
    installationId: parseInt(installationId),
  })) as { token: string };

  return new Octokit({ auth: token });
}

export async function fetchRepoFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  defaultBranch: string,
): Promise<RepoFile[]> {
  //Fetch full file tree
  const { data } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: "1",
  });

  //Filter to only scannable file
  const candidates = data.tree.filter(
    (item) =>
      item.type === "blob" &&
      item.path &&
      !shouldIgnore(item.path) &&
      hasAllowedExtension(item.path),
  );

  const priority = [
  // Docs
  'README.md', 'README.mdx', 'README.txt', 'README.rst',
  // JavaScript / TypeScript
  'package.json', 'tsconfig.json',
  // Python
  'requirements.txt', 'pyproject.toml', 'setup.py', 'Pipfile',
  // Ruby
  'Gemfile',
  // PHP
  'composer.json',
  // Go
  'go.mod',
  // Rust
  'Cargo.toml',
  // Dart / Flutter
  'pubspec.yaml',
  // Java / Kotlin
  'pom.xml', 'build.gradle', 'settings.gradle',
  // Swift / iOS
  'Package.swift', 'Podfile',
  // C#
  '.csproj', '.sln',
  // Scala
  'build.sbt',
  // Elixir
  'mix.exs',
  // Env files
  '.env.example', '.env.sample',
  // Database / ORM
  'prisma/schema.prisma', 'schema.sql', 'database.yml',
  // Infra / CI
  'docker-compose.yml', 'Dockerfile', '.github/workflows',
  'terraform.tf', 'serverless.yml',
];

  candidates.sort((a, b) => {
    const aP = priority.findIndex((p) => a.path?.endsWith(p));
    const bP = priority.findIndex((p) => b.path?.endsWith(p));
    if (aP !== -1 && bP === -1) return -1;
    if (bP !== -1 && aP === -1) return 1;
    return 0;
  });

  const files: RepoFile[] = [];
  let totalBytes = 0;

  for (const item of candidates) {
    if (files.length >= MAX_FILES) break;
    if (totalBytes >= MAX_TOTAL_BYTES) break;

    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: item.path!,
      });

      if ('content' in fileData && fileData.encoding === 'base64') {
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        const sizeBytes = content.length;

        // Skip single files over 20KB
        if (sizeBytes > 20_000) continue;

        totalBytes += sizeBytes;
        files.push({
          path: item.path!,
          content,
          sizeBytes,
          language: getLanguage(item.path!),
        });
      }
    } catch {
      // skip files that fail to fetch
      continue;
    }
  }

  return files;
}