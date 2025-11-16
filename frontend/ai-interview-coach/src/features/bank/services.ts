import { fetcher } from "@/lib/fetcher";
import { getUserDetail } from "@/features/user/services";
import { transformInterviewsToRecords } from "@/utils/dataTransform";
import type { InterviewRecord } from "@/app/bank/history/type";

export const toggleInterviewLike = async (
  interviewId: string
): Promise<{ is_like: boolean }> => {
  return await fetcher.post("/user/like", {
    interview_id: interviewId,
  });
};

export const getInterviewRecords = async (): Promise<InterviewRecord[]> => {
  const userData = await getUserDetail();
  return transformInterviewsToRecords(userData.interviews || []);
};

export const getFavoriteRecords = async (): Promise<InterviewRecord[]> => {
  const allRecords = await getInterviewRecords();
  return allRecords.filter((record) => {
    return record.is_like === true || record.is_like === 1;
  });
};

export const getInterviewById = async (
  interviewId: string
): Promise<InterviewRecord | null> => {
  const allRecords = await getInterviewRecords();
  return allRecords.find((record) => record.id === interviewId) || null;
};

export const bankService = {
  toggleLike: toggleInterviewLike,
  getRecords: getInterviewRecords,
  getFavorites: getFavoriteRecords,
  getById: getInterviewById,
};
