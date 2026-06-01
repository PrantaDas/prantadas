import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Pranta Das",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#070b12] flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Terminal window chrome */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0d1117] overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0a0f16]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-white/25 select-none">
              zsh — prantadas.vercel.app
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed">
            {/* Command */}
            <div className="flex items-start gap-2 text-white/50">
              <span className="text-[#00d4ff] select-none">❯</span>
              <span>
                GET{" "}
                <span className="text-white/70">
                  https://prantadas.vercel.app/
                  <span className="text-[#ff5f57]">[unknown-route]</span>
                </span>
              </span>
            </div>

            {/* Blank line */}
            <div className="my-3 border-t border-white/[0.04]" />

            {/* Error output */}
            <div className="space-y-1.5">
              <p className="text-[#ff5f57]">
                ✗ RouteError: Cannot resolve path
              </p>
              <p className="text-white/30 text-xs pl-4">
                at Router.resolve (router.ts:204:13)
              </p>
              <p className="text-white/30 text-xs pl-4">
                at AppRouter.navigate (app.ts:88:5)
              </p>
              <p className="text-white/20 text-xs pl-4">
                at dispatch (next/dist/server/router.js:312:9)
              </p>
            </div>

            <div className="my-4 border-t border-white/[0.04]" />

            {/* Diagnosis */}
            <div className="space-y-1 text-xs text-white/35">
              <p>
                <span className="text-white/20">#</span> status_code{" "}
                <span className="text-[#febc2e]">404</span>
              </p>
              <p>
                <span className="text-white/20">#</span> message{" "}
                <span className="text-white/50">
                  &quot;resource not found in route table&quot;
                </span>
              </p>
              <p>
                <span className="text-white/20">#</span> suggestion{" "}
                <span className="text-white/50">
                  check the URL or use one of the commands below
                </span>
              </p>
            </div>

            <div className="my-4 border-t border-white/[0.04]" />

            {/* Actions as CLI commands */}
            <div className="space-y-2">
              <p className="text-white/25 text-xs mb-3"># suggested actions:</p>
              <Link
                href="/"
                className="flex items-center gap-3 group rounded-lg px-3 py-2.5 border border-white/[0.06] hover:border-[#00d4ff]/25 hover:bg-[#00d4ff]/[0.04] transition-all duration-200"
              >
                <span className="text-[#00d4ff] select-none">$</span>
                <span className="text-white/60 group-hover:text-white/90 transition-colors">
                  cd{" "}
                  <span className="text-[#00d4ff] group-hover:text-[#00d4ff]">
                    ~/home
                  </span>
                </span>
                <span className="ml-auto text-white/20 text-xs group-hover:text-white/40 transition-colors">
                  ↵
                </span>
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 group rounded-lg px-3 py-2.5 border border-white/[0.06] hover:border-purple-500/25 hover:bg-purple-500/[0.04] transition-all duration-200"
              >
                <span className="text-purple-400 select-none">$</span>
                <span className="text-white/60 group-hover:text-white/90 transition-colors">
                  ls <span className="text-purple-400">~/blog</span>
                </span>
                <span className="ml-auto text-white/20 text-xs group-hover:text-white/40 transition-colors">
                  ↵
                </span>
              </Link>
            </div>

            {/* Blinking cursor */}
            <div className="mt-4 flex items-center gap-2 text-white/30">
              <span className="text-[#00d4ff] select-none">❯</span>
              <span className="w-2 h-4 bg-[#00d4ff]/50 animate-pulse rounded-sm" />
            </div>
          </div>
        </div>

        {/* Footer label */}
        <p className="mt-5 text-center font-mono text-xs text-white/15 select-none">
          exit code 404 · process exited with errors
        </p>
      </div>
    </div>
  );
}
