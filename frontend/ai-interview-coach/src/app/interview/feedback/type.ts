export interface FeedbackData {
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
  questionType: string;
  mode: string;
  timeElapsed: number;
  interview_id?: string;
}
