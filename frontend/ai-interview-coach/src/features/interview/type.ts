export type QuestionType = "behavioural" | "technical" | "psychometric";

export interface StartInterviewPayload {
  job_description?: string;
  question_type: QuestionType;
}

export interface StartInterviewResponse {
  interview_id: string;
  interview_questions: string[];
}

export interface FeedbackPayload {
  interview_id: string;
  interview_type: string;
  interview_question: string;
  interview_answer: string;
}

export interface FeedbackResponse {
  interview_feedback: {
    clarity_structure_score: number;
    clarity_structure_feedback: string;
    relevance_score: number;
    relevance_feedback: string;
    keyword_alignment_score: number;
    keyword_alignment_feedback: string;
    confidence_score: number;
    confidence_feedback: string;
    conciseness_score: number;
    conciseness_feedback: string;
    overall_summary: string;
    overall_score: number;
  };
}
