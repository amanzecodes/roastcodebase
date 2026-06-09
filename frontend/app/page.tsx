import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description:
      "Authenticate with your GitHub account to give Singe access to your repositories.",
  },
  {
    number: "02",
    title: "Select a Repository",
    description:
      "Choose any public or private repository you want to put under the microscope.",
  },
  {
    number: "03",
    title: "Get Roasted",
    description:
      "Receive brutally honest, line-by-line feedback on your code quality, patterns, and decisions.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans flex flex-col">
      {/* Nav */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/singe.png"
            alt="Singe"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm font-medium uppercase tracking-widest text-white/80">
            Singe
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm text-white/60 border border-white/20 px-4 py-1.5 rounded"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-2xl mx-auto w-full">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
          Code review, no filter
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-5">
          Brutal feedback
          <br />
          for your codebase.
        </h1>
        <p className="text-base text-white/50 max-w-md mb-10">
          Singe connects to your GitHub repositories and delivers unfiltered,
          AI-powered feedback on your code — no hand-holding, no pleasantries.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2.5 bg-white text-black text-sm font-medium px-6 py-3 rounded"
        >
          <FaGithub size={16} />
          Get started with GitHub
        </Link>
      </section>

      {/* Steps */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-12 text-center">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-[#0F0F0F] px-8 py-10 flex flex-col gap-4"
              >
                <span className="font-mono text-xs text-white/30">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} Singe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
