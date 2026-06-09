"use client";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleGitHubLogin = () => {
    const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/g, "");
    const target = base ? `${base}/auth/github` : `/auth/github`;
    window.location.href = target;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#888888]">Loading...</p>
      </div>
    );
  }

  return (
    <section className="relative dark min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-full bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(255,255,255,0.06),transparent)]" />
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-md text-center">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <Image
              src="/singe.png"
              alt="Logo"
              width={84}
              height={84}
              className="rounded-full"
            />
            <span className="text-lg uppercase">Singe</span>
          </div>

          <h1 className="font-bold text-2xl sm:text-3xl">
            Think Your CodeBase Is Good? Prove It.
          </h1>
          <p className="text-sm sm:text-base text-[#888888]">
            Get Brutally Honest Feedback on Your CodeBase.
          </p>
        </div>

        <Button
          onClick={handleGitHubLogin}
          className="p-5 cursor-pointer w-full sm:w-64 h-4 flex flex-row gap-3 active:translate-y-1 transition-all duration-100 ease-out"
          style={{
            boxShadow:
              "0 5px 0 rgba(90,90,90,0.7), 0 10px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <FaGithub />
          Continue with Github
        </Button>
      </div>
    </section>
  );
};

export default page;
