import { fetcher } from "@/lib/fetcher";
import { getUserDetail } from "@/features/user/services";
import { transformInterviewsToRecords } from "@/utils/dataTransform";
import type { InterviewRecord } from "@/app/bank/history/type";

/**
 * Toggle interview like/favorite status
 * @param interviewId - The interview ID to toggle
 * @returns The updated like status
 */
export const toggleInterviewLike = async (
  interviewId: string
): Promise<{ is_like: boolean }> => {
  return await fetcher.post("/user/like", {
    interview_id: interviewId,
  });
};

/**
 * Get all interview records from API
 * @returns Array of interview records
 */
export const getInterviewRecords = async (): Promise<InterviewRecord[]> => {
  const userData = await getUserDetail();
  return transformInterviewsToRecords(userData.interviews || []);
};

/**
 * Get favorite interview records (where is_like is true)
 * @returns Array of favorite interview records
 */
export const getFavoriteRecords = async (): Promise<InterviewRecord[]> => {
  const allRecords = await getInterviewRecords();
  return allRecords.filter((record) => {
    return record.is_like === true || record.is_like === 1;
  });
};

/**
 * Get a single interview record by ID
 * @param interviewId - The interview ID
 * @returns The interview record or null if not found
 */
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
