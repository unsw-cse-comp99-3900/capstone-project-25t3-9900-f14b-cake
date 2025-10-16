// Type definitions for Speech-to-Text Service

export interface TranscriptionOptions {
  languageCode?: string;
  sampleRateHertz?: number;
  encoding?: string;
}

export interface TranscriptionResult {
  transcript: string;
  confidence?: number;
}
