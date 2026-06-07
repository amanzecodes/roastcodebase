import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

const page = () => {
  return (
    <section className="relative dark min-h-screen flex items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-full bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(255,255,255,0.06),transparent)]" />
      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <Image
              src="/singe.png"
              alt="Logo"
              width={84}
              height={84}
              className="rounded-full"
            />
          </div>

          <h1 className="font-bold text-3xl">
            Think Your CodeBase Is Good? Prove It.
          </h1>
          <div className="flex items-center justify-center">
          <p>Get Brutally Honest Feedback on Your CodeBase.</p>
          </div>
        </div>

        <Button
          className="p-5 cursor-pointer w-2xs h-4 flex flex-row gap-3 active:translate-y-1 transition-all duration-100 ease-out"
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
