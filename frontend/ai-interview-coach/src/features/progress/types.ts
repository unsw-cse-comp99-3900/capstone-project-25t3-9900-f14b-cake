/**
 * Progress Feature Type Definitions
 * Types specific to the progress feature API responses
 */

import { ScoreDimension } from "@/types";

/**
 * Readiness score data point
 */
export interface ReadinessScore {
    date: string; // YYYY-MM-DD format
    score: number; // 0-100
}

/**
 * Response from GET /progress/readiness-scores
 */
export interface ReadinessScoresResponse {
    readiness_scores: ReadinessScore[];
    current_score: number;
    average_score: number;
    best_score: number;
    improvement_rate: number;
}

/**
 * Single day login record
 */
export interface LoginDay {
    date: string; // YYYY-MM-DD format
    has_login: boolean;
}

/**
 * Response from GET /progress/login-history
 */
export interface LoginHistoryResponse {
    login_history: LoginDay[];
    current_streak: number;
    max_streak: number;
    total_login_days: number;
    last_login_date: string;
}

/**
 * Single dimension performance data
 */
export interface DimensionPerformanceData {
    dimension: ScoreDimension;
    dimension_name: string;
    average_score: number; // 1-5 scale
    percentage: number; // 0-100 scale
    is_strength: boolean; // >= 75%
}

/**
 * Response from GET /progress/dimension-performance
 */
export interface DimensionPerformanceResponse {
    dimension_performances: DimensionPerformanceData[];
}
