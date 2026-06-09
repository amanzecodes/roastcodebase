import { type Repo } from '@/hooks/useRepos';
import { LANGUAGE_COLORS } from '@/lib/languageColors';
import { timeAgo } from '@/lib/timeAgo';

export function RepoCard({ repo }: { repo: Repo }) {
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
