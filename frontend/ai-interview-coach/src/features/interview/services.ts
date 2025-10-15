import { fetcher } from "@/lib/fetcher";
import type {
  QuestionType,
  StartInterviewPayload,
  StartInterviewResponse,
  FeedbackPayload,
  FeedbackResponse,
} from "./type";

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
