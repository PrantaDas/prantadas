"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/admin";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";

const initial = { error: undefined as string | undefined };

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, initial);
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-white/8 bg-[#0a0c16] p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-white text-center mb-1">
            Admin Access
          </h1>
          <p className="text-sm text-white/58 text-center font-mono mb-8">
            prantadas.dev
          </p>

          <form action={action} className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/52 pointer-events-none" />
              <input
                name="email"
                type="email"
                placeholder="Admin email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/48 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/52 pointer-events-none" />
              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="Admin password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/48 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/52 hover:text-white/74 transition-colors"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {state?.error && (
              <p className="text-xs text-red-400 font-mono text-center pt-1">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {pending ? "Verifying…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/45 font-mono mt-4">
          Restricted area — authorized personnel only
        </p>
      </div>
    </div>
  );
}
