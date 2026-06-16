'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRepos } from '@/hooks/useRepos';
import { RepoCard } from './_components/RepoCard';
import { EmptyState } from './_components/EmptyState';
import { useRoastRepo } from '@/hooks/useRoastRepo';
import { useLogout } from '@/hooks/useLogout';

const handleConnect = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github/install/init`;
};

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { repos, isLoading: reposLoading, isError, error } = useRepos();
  const router = useRouter();
  const { logout, isPending: isLoggingOut } = useLogout();
  const { mutate: startRoast, isPending, variables, error: roastError } = useRoastRepo({
    onSuccess: ({ roastId }) => router.push(`/roast/status/${roastId}`),
  });

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <h1 className="text-[#EDEDED] font-bold text-xl">Hey, {user?.username} 👋</h1>
              <p className="text-[#888888] text-sm">Ready to get roasted?</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="text-sm text-[#888888] hover:text-[#EDEDED] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1E1E]">
              <svg width="36" height="36" viewBox="0 0 98 96" fill="#555555" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
              </svg>
            </div>
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
          <>
            {roastError && (
              <div className="mb-4 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {roastError.userMessage}
              </div>
            )}
            <div className="grid gap-3">
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isPending={isPending && variables?.repoName === repo.fullName.split('/')[1]}
                  onRoast={() => {
                    const [repoOwner, repoName] = repo.fullName.split('/')
                    startRoast({ repoOwner, repoName, defaultBranch: repo.defaultBranch })
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}

      </div>
    </div>
  );
}
