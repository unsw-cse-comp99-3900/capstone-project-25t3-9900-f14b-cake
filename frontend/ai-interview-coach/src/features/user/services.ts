import { fetcher } from "@/lib/fetcher";
import type { BackendUserDetailResponse } from "./type";

/**
 * Fetch user details from backend API
 */
export const getUserDetail = async (): Promise<BackendUserDetailResponse> => {
  return await fetcher.get("/user/detail");
};
