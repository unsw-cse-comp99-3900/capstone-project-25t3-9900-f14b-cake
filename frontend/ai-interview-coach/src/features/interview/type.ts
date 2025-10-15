export type QuestionType = "behavioural" | "technical" | "psychometric";

export interface StartInterviewPayload {
  job_description?: string;
  question_type: QuestionType;
}

export interface StartInterviewResponse {
  interview_questions: string[];
}

export interface FeedbackPayload {
  interview_question: string;
  interview_answer: string;
}

export interface FeedbackResponse {
  interview_feedback: string;
  interview_score: number[];
}
