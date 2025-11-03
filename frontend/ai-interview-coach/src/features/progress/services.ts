/**
 * Progress Service Layer
 * Handles all API calls related to progress tracking
 */

import { fetcher } from "@/lib/fetcher";
import type {
    ReadinessScoresResponse,
    LoginHistoryResponse,
    DimensionPerformanceResponse,
} from "./types";

export const progressService = {
    /**
     * Get readiness scores over time
     * @param timeRange - WEEKLY, MONTHLY, or ALL_TIME
     */
    getReadinessScores: async (
        timeRange: string = "WEEKLY"
    ): Promise<ReadinessScoresResponse> => {
        const data = await fetcher.get(
            `/progress/readiness-scores?time_range=${timeRange}`
        );
        return data as ReadinessScoresResponse;
    },

    /**
     * Get login history for calendar display
     * @param days - Number of recent days to fetch (default: 14)
     */
    getLoginHistory: async (
        days: number = 14
    ): Promise<LoginHistoryResponse> => {
        const data = await fetcher.get(`/progress/login-history?days=${days}`);
        return data as LoginHistoryResponse;
    },

    /**
     * Get performance across 5 scoring dimensions
     * @param timeRange - WEEKLY, MONTHLY, or ALL_TIME
     */
    getDimensionPerformance: async (
        timeRange: string = "ALL_TIME"
    ): Promise<DimensionPerformanceResponse> => {
        const data = await fetcher.get(
            `/progress/dimension-performance?time_range=${timeRange}`
        );
        return data as DimensionPerformanceResponse;
    },
};
