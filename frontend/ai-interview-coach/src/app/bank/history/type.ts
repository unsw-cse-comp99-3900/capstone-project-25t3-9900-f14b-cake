export interface InterviewRecord {
  id: string;
  questionType: string;
  timeElapsed: number;
  createdAt: string;
  timestamp?: number; // Unix timestamp in seconds from backend
  totalScore: number;
  questions: string[];
  answers: Record<
    number,
    { textAnswer: string; transcribedText: string | null }
  >;
  feedbacks: Record<
    number,
    {
      text: string | null;
      scores: number[] | null;
      error: boolean;
      loading: boolean;
    }
  >;
  mode: string;
  is_like?: boolean | number; // Add is_like field from backend
}
