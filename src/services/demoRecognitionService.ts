import type { RecognitionResult, RecognitionService } from "@/types/recognition";

/** Fixed, clearly-labelled sample results. Cycles in order; never random. */
export const DEMO_SAMPLES: Omit<RecognitionResult, "timestamp" | "source">[] = [
  { label: "Hello", caption: "Hello.", confidence: 0.92 },
  { label: "Thank you", caption: "Thank you.", confidence: 0.88 },
  { label: "Unclear", caption: "", confidence: 0.41 },
  { label: "Help", caption: "Can you help me?", confidence: 0.81 },
];

export function createDemoRecognitionService(intervalMs = 5000): RecognitionService {
  let timer: ReturnType<typeof setInterval> | null = null;
  let i = 0;
  return {
    source: "demo",
    start(_video, onResult) {
      this.stop();
      const emit = () => {
        const s = DEMO_SAMPLES[i % DEMO_SAMPLES.length];
        i++;
        onResult({ ...s, timestamp: Date.now(), source: "demo" });
      };
      emit();
      timer = setInterval(emit, intervalMs);
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
    },
  };
}
