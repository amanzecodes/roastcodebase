'use client'

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetRoastStatus } from '@/hooks/useGetRoastStatus';

const MESSAGES = [
  'Fetching your shameful commits...',
  "Counting the TODOs you'll never fix...",
  'Asking Claude to be brutally honest...',
  'Calculating your technical debt...',
  'Preparing the roast of a lifetime...',
  'Reading files you hoped no one would see...',
  'Judging your variable naming choices...',
  'Tallying your missing error handlers...',
];

const STEPS = [
  { label: 'Queueing',  description: 'Setting up session'  },
  { label: 'Scanning',  description: 'Fetching codebase'   },
  { label: 'Roasting',  description: 'AI analysis'         },
];

const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

function displayStepIndex(status: string, phase: number): number {
  if (status === 'PENDING')     return 0;
  if (status === 'PROCESSING')  return phase === 0 ? 1 : 2;
  return 3;
}

export default function RoastStatusPage() {
  const { roastId } = useParams<{ roastId: string }>();
  const router = useRouter();

  const [msgIdx, setMsgIdx]       = useState(0);
  const [phase, setPhase]         = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const stepStartRef              = useRef(Date.now());

  const { data, error } = useGetRoastStatus(roastId);

  // Cycle loading messages
  useEffect(() => {
    const id = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (data?.status === 'PROCESSING' && phase === 0) {
      const id = setTimeout(() => setPhase(1), 15_000);
      return () => clearTimeout(id);
    }
  }, [data?.status, phase]);

  useEffect(() => {
    if (data?.status === 'DONE' && data.shareSlug) {
      const id = setTimeout(() => router.replace(`/roast/${data.shareSlug}`), 700);
      return () => clearTimeout(id);
    }
  }, [data, router]);

  // Advance displayStep with a minimum dwell per step so Queueing is always visible
  const serverStep = data ? displayStepIndex(data.status, phase) : 0;
  useEffect(() => {
    if (serverStep <= displayStep) return;
    const elapsed = Date.now() - stepStartRef.current;
    const delay = Math.max(0, 1500 - elapsed);
    const id = setTimeout(() => {
      setDisplayStep(s => s + 1);
      stepStartRef.current = Date.now();
    }, delay);
    return () => clearTimeout(id);
  }, [serverStep, displayStep]);

  const isFailed  = data?.status === 'FAILED';
  const isDone    = data?.status === 'DONE';
  const isLoading = !isFailed && !isDone;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#888888] text-lg">{error.message}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-[#555555] hover:text-[#EDEDED] transition-colors cursor-pointer"
        >
          ← Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 gap-10">

      
      <div className="relative flex items-center justify-center">
        <svg
          width="140"
          height="140"
          className={isLoading ? 'animate-spin' : ''}
          style={{ animationDuration: '2.2s' }}
        >
          <circle cx="70" cy="70" r={RING_R} fill="none" stroke="#1A1A1A" strokeWidth="8" />
          <circle
            cx="70"
            cy="70"
            r={RING_R}
            fill="none"
            stroke={isFailed ? '#ef4444' : '#FF4500'}
            strokeWidth="8"
            strokeDasharray={RING_C}
            strokeDashoffset={isDone ? 0 : RING_C * 0.72}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute">
          <svg width="30" height="30" viewBox="0 0 24 24" fill={isFailed ? '#ef4444' : '#FF4500'}>
            <path d="M12 23C8.1 23 5 19.9 5 16c0-4.6 4-8.4 4-8.4s-.3 2.8 1 4.2c.7-3.9 3.5-7.3 3.5-7.3s.6 3.1 2.5 4.8c.5-1.8.2-4.3.2-4.3s2.8 2.1 3.8 5.4c.3 1.1.5 2.4.5 3.6 0 3.9-3.1 7-7 7z" />
          </svg>
        </div>
      </div>

      {isFailed ? (
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold text-[#EDEDED]">Roast failed</p>
          <p className="text-[#666666] text-base max-w-sm">
            {data?.errorMessage ?? 'Something went wrong while processing your roast.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-2 text-sm text-[#555555] hover:text-[#EDEDED] transition-colors cursor-pointer"
          >
            ← Back to dashboard
          </button>
        </div>
      ) : isDone ? (
        <p className="text-base text-[#888888]">Roast complete. Redirecting...</p>
      ) : (
        <>
          {/* Cycling message */}
          <p
            key={msgIdx}
            className="text-base text-[#888888] text-center max-w-xs animate-fade-in-up"
          >
            {MESSAGES[msgIdx]}
          </p>

          {/* Step progress */}
          <div className="flex items-start">
            {STEPS.map((step, i) => {
              const done   = i < displayStep;
              const active = i === displayStep;
              return (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center w-24">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      done   ? 'border-[#FF4500] bg-[#FF4500]/10' :
                      active ? 'border-[#FF4500] bg-[#FF4500]/10 animate-pulse' :
                               'border-[#2A2A2A] bg-transparent'
                    }`}>
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#FF4500">
                          <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                        </svg>
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#FF4500]' : 'bg-[#2A2A2A]'}`} />
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-medium text-center transition-colors duration-500 ${active || done ? 'text-[#EDEDED]' : 'text-[#444444]'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 text-center transition-colors duration-500 ${active ? 'text-[#666666]' : 'text-[#333333]'}`}>
                      {step.description}
                    </p>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-px mt-3.5 transition-all duration-500 ${i < displayStep ? 'bg-[#FF4500]/40' : 'bg-[#2A2A2A]'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
