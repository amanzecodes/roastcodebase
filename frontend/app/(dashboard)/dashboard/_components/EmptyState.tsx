const GITHUB_APP_INSTALL_URL = 'https://github.com/apps/roastcodebase/installations/new';

export function EmptyState() {
  const handleConnect = () => {
    window.location.href = GITHUB_APP_INSTALL_URL;
  };

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
