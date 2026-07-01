"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const lines = [
  {
    type: "prompt",
    content: (
      <>
        GET{" "}
        <span className="text-white/70">
          https://prantadas.dev/
          <span className="text-[#ff5f57]">[unknown-route]</span>
        </span>
      </>
    ),
  },
  { type: "divider" },
  { type: "error", content: "✗ RouteError: Cannot resolve path" },
  { type: "trace", content: "  at Router.resolve (router.ts:204:13)" },
  { type: "trace", content: "  at AppRouter.navigate (app.ts:88:5)" },
  { type: "trace2", content: "  at dispatch (next/dist/server/router.js:312:9)" },
  { type: "divider" },
  { type: "meta", key: "status_code", value: "404", valueClass: "text-[#febc2e]" },
  { type: "meta", key: "message", value: '"resource not found in route table"', valueClass: "text-white/68" },
  { type: "meta", key: "suggestion", value: '"check the URL or use one of the commands below"', valueClass: "text-white/68" },
  { type: "divider" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};

const lineVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function NotFoundClient() {
  return (
    <div className="relative min-h-screen bg-[#070b12] flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.05),transparent_70%)] pointer-events-none" />

      {/* Giant background 404 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-white leading-none"
          style={{
            fontSize: "clamp(160px, 35vw, 400px)",
            opacity: 0.018,
            letterSpacing: "-0.05em",
          }}
        >
          404
        </span>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-white/[0.07] bg-[#0d1117] overflow-hidden shadow-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0a0f16]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-white/52 select-none">
              zsh — prantadas.dev
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-0"
            >
              {/* Prompt line */}
              <motion.div variants={lineVariant} className="flex items-start gap-2 text-white/68 mb-3">
                <span className="text-[#00d4ff] select-none">❯</span>
                <span>
                  GET{" "}
                  <span className="text-white/70">
                    https://prantadas.dev/
                    <span className="text-[#ff5f57]">[unknown-route]</span>
                  </span>
                </span>
              </motion.div>

              <motion.div variants={lineVariant}>
                <div className="my-3 border-t border-white/[0.04]" />
              </motion.div>

              {/* Error */}
              <motion.div variants={lineVariant} className="text-[#ff5f57] mb-1">
                ✗ RouteError: Cannot resolve path
              </motion.div>
              <motion.div variants={lineVariant} className="text-white/55 text-xs pl-4 mb-0.5">
                at Router.resolve (router.ts:204:13)
              </motion.div>
              <motion.div variants={lineVariant} className="text-white/55 text-xs pl-4 mb-0.5">
                at AppRouter.navigate (app.ts:88:5)
              </motion.div>
              <motion.div variants={lineVariant} className="text-white/48 text-xs pl-4">
                at dispatch (next/dist/server/router.js:312:9)
              </motion.div>

              <motion.div variants={lineVariant}>
                <div className="my-4 border-t border-white/[0.04]" />
              </motion.div>

              {/* Diagnosis */}
              <motion.div variants={lineVariant} className="space-y-1 text-xs text-white/58 mb-0">
                <p>
                  <span className="text-white/48">#</span> status_code{" "}
                  <span className="text-[#febc2e] font-bold">404</span>
                </p>
                <p>
                  <span className="text-white/48">#</span> message{" "}
                  <span className="text-white/68">&quot;resource not found in route table&quot;</span>
                </p>
                <p>
                  <span className="text-white/48">#</span> suggestion{" "}
                  <span className="text-white/68">&quot;check the URL or use one of the commands below&quot;</span>
                </p>
              </motion.div>

              <motion.div variants={lineVariant}>
                <div className="my-4 border-t border-white/[0.04]" />
              </motion.div>

              {/* Action commands */}
              <motion.div variants={lineVariant} className="space-y-2">
                <p className="text-white/52 text-xs mb-3"># suggested actions:</p>
                <Link
                  href="/"
                  className="flex items-center gap-3 group/cmd rounded-lg px-3 py-2.5 border border-white/[0.06] hover:border-[#00d4ff]/25 hover:bg-[#00d4ff]/[0.04] transition-all duration-200"
                >
                  <span className="text-[#00d4ff] select-none">$</span>
                  <span className="text-white/74 group-hover/cmd:text-white/90 transition-colors">
                    cd <span className="text-[#00d4ff]">~/home</span>
                  </span>
                  <span className="ml-auto text-white/48 text-xs group-hover/cmd:text-white/62 transition-colors">↵</span>
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-3 group/cmd rounded-lg px-3 py-2.5 border border-white/[0.06] hover:border-purple-500/25 hover:bg-purple-500/[0.04] transition-all duration-200"
                >
                  <span className="text-purple-400 select-none">$</span>
                  <span className="text-white/74 group-hover/cmd:text-white/90 transition-colors">
                    ls <span className="text-purple-400">~/blog</span>
                  </span>
                  <span className="ml-auto text-white/48 text-xs group-hover/cmd:text-white/62 transition-colors">↵</span>
                </Link>
              </motion.div>

              {/* Blinking cursor */}
              <motion.div
                variants={lineVariant}
                className="mt-4 flex items-center gap-2 text-white/55"
              >
                <span className="text-[#00d4ff] select-none">❯</span>
                <span className="w-2 h-4 bg-[#00d4ff]/50 animate-pulse rounded-sm" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-5 text-center font-mono text-xs text-white/45 select-none"
        >
          exit code 404 · process exited with errors
        </motion.p>
      </div>
    </div>
  );
}
