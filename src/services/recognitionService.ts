import type { RecognitionService } from "@/types/recognition";

/**
 * Real model integration point. Return a RecognitionService with source "model"
 * (e.g. MediaPipe hand landmarks + a classifier). Returns null until one exists,
 * so the UI shows an honest "Recognition unavailable" state.
 */
export function getModelRecognitionService(): RecognitionService | null {
  return null;
}
