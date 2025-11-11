import { fetcher } from "@/lib/fetcher";
import type { BackendUserDetailResponse } from "./type";

export const getUserDetail = async (): Promise<BackendUserDetailResponse> => {
  return await fetcher.get("/user/detail");
};
