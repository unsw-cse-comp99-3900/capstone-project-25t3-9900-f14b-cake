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
      error: boolean;
      loading: boolean;
    }
  >;
  questionType: string;
  mode: string;
  timeElapsed: number;
  interview_id?: string;
}
