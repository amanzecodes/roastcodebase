'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'scores',       label: 'Scores' },
  { id: 'summary',      label: 'Summary' },
  { id: 'developer',    label: 'Developer' },
  { id: 'observations', label: 'Observations' },
  { id: 'security',     label: 'Security' },
] as const;

export function TableOfContents() {
  const [active, setActive] = useState<string>('scores');

  useEffect(() => {
    const onScroll = () => {
      const triggerY = window.scrollY + window.innerHeight * 0.35;
      let activeId: string = SECTIONS[0].id;

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (triggerY >= top) activeId = id;
      }

      setActive(activeId);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="fixed top-12 right-8 w-44 hidden lg:block">
      <p className="text-xs text-[#444444] uppercase tracking-widest mb-3 font-medium">On This Page</p>
      <nav className="flex flex-col gap-1">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`text-left text-sm transition-colors duration-150 py-0.5 cursor-pointer ${
              active === id
                ? 'text-[#EDEDED] font-medium'
                : 'text-[#3A3A3A] hover:text-[#777777]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
