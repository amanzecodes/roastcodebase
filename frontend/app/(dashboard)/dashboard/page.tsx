'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRepos } from '@/hooks/useRepos';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  language: string | null;
  starCount: number;
  updatedAt: string;
  defaultBranch: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#701516',
  'C++': '#f34b7d',
  C: '#555555',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}yr ago`;
}

function RepoCard({ repo }: { repo: Repo }) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? '#888888') : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 transition-colors hover:border-[#3A3A3A] hover:bg-[#1A1A1A]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="shrink-0 text-[#555]" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
          </svg>
          <span className="truncate font-medium text-[#EDEDED] text-sm">{repo.name}</span>
          {repo.private && (
            <span className="shrink-0 rounded-full border border-[#2A2A2A] px-2 py-0.5 text-[10px] text-[#888888]">
              Private
            </span>
          )}
        </div>
        <button className="shrink-0 rounded-lg cursor-pointer bg-[#FF4500] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_0_0_#bf3400] transition-all hover:bg-[#e03e00] active:translate-y-1 active:shadow-none">
          Roast it
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#666666]">
        {langColor && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
          </svg>
          {repo.starCount}
        </span>
        <span>Updated {timeAgo(repo.updatedAt)}</span>
      </div>
    </div>
  );
}

const handleConnect = () => {
  window.location.href = `https://github.com/apps/roastcodebase/installations/new`;
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] bg-[#141414] py-20 px-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E1E1E]">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#555555">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
        </svg>
      </div>
      <h3 className="mb-2 font-semibold text-[#EDEDED]">No repos connected yet</h3>
      <p className="mb-6 max-w-xs text-sm text-[#666666]">
        Connect a GitHub repo via the GitHub App to let us tear your code apart.
      </p>
      <button
        onClick={handleConnect}
        className="rounded-lg bg-[#FF4500] cursor-pointer px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_0_0_#bf3400] transition-all hover:bg-[#e03e00] active:translate-y-1 active:shadow-none"
      >
        Connect a repo
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { repos, isLoading: reposLoading, isError } = useRepos();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#888888]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {user?.avatarUrl && (
            <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <h1 className="text-[#EDEDED] font-bold text-xl">Hey, {user?.username} 👋</h1>
            <p className="text-[#888888] text-sm">Ready to get roasted?</p>
          </div>
        </div>

        {/* Connected Repos */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[#EDEDED] font-semibold text-lg">Connected repos</h2>
            <p className="text-[#666666] text-sm mt-0.5">
              {reposLoading
                ? 'Loading...'
                : repos && repos.length > 0
                  ? `${repos.length} repo${repos.length !== 1 ? 's' : ''} connected`
                  : 'No repos connected'}
            </p>
          </div>
          {repos && repos.length > 0 && (
            <button
              onClick={handleConnect}
              aria-label="Connect a repo via GitHub"
              className="flex items-center gap-2 cursor-pointer rounded-lg bg-[#FF4500] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_0_0_#bf3400] transition-all hover:bg-[#e03e00] active:translate-y-1 active:shadow-none"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Connect repo
            </button>
          )}
        </div>

        {reposLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-[#2A2A2A] bg-[#141414] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-8 text-center">
            <p className="text-[#888888] text-sm">Failed to load repos. Try refreshing the page.</p>
          </div>
        ) : repos && repos.length > 0 ? (
          <div className="grid gap-3">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
