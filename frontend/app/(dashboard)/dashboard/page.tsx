'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRepos } from '@/hooks/useRepos';
import { RepoCard } from './_components/RepoCard';
import { EmptyState } from './_components/EmptyState';

const GITHUB_APP_INSTALL_URL = 'https://github.com/apps/roastcodebase/installations/new';

const handleConnect = () => {
  window.location.href = GITHUB_APP_INSTALL_URL;
};

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { repos, isLoading: reposLoading, isError, error } = useRepos();
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

        {/* Repos section header */}
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

        {/* Repo list states */}
        {reposLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-[#2A2A2A] bg-[#141414] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-8 text-center flex flex-col items-center gap-4">
            <p className="text-[#888888] text-sm">{error?.userMessage}</p>
            {error?.code === 'NOT_INSTALLED' && (
              <button
                onClick={handleConnect}
                className="rounded-lg bg-[#FF4500] cursor-pointer px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_0_0_#bf3400] active:translate-y-1 active:shadow-none"
              >
                Connect a repo
              </button>
            )}
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
