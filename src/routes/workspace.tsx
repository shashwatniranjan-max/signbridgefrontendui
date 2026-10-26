import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CameraOff, Loader2, Send, Square, Trash2, Volume2, AlertTriangle } from "lucide-react";
import { Wordmark } from "@/components/Logo";
import { useCamera } from "@/hooks/useCamera";
import { createDemoRecognitionService } from "@/services/demoRecognitionService";
import { getModelRecognitionService } from "@/services/recognitionService";
import { CONFIDENCE_THRESHOLD, type RecognitionResult } from "@/types/recognition";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Communication workspace — SignBridge" },
      { name: "description", content: "A shared space for gestures, captions, and replies." },
      { property: "og:title", content: "Communication workspace — SignBridge" },
      { property: "og:description", content: "Camera input, captions, and spoken replies in one focused workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workspace,
});

type Msg = { id: string; speaker: "signer" | "you"; text: string; demo: boolean; at: number };

const DEMO_MSGS: Msg[] = [
  { id: "d1", speaker: "signer", text: "Hello.", demo: true, at: Date.now() - 60000 },
  { id: "d2", speaker: "you", text: "Hi! How can I help today?", demo: true, at: Date.now() - 45000 },
];

const pill = "micro inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1";
const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

function timeAgo(t: number, now: number) {
  const s = Math.max(0, Math.round((now - t) / 1000));
  return s < 5 ? "just now" : s < 60 ? `${s}s ago` : `${Math.round(s / 60)}m ago`;
}

function Workspace() {
  const { videoRef, state: cam, start, stop } = useCamera();
  const model = useMemo(() => getModelRecognitionService(), []);
  const [demo, setDemo] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [ttsOk, setTtsOk] = useState(true);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => setTtsOk(typeof window !== "undefined" && "speechSynthesis" in window), []);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(t); }, []);
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  // Recognition: demo service when enabled; real model only if one exists and camera is on.
  useEffect(() => {
    const svc = demo ? createDemoRecognitionService() : cam === "active" ? model : null;
    if (!svc) { setResult(null); return; }
    svc.start(videoRef.current, (r) => {
      setResult(r);
      if (r.confidence >= CONFIDENCE_THRESHOLD && r.caption) {
        setMsgs((m) => [...m, { id: crypto.randomUUID(), speaker: "signer", text: r.caption, demo: r.source === "demo", at: r.timestamp }]);
      }
    });
    return () => svc.stop();
  }, [demo, cam, model, videoRef]);

  useEffect(() => {
    if (demo) setMsgs((m) => [...DEMO_MSGS.map((x) => ({ ...x, at: Date.now() })), ...m.filter((x) => !DEMO_MSGS.some((d) => d.id === x.id))]);
    else setMsgs((m) => m.filter((x) => !x.demo));
  }, [demo]);

  useEffect(() => { listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" }); }, [msgs.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), speaker: "you", text, demo: false, at: Date.now() }]);
    setDraft("");
  };

  const speak = (m: Msg) => {
    if (!ttsOk) return;
    const s = window.speechSynthesis;
    s.cancel();
    if (speakingId === m.id) { setSpeakingId(null); return; }
    const u = new SpeechSynthesisUtterance(m.text);
    u.onend = u.onerror = () => setSpeakingId(null);
    setSpeakingId(m.id);
    s.speak(u);
  };

  const recStatus = demo
    ? { label: "Demo mode active", cls: "border-warning/40 text-warning", dot: "bg-warning" }
    : model
      ? { label: "Recognition connected", cls: "border-primary/40 text-primary", dot: "bg-primary" }
      : { label: "Recognition unavailable", cls: "border-border text-muted-foreground", dot: "bg-subtle" };

  const camLabel: Record<typeof cam, string> = { off: "Camera off", starting: "Starting…", active: "Camera active", denied: "Permission denied", unavailable: "No camera", error: "Camera error" };
  const lastSigner = [...msgs].reverse().find((m) => m.speaker === "signer");

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />
          <div className="flex items-center gap-2">
            <span className={`${pill} ${recStatus.cls}`} role="status"><span className={`h-1.5 w-1.5 rounded-full ${recStatus.dot}`} />{recStatus.label}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Communication workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">A shared space for gestures, captions, and replies.</p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <span className="text-muted-foreground">Demo mode</span>
            <button
              type="button" role="switch" aria-checked={demo} onClick={() => setDemo((d) => !d)}
              className={`relative h-6 w-11 rounded-full border transition-colors duration-200 ${demo ? "border-warning bg-warning/25" : "border-border bg-elevated"}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all duration-200 ${demo ? "left-6 bg-warning" : "left-0.5 bg-subtle"}`} />
              <span className="sr-only">Demo mode</span>
            </button>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <section aria-label="Camera and recognition" className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[16/10] bg-background">
                <video ref={videoRef} muted playsInline className={`h-full w-full -scale-x-100 object-cover ${cam === "active" ? "" : "hidden"}`} aria-label="Live camera preview" />
                {cam !== "active" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center grid-lines">
                    {cam === "starting" ? (
                      <><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /><p className="text-sm text-muted-foreground">Waiting for camera permission…</p></>
                    ) : cam === "off" ? (
                      <>
                        <svg viewBox="0 0 120 120" className="h-28 w-28 text-subtle" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M18 34V18h16M86 18h16v16M102 86v16H86M34 102H18V86" />
                          <path d="M48 82V50a4 4 0 0 1 8 0v20M56 66V42a4 4 0 0 1 8 0v24M64 66V46a4 4 0 0 1 8 0v24M72 70V56a4 4 0 0 1 8 0v18c0 12-8 20-18 20h-4c-6 0-10-3-13-8L40 76a4 4 0 0 1 7-4l1 2" />
                        </svg>
                        <p className="max-w-xs text-sm text-muted-foreground">Start the camera and keep your hands inside the frame.</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                        <p className="max-w-sm text-sm text-foreground" role="alert">
                          {cam === "denied" ? "Camera access was blocked. Allow it in your browser's site settings, then try again."
                            : cam === "unavailable" ? "No camera was found on this device."
                            : "The camera couldn't start. Close other apps using it and try again."}
                        </p>
                      </>
                    )}
                  </div>
                )}
                <span className="micro absolute left-3 top-3 rounded bg-background/80 px-2 py-1 text-muted-foreground">Camera input</span>
                <span className="micro absolute right-3 top-3 flex items-center gap-1.5 rounded bg-background/80 px-2 py-1 text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${cam === "active" ? "bg-teal" : cam === "off" || cam === "starting" ? "bg-subtle" : "bg-destructive"}`} />
                  {camLabel[cam]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
                <button type="button" onClick={start} disabled={cam === "active" || cam === "starting"} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/85`}>
                  <Camera className="h-4 w-4" aria-hidden="true" /> Start camera
                </button>
                <button type="button" onClick={stop} disabled={cam !== "active"} className={`${btn} border border-border hover:bg-elevated`}>
                  <CameraOff className="h-4 w-4" aria-hidden="true" /> Stop camera
                </button>
                <span className="ml-auto text-xs text-subtle">Video stays in your browser.</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="micro text-subtle">Latest recognition</h2>
                {result?.source === "demo" && <span className={`${pill} border-warning/40 text-warning`}>Demo data</span>}
              </div>
              {!result ? (
                <p className="mt-4 text-lg text-muted-foreground">
                  {model ? "Waiting for a supported gesture" : "Waiting for a supported gesture — no recognition model is connected yet. Turn on Demo mode to see sample results."}
                </p>
              ) : result.confidence < CONFIDENCE_THRESHOLD ? (
                <p className="mt-4 text-lg text-muted-foreground">Not confident enough to interpret this gesture.</p>
              ) : (
                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-semibold">{result.label}</p>
                    <p className="mt-1 text-muted-foreground">Caption: “{result.caption}”</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl tabular-nums">{Math.round(result.confidence * 100)}%</p>
                    <p className="text-xs text-subtle">confidence · {timeAgo(result.timestamp, now)}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="conv" className="flex min-h-[520px] flex-col rounded-xl border border-border bg-card lg:h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h2 id="conv" className="font-semibold">Conversation</h2>
              <div className="flex items-center gap-2">
                {msgs.some((m) => m.demo) && <span className={`${pill} border-warning/40 text-warning`}>Includes demo data</span>}
                {confirmClear ? (
                  <span className="flex items-center gap-1 text-xs">
                    <button type="button" className="rounded px-2 py-1 text-destructive hover:bg-elevated" onClick={() => { setMsgs([]); setConfirmClear(false); }}>Clear all</button>
                    <button type="button" className="rounded px-2 py-1 text-muted-foreground hover:bg-elevated" onClick={() => setConfirmClear(false)}>Cancel</button>
                  </span>
                ) : (
                  <button type="button" aria-label="Clear conversation" disabled={!msgs.length} onClick={() => setConfirmClear(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated hover:text-foreground disabled:opacity-30">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="sr-only" aria-live="polite">{lastSigner ? `Caption: ${lastSigner.text}` : ""}</div>

            {msgs.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <p className="font-medium">No messages yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">Captions from recognized signs and your typed replies will appear here.</p>
              </div>
            ) : (
              <ol ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {msgs.map((m) => (
                  <li key={m.id} className={`flex flex-col ${m.speaker === "you" ? "items-end text-right" : "items-start"}`}>
                    <p className="micro flex items-center gap-2 text-subtle">
                      {m.speaker === "you" ? "You" : "Signer · caption"}
                      {m.demo && <span className="text-warning">· demo</span>}
                    </p>
                    <p className={`mt-1 max-w-[90%] text-[1.0625rem] leading-relaxed ${m.speaker === "you" ? "border-r-2 border-primary pr-3" : "border-l-2 border-teal pl-3"}`}>{m.text}</p>
                    {m.speaker === "you" && ttsOk && (
                      <button type="button" onClick={() => speak(m)} aria-label={speakingId === m.id ? "Stop speaking" : `Speak aloud: ${m.text}`} className="mt-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs text-primary hover:bg-elevated">
                        {speakingId === m.id ? <><Square className="h-3 w-3" /> Stop speaking</> : <><Volume2 className="h-3.5 w-3.5" /> Speak aloud</>}
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            )}

            <form className="border-t border-border p-4" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <label htmlFor="reply" className="micro text-subtle">Your reply</label>
              <textarea
                id="reply" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type a message…"
                className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-base leading-relaxed placeholder:text-subtle focus:border-primary focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-xs text-subtle">{ttsOk ? "Enter to send · Shift+Enter for new line" : "Speech isn't available in this browser."}</span>
                <button type="submit" disabled={!draft.trim()} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/85`}>
                  <Send className="h-4 w-4" aria-hidden="true" /> Send
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
