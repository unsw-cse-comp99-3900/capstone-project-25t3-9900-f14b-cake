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
      feedbacks?: {
        clarity_structure_feedback: string | null;
        relevance_feedback: string | null;
        keyword_alignment_feedback: string | null;
        confidence_feedback: string | null;
        conciseness_feedback: string | null;
      } | null;
      error: boolean;
      loading: boolean;
    }
  >;
  mode: string;
  is_like?: boolean | number; // Add is_like field from backend
}
