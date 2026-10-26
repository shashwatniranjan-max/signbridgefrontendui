export type RecognitionSource = "demo" | "model";

export interface RecognitionResult {
  label: string;
  caption: string;
  /** 0..1, as supplied by the source */
  confidence: number;
  timestamp: number;
  source: RecognitionSource;
}

export type RecognitionStatus = "unavailable" | "demo" | "connected" | "error";

/** Any recognizer (demo or real model) implements this. */
export interface RecognitionService {
  readonly source: RecognitionSource;
  start(video: HTMLVideoElement | null, onResult: (r: RecognitionResult) => void): void;
  stop(): void;
}

export const CONFIDENCE_THRESHOLD = 0.6;
