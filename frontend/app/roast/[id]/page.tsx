'use client'

import { useParams, useRouter } from 'next/navigation';
import { RoastHeader } from './_components/RoastHeader';
import { ScoreRing } from './_components/ScoreRing';
import { SummaryCard } from './_components/SummaryCard';
import { Observations } from './_components/Observations';
import { SecurityFindings } from './_components/SecurityFindings';
import { DevProfileCard } from './_components/DevProfile';
import { TableOfContents } from './_components/TableOfContents';
import { useGetRoast } from '@/hooks/useGetRoast';

export default function RoastPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useGetRoast(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] py-12 px-6">
        <div className="max-w-2xl mx-auto">

          {/* back + header */}
          <div className="mb-8">
            <div className="skeleton h-5 w-14 rounded-md mb-6" />
            <div className="skeleton h-4 w-44 rounded mb-3" />
            <div className="skeleton h-10 w-56 rounded" />
          </div>

          <div className="space-y-6">
            {/* score rings */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
              <div className="flex justify-around">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="skeleton w-24 h-24 rounded-full" />
                    <div className="skeleton h-3 w-20 rounded" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* summary */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
              <div className="skeleton h-3 w-28 rounded mb-4" />
              <div className="pl-4 border-l-2 border-[#2A2A2A] space-y-2.5">
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-5 w-4/5 rounded" />
              </div>
            </div>

            {/* dev profile */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
              <div className="skeleton h-3 w-44 rounded mb-5" />
              <div className="rounded-lg border border-[#2A2A2A] p-4 mb-5">
                <div className="skeleton h-8 w-48 rounded mb-2" />
                <div className="skeleton h-4 w-72 rounded" />
              </div>
              <div className="skeleton h-3 w-24 rounded mb-3" />
              <div className="space-y-3">
                {[100, 88, 94, 80].map((w, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="skeleton mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" />
                    <div className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* observations */}
            <div className="space-y-3">
              {[96, 88, 100, 82].map((w, i) => (
                <div key={i} className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-4 flex gap-4 items-start">
                  <div className="skeleton h-4 w-6 rounded shrink-0" />
                  <div className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>

            {/* security findings */}
            <div>
              <div className="skeleton h-3 w-32 rounded mb-4" />
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-[#2A2A2A] p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="skeleton h-5 w-52 rounded" />
                      <div className="skeleton h-5 w-16 rounded-full" />
                    </div>
                    <div className="skeleton h-3 w-28 rounded mb-3" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#555555]">{error.message}</p>
      </div>
    );
  }

  if (!data || !data.result) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#555555]">Failed to load roast.</p>
      </div>
    );
  }

  const result = data.result;

  return (
    <div className="min-h-screen bg-[#0F0F0F] py-12 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center cursor-pointer gap-2 text-sm text-[#555555] hover:text-[#EDEDED] transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" />
            </svg>
            Back
          </button>
          <RoastHeader repo={`${data.repoOwner}/${data.repoName}`} />
        </div>

        <div className="space-y-6">
            <div id="scores" className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 scroll-mt-8">
              <div className="flex justify-around">
                <ScoreRing score={result.overallScore} label="Overall" />
                <ScoreRing score={result.codeQualityScore} label="Code Quality" />
                <ScoreRing score={result.securityScore} label="Security" />
              </div>
            </div>

            <div id="summary"><SummaryCard summary={result.roastSummary} /></div>
            <div id="developer"><DevProfileCard profile={result.developerClassification} /></div>
            <div id="observations"><Observations observations={result.funnyObservations} /></div>
            <div id="security"><SecurityFindings findings={data.securityFindings} /></div>

            <p className="text-center text-sm text-[#2A2A2A] pb-4">
              Generated by Singe &mdash; powered by Claude AI
            </p>
        </div>

        <TableOfContents />

      </div>
    </div>
  );
}
