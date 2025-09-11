'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {motion} from 'framer-motion';
import { CheckCircle2, Rocket, PlugZap, Sparkles } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const s = usp.get('utm_source');
    if (s) setUtmSource(s);
  }, []);

  async function joinWaitlist(payload: { email: string }) {
    const res = await fetch('https://jdopiajtnnwuznhvypku.supabase.co/functions/v1/subscribe-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // only send email for now
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to join');
    return data;
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await joinWaitlist({ email });
      setStatus({ ok: true, msg: 'You’re on the list! We’ll email you when early access is ready.' });
      setEmail('');
    } catch (err: any) {
      setStatus({ ok: false, msg: err.message || 'Failed to join. Try again.' });
    } finally {
      setLoading(false);
    }
  }

return (
  <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 antialiased">
    {/* subtle dot grid */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
        backgroundSize: "22px 22px, 22px 22px",
        backgroundPosition: "0 0, 11px 11px",
      }}
    />

    {/* glow orbs (darker hues) */}
    <div className="absolute -top-40 -left-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-500 opacity-30 blur-3xl mix-blend-screen" />
    <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 opacity-30 blur-3xl mix-blend-screen" />

    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-28 md:grid-cols-2">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200 shadow-sm backdrop-blur">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-medium">Beta</span>
          <span className="opacity-70">Built for SMBs</span>
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
          Launch Google &amp; Meta ads in minutes —{" "}
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text underline decoration-white/20 underline-offset-4">
            <span className="text-transparent">no marketing degree required</span>
          </span>
          .
        </h1>

        <p className="mt-5 max-w-xl text-lg text-neutral-300">
          Connect your accounts, generate ads with AI (or upload your own), one-click
          publish, and get plain-English insights. We handle pixels, GA4, budgets, and
          reviews — you stay in control.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-neutral-200">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
            <span>One-click deploy with safe defaults</span>
          </li>
          <li className="flex items-start gap-3">
            <PlugZap className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
            <span>Pixel + GA4 setup assistant</span>
          </li>
          <li className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
            <span>AI ad copy &amp; images — with smart critique</span>
          </li>
          <li className="flex items-start gap-3">
            <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
            <span>Simple analytics and guidance you can act on</span>
          </li>
        </ul>
      </motion.div>

      {/* Signup panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
      >
        <div className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium text-neutral-200 shadow-sm backdrop-blur">
          Early Access
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">Request early access</h3>
        <p className="mb-4 text-sm text-neutral-300">
          Join the waitlist to be among the first to try it.
        </p>
        <form onSubmit={subscribe} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={clsx(
              "w-full rounded-xl py-3 font-medium transition",
              loading
                ? "bg-white/10 text-neutral-300"
                : "bg-white text-neutral-900 hover:opacity-95 active:opacity-90"
            )}
          >
            {loading ? "Joining…" : "Join the waitlist"}
          </motion.button>

          {status && (
            <p
              className={clsx(
                "text-sm",
                status.ok ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {status.msg}
            </p>
          )}
          <p className="text-[12px] text-neutral-400">No spam. Unsubscribe anytime.</p>
        </form>
      </motion.div>
    </section>

    {/* How it works */}
    <section className="mx-auto mt-10 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
      {[
        {
          t: "Connect",
          d: "Secure OAuth to your Google & Meta ad accounts. You set the budget caps — revoke anytime.",
          i: <PlugZap className="h-5 w-5" />,
        },
        {
          t: "Create",
          d: "Upload or generate AI creatives. We auto-check policy and give smart critique.",
          i: <Sparkles className="h-5 w-5" />,
        },
        {
          t: "Launch",
          d: "One click deploy with pixel/GA4 tracking and plain-English insights after.",
          i: <Rocket className="h-5 w-5" />,
        },
      ].map((x, i) => (
        <motion.div
          key={x.t}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
          className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl backdrop-blur"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-neutral-200">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-white/5 text-[11px] font-semibold text-neutral-100">
              {i + 1}
            </span>
            <span className="font-medium text-neutral-100">{x.t}</span>
            <span className="ml-1 opacity-80 text-neutral-100">{x.i}</span>
          </div>
          <div className="text-sm text-neutral-300">{x.d}</div>
        </motion.div>
      ))}
    </section>

    {/* Credibility */}
    <section className="mx-auto mt-16 max-w-3xl px-6 pb-24 text-center text-sm text-neutral-400">
      <p>
        We don’t promise outcomes — we provide the tools and guardrails so small
        businesses can advertise with confidence.
      </p>
    </section>
  </main>
);
