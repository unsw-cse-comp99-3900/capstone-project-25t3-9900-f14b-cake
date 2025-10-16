// Speech-to-Text Service for Interview Answering
// This service provides multiple fallback options for speech recognition

import type { TranscriptionOptions, TranscriptionResult } from "./type";

class SpeechToTextService {
  private recognition: any = null;

  constructor() {
    // Initialize Web Speech API if available
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";
      }
    }
  }

  /**
   * Transcribe audio using Web Speech API (primary method)
   * This method plays the audio and uses speech recognition to transcribe it
   */
  async transcribeAudio(
    audioBlob: Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported in this browser"));
        return;
      }

      let finalTranscript = "";
      let isResolved = false;

      // Set up recognition event handlers
      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onend = () => {
        if (!isResolved) {
          isResolved = true;
          if (finalTranscript.trim()) {
            resolve({
              transcript: finalTranscript.trim(),
              confidence: 0.8, // Web Speech API doesn't provide confidence scores
            });
          } else {
            reject(new Error("No speech detected in audio"));
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      // Create audio element to play the recorded audio
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(audioBlob);
      audio.src = audioUrl;

      audio.onloadeddata = () => {
        // Start recognition before playing audio
        this.recognition.start();
        // Play the audio
        audio.play();
      };

      audio.onended = () => {
        // Stop recognition after audio ends
        setTimeout(() => {
          if (!isResolved) {
            this.recognition.stop();
          }
        }, 1000);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        if (!isResolved) {
          isResolved = true;
          reject(new Error("Failed to load audio for transcription"));
        }
      };
    });
  }

  /**
   * Transcribe using real-time Web Speech API
   * This method starts listening to the microphone directly
   */
  async transcribeWithWebSpeech(): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported in this browser"));
        return;
      }

      let finalTranscript = "";
      let isResolved = false;

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onend = () => {
        if (!isResolved) {
          isResolved = true;
          if (finalTranscript.trim()) {
            resolve({
              transcript: finalTranscript.trim(),
              confidence: 0.8,
            });
          } else {
            reject(new Error("No speech detected"));
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      // Start recognition
      this.recognition.start();
    });
  }

  /**
   * Generate mock transcription based on audio characteristics
   * This is used as a final fallback when all other methods fail
   */
  generateMockTranscription(audioBlob: Blob): TranscriptionResult {
    const audioSize = audioBlob.size;
    let transcript = "";

    if (audioSize < 5000) {
      transcript = "This is a brief response to the interview question.";
    } else if (audioSize < 20000) {
      transcript =
        "I would like to answer this interview question by explaining my experience and approach to solving similar problems in my previous role.";
    } else {
      transcript =
        "Thank you for this interesting question. Based on my experience, I believe the key to solving this problem involves several important considerations. First, I would analyze the requirements and constraints. Then, I would develop a systematic approach that takes into account both technical and business aspects. In my previous role, I encountered similar challenges and found that the most effective solution often involves collaboration with team members and iterative refinement of the approach.";
    }

    return {
      transcript,
      confidence: 0.5, // Mock confidence
    };
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Stop any ongoing recognition
   */
  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

// Export singleton instance
export const speechToTextService = new SpeechToTextService();
