import { fetcher } from "@/lib/fetcher";

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

export const interviewService = {
  start: async (
    payload: StartInterviewPayload
  ): Promise<StartInterviewResponse> => {
    const data = await fetcher.post("/interview/start", payload);
    return data as StartInterviewResponse;
  },
  feedback: async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
    const data = await fetcher.post("/interview/feedback", payload);
    return data as FeedbackResponse;
  },
};
