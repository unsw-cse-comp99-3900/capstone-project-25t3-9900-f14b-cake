/**
 * Game Service Layer
 * Handles all API calls related to gamification features
 */

import { fetcher } from "@/lib/fetcher";
import type { UserGamificationResponse, CheckInResponse } from "./types";

export const gameService = {
    /**
     * Get user's complete gamification data
     * Includes XP, badges, login streaks, stats, etc.
     */
    getGamificationData: async (): Promise<UserGamificationResponse> => {
        const data = await fetcher.get("/gamification/user");
        return data as UserGamificationResponse;
    },

    /**
     * Perform daily check-in
     * User can only check in once per day
     */
    checkIn: async (): Promise<CheckInResponse> => {
        const data = await fetcher.post("/gamification/check-in", {});
        return data as CheckInResponse;
    },
};
