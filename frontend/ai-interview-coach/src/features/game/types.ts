/**
 * Game Feature Type Definitions
 * Types specific to the gamification feature API responses
 */

import { BadgeType } from "@/types";

/**
 * Badge unlock record
 */
export interface BadgeRecord {
    id: BadgeType;
    unlocked_at: string | null; // ISO timestamp or null if locked
}

/**
 * Response from GET /gamification/user
 */
export interface UserGamificationResponse {
    user_id: string;
    total_xp: number;
    current_level: number;
    level_progress: number; // 0-100 percentage
    badges: BadgeRecord[];
    unlocked_badges: BadgeType[];
    login_streak: number;
    max_login_streak: number;
    last_login_date: string; // YYYY-MM-DD format
    total_login_days: number;
    total_answers: number;
    correct_answers: number;
    accuracy_rate: number; // 0-100 percentage
    total_sessions: number;
    completed_sessions: number;
}

/**
 * Response from POST /gamification/check-in
 */
export interface CheckInResponse {
    xp_gained: number;
    level_up: boolean;
    new_level: number | null;
    badges_unlocked: BadgeType[];
    current_streak: number;
    daily_quote: string;
    message: string;
}
