import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Captions, Hand, Volume2, Gauge, Keyboard, UserRound } from "lucide-react";
import { Wordmark } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignBridge — Every gesture deserves to be understood" },
      { name: "description", content: "A prototype exploring accessible communication between sign-language users and non-signers, with recognition, captions and spoken replies." },
      { property: "og:title", content: "SignBridge — Every gesture deserves to be understood" },
      { property: "og:description", content: "Visual recognition, readable captions, and spoken replies in one calm workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const btnPrimary = "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/85";
const btnGhost = "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-elevated";

function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Wordmark />
          <span className="micro rounded-full border border-border px-2 py-0.5 text-subtle">Beta</span>
        </div>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <a href="#how" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">How it works</a>
          <a href="#accessibility" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">Accessibility</a>
          <Link to="/workspace" className={btnPrimary}>Open workspace</Link>
        </nav>
      </div>
    </header>
  );
}

function Preview() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-background grid-lines">
          <span className="micro absolute left-3 top-3 text-subtle">Camera input</span>
          <span className="micro absolute right-3 top-3 flex items-center gap-1.5 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Preview
          </span>
          <svg viewBox="0 0 200 125" className="absolute inset-0 h-full w-full text-muted">
            <circle cx="100" cy="52" r="20" fill="currentColor" />
            <path d="M52 125c4-30 24-44 48-44s44 14 48 44z" fill="currentColor" />
          </svg>
          <div className="absolute inset-x-3 bottom-3 rounded-md bg-background/85 px-3 py-2 text-sm text-foreground">
            “Thank you.”
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-xs">
          <span className="micro text-subtle">Latest recognition</span>
          <span className="micro rounded-full border border-warning/40 px-2 py-0.5 text-warning">Demo data</span>
        </div>
      </div>
      <div className="absolute -bottom-10 -left-6 w-64 rounded-xl border border-border bg-elevated p-4 sm:-left-10">
        <p className="micro text-subtle">You · reply</p>
        <p className="mt-1.5 text-sm leading-relaxed">You're welcome — see you Thursday.</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-primary"><Volume2 className="h-3.5 w-3.5" /> Speak aloud</p>
      </div>
    </div>
  );
}

const features = [
  { n: "01", t: "Sign recognition", d: "Explore how visual hand and gesture recognition can help interpret a limited set of signs.", I: Hand },
  { n: "02", t: "Live captions", d: "Make the conversation easier to follow with clear, readable text.", I: Captions },
  { n: "03", t: "Spoken replies", d: "Let typed messages be read aloud when speaking is the easiest way to respond.", I: Volume2 },
];
const steps = [
  { t: "Show a gesture", d: "Enable the camera and present a supported gesture." },
  { t: "View the result", d: "See a recognition result and its confidence when real recognition is connected." },
  { t: "Continue the conversation", d: "Read captions or send a typed reply that can be spoken aloud." },
];
const trust = [
  { t: "Clear about confidence", d: "Recognition results may be uncertain, and we say so.", I: Gauge },
  { t: "Accessible by design", d: "Readable captions, keyboard support, and visible focus states.", I: Keyboard },
  { t: "Prototype, not a replacement", d: "This demo does not replace a fluent sign-language interpreter.", I: UserRound },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-28 pt-20 lg:grid-cols-[1.05fr_1fr] lg:pt-28">
          <div>
            <p className="micro text-primary">Communication, without barriers</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
              A little more<br />understanding<br /><span className="text-muted-foreground">changes everything.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              SignBridge explores a more accessible way for sign-language users and non-signers to communicate—with visual recognition, readable captions, and spoken replies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/workspace" className={btnPrimary}>Try the workspace <ArrowRight className="h-4 w-4" /></Link>
              <a href="#how" className={btnGhost}>See how it works</a>
            </div>
            <p className="mt-6 text-sm text-subtle">A prototype exploring accessible communication.</p>
          </div>
          <Preview />
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">Communication has more than one form.</h2>
            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {features.map(({ n, t, d, I }) => (
                <article key={n} className="bg-background p-8">
                  <div className="flex items-center justify-between">
                    <span className="micro text-subtle">{n}</span>
                    <I className="h-5 w-5 text-teal" aria-hidden="true" />
                  </div>
                  <h3 className="mt-10 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="micro text-subtle">How it works</p>
            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
              {steps.map((s, i) => (
                <li key={s.t} className="relative flex gap-5 md:block md:pr-10">
                  <div className="flex items-center md:mb-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/50 font-display text-sm text-primary">{i + 1}</span>
                    {i < steps.length - 1 && <span className="ml-4 hidden h-px flex-1 bg-border md:block" aria-hidden="true" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{s.t}</h3>
                    <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="accessibility" className="border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1fr_2fr]">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Designed to be transparent.</h2>
            <ul className="divide-y divide-border border-y border-border">
              {trust.map(({ t, d, I }) => (
                <li key={t} className="flex gap-5 py-6">
                  <I className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="leading-relaxed"><strong className="font-semibold">{t}.</strong> <span className="text-muted-foreground">{d}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Wordmark />
            <p className="mt-2 text-sm text-muted-foreground">Every gesture deserves to be understood.</p>
          </div>
          <div className="flex flex-col gap-1 text-sm sm:items-end">
            <Link to="/workspace" className="text-foreground underline-offset-4 hover:underline">Open the workspace</Link>
            <span className="text-subtle">An experimental prototype.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
