import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { GridBackground, GlassCard, ShimmerButton, TypingText, AnimatedNumber } from '@/components/ui/aceternity';
import { ArrowRight, BarChart3, CheckCircle, ChevronDown, Clock, Link2, Shield, Star, Users, Zap } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/')({ component: LandingPage });

const features = [
  { icon: BarChart3, title: 'Live Analytics', desc: 'Watch votes update in real time via WebSocket.', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Zap, title: 'Instant Polls', desc: 'Create and publish in under 60 seconds.', color: 'text-secondary', bg: 'bg-secondary/10' },
  { icon: Shield, title: 'Anonymous Mode', desc: 'Optional anonymity for honest responses.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Users, title: 'Open Sharing', desc: 'Anyone can vote — no account required.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Clock, title: 'Poll Expiry', desc: 'Set an expiry time — polls close automatically.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: Link2, title: 'Public Links', desc: 'One shareable link for voting and results.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

const steps = [
  { n: '01', title: 'Create your poll', desc: 'Add a title, questions, and answer options. Mark questions as mandatory or optional. Set an expiry if needed.' },
  { n: '02', title: 'Share the link', desc: 'Copy the public poll link and share it anywhere — email, Slack, social media. No sign-up required to vote.' },
  { n: '03', title: 'Collect responses', desc: 'Respondents open the link, answer questions, and submit. Anonymous mode keeps answers honest.' },
  { n: '04', title: 'Analyze live results', desc: 'Watch your analytics dashboard update in real time as votes come in via WebSocket.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Product Manager', text: 'PulseBoard replaced our weekly survey tool. Results are instant and the live dashboard is addictive to watch.', stars: 5 },
  { name: 'James K.', role: 'Engineering Lead', text: 'We use it for sprint retrospectives. Anonymous mode means people actually say what they think.', stars: 5 },
  { name: 'Aisha M.', role: 'Community Manager', text: 'Shared a poll with 500 members and had results in minutes. The real-time bar charts are a great touch.', stars: 5 },
];

const faqs = [
  { q: 'Do respondents need an account?', a: 'No. Anyone with the poll link can vote without signing up.' },
  { q: 'Can I make responses anonymous?', a: 'Yes. Toggle anonymous mode when creating a poll and responses won\'t be tied to any identity.' },
  { q: 'What happens when a poll expires?', a: 'The poll automatically closes and no further responses are accepted. Existing results remain visible.' },
  { q: 'How does real-time work?', a: 'We use WebSockets (Socket.io) to push vote updates to the analytics dashboard instantly.' },
  { q: 'Can I publish final results?', a: 'Yes. After collecting responses, hit "Publish Results" and anyone visiting the poll link will see the outcome.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
        <span className="font-medium text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{a}</p>}
    </GlassCard>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{children}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{children}</h2>;
}

function LandingPage() {
  return (
    <div className="flex flex-col w-full my-30">

      {/* ── Hero ── */}
      <GridBackground className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary/8 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live polling · Real-time results
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] mb-5"
          >
            Polls that pulse with<br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-[gradient_4s_ease_infinite]">
              <TypingText words={['real-time insights', 'live analytics', 'instant feedback', 'your audience']} />
            </span>
          </motion.h1>
          <style>{`@keyframes gradient { 0%,100%{background-position:0%} 50%{background-position:100%} }`}</style>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Create a poll in seconds, share a link, and watch live analytics as votes roll in.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <Link to="/register">
              <ShimmerButton className="h-11 px-7 text-[15px]">
                Start for free <ArrowRight className="w-4 h-4" />
              </ShimmerButton>
            </Link>
            <Link to="/login">
              <button className="h-11 px-7 text-[15px] rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Sign in
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-10 mb-12"
          >
            {[['10000', 'Polls created'], ['500000', 'Responses'], ['99', '% Uptime']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-bold"><AnimatedNumber value={parseInt(n)} />{l.includes('%') ? '%' : '+'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mockup */}
        <motion.div initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="w-full max-w-2xl mx-auto px-4 pb-16"
        >
          <GlassCard glow="primary" className="overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border/50 bg-muted/30">
              {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`} />)}
              <div className="ml-3 flex-1 h-5 max-w-[180px] rounded-md bg-muted flex items-center px-2">
                <span className="text-[10px] text-muted-foreground">pulseboard.app/poll/…</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Which feature should we build next?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">62 responses · Live</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              {[['Option A', 62, true], ['Option B', 28, false], ['Option C', 10, false]].map(([label, pct, lead]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={lead ? 'text-primary font-medium' : 'text-muted-foreground'}>{label as string}</span>
                    <span className="text-muted-foreground">{pct as number}%</span>
                  </div>
                  <div className="h-6 rounded-lg bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.7 }}
                      className={`h-full rounded-lg ${lead ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted-foreground/30'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </GridBackground>

      {/* ── Features ── */}
      <section className="py-24 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Features</SectionLabel>
            <SectionHeading>Everything you need, nothing you don't</SectionHeading>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <GlassCard className="p-5 h-full hover:shadow-md transition-shadow group">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-24 px-4 border-t border-border/50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>How it works</SectionLabel>
            <SectionHeading>From idea to insights in 4 steps</SectionHeading>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-5 h-full relative overflow-hidden">
                  {/* Big faded step number */}
                  <span className="absolute -top-3 -right-1 text-7xl font-black text-primary/5 select-none leading-none">{s.n}</span>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mb-4">
                    <span className="text-sm font-bold text-primary">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Testimonials</SectionLabel>
            <SectionHeading>Loved by teams everywhere</SectionHeading>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 h-full flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading>Common questions</SectionHeading>
          </div>
          <div className="space-y-3">
            {faqs.map(f => <FAQ key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard glow="secondary" className="p-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Start collecting insights</h2>
              <p className="text-muted-foreground mb-7">Free forever. No credit card required.</p>
              <Link to="/register">
                <ShimmerButton className="h-11 px-8 text-[15px] mx-auto">
                  Create your first poll <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </Link>
              <div className="flex flex-wrap justify-center gap-5 mt-7 text-xs text-muted-foreground">
                {['Free forever', 'No credit card', 'Unlimited polls'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{t}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-6 text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()} PulseBoard
      </footer>
    </div>
  );
}
