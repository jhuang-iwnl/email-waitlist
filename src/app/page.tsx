'use client';

import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, PlugZap, Sparkles } from 'lucide-react';

// --- Types for your API response and Plausible ---
type JoinOk = { ok: true; msg?: string };
type JoinErr = { ok?: false; error?: string; msg?: string };
type JoinResponse = JoinOk | JoinErr;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | undefined> }) => void;
  }
}

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  // Capture UTMs + referrer once
  const [utms, setUtms] = useState<{ utm_source?: string; utm_medium?: string; utm_campaign?: string }>({});
  const [referrer, setReferrer] = useState<string | undefined>(undefined);
  const hpRef = useRef<HTMLInputElement>(null); // honeypot

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    setUtms({
      utm_source: usp.get('utm_source') || undefined,
      utm_medium: usp.get('utm_medium') || undefined,
      utm_campaign: usp.get('utm_campaign') || undefined,
    });
    setReferrer(document.referrer || undefined);
  }, []);

  async function joinWaitlist(payload: {
    email: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    hp?: string; // honeypot
  }): Promise<JoinResponse> {
    const res = await fetch(
      'https://jdopiajtnnwuznhvypku.supabase.co/functions/v1/subscribe-waitlist',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = (await res.json()) as JoinResponse;

    if (!res.ok || 'error' in data) {
      const msg = ('error' in data && data.error) || data.msg || 'Failed to join';
      throw new Error(msg);
    }

    return data;
  }

  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await joinWaitlist({
        email,
        source: 'hero_form',
        ...utms,
        referrer,
        hp: hpRef.current?.value || '', // honeypot (should be empty)
      });

      // Analytics event (fires only if Plausible is installed)
      window.plausible?.('Join Waitlist', { props: { source: 'hero_form', ...utms } });

      setStatus({ ok: true, msg: "You're on the list." });
      setEmail('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join. Try again.';
      setStatus({ ok: false, msg: message });
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
            'radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '22px 22px, 22px 22px',
          backgroundPosition: '0 0, 11px 11px',
        }}
      />

      {/* glow orbs */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-500 opacity-30 blur-3xl mix-blend-screen" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 opacity-30 blur-3xl mix-blend-screen" />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-28 md:grid-cols-2">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200 shadow-sm backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium">Beta</span>
            <span className="opacity-70">Built for SMBs</span>
          </div>

          {/* Clean headline */}
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
            Launch Google and Meta ads in minutes
          </h1>

          {/* Sub-headline */}
          <p className="mt-4 text-xl font-medium text-emerald-400 md:text-2xl">
            No marketing degree required
          </p>

          {/* Mission statement */}
          <p className="mt-6 max-w-xl text-lg text-neutral-300">
            Our mission is to remove the barriers to running effective ads. We guide you
            through the marketing funnel, highlight what platforms need to learn your
            audience, and make deployment effortless—so your budget actually works for you.
          </p>

          {/* Quick pillars */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
              <div className="text-sm">
                <div className="font-medium text-neutral-100">Guided funnel</div>
                <div className="text-neutral-300">Know what to provide and why it matters.</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
              <div className="text-sm">
                <div className="font-medium text-neutral-100">One-click deploy</div>
                <div className="text-neutral-300">Connect accounts and publish safely.</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
              <div className="text-sm">
                <div className="font-medium text-neutral-100">AI creatives</div>
                <div className="text-neutral-300">Generate images & copy or upload your own.</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <PlugZap className="mt-0.5 h-5 w-5 shrink-0 text-neutral-100" />
              <div className="text-sm">
                <div className="font-medium text-neutral-100">Plain-English insights</div>
                <div className="text-neutral-300">Understand performance and next steps.</div>
              </div>
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
          <h3 className="mb-2 text-lg font-semibold text-white">Join the waitlist</h3>
          <p className="mb-4 text-sm text-neutral-300">
            Tell us you’re interested. We’ll let you know when early access opens.
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
            {/* Honeypot (hidden from users) */}
            <input
              ref={hpRef}
              type="text"
              name="company_website"
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className={clsx(
                'w-full rounded-xl py-3 font-medium transition',
                loading ? 'bg-white/10 text-neutral-300' : 'bg-white text-neutral-900 hover:opacity-95 active:opacity-90'
              )}
            >
              {loading ? 'Joining…' : 'Join the waitlist'}
            </motion.button>

            {status && (
              <p className={clsx('text-sm', status.ok ? 'text-emerald-400' : 'text-rose-400')}>
                {status.msg}
              </p>
            )}
          </form>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-6 max-w-6xl px-6">
        <h2 className="text-lg font-medium text-neutral-200">How it works</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {[
            {
              t: 'Connect',
              d: 'Securely link Google & Meta. Set budget caps and guardrails.',
              i: <PlugZap className="h-5 w-5" />,
            },
            {
              t: 'Create',
              d: 'Use AI to draft images and copy—or upload your own assets.',
              i: <Sparkles className="h-5 w-5" />,
            },
            {
              t: 'Launch',
              d: 'One-click publish with the qualitative signals platforms need to learn faster.',
              i: <Rocket className="h-5 w-5" />,
            },
          ].map((x, i) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
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
        </div>
      </section>

      {/* Credibility / reassurance */}
      <section className="mx-auto mt-16 max-w-3xl px-6 pb-24 text-center text-sm text-neutral-400">
        <p>
          We don’t promise outcomes—we provide the tools, guidance, and guardrails so
          small businesses can advertise with confidence.
        </p>
      </section>
    </main>
  );
}
