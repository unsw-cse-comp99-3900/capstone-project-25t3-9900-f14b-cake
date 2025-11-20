/**
 * Centralized Type Definition Export File
 * Exports all type definitions for use by other modules
 */

// Gamification-related types
export type {
    Badge,
    XPLevel,
    XPReward,
    UserGamification,
    GamificationResult,
    DailyLoginReward,
} from "./gamification";

export { BadgeType } from "./gamification";

// Progress tracking related types
export type {
    AnswerRecord,
    SessionRecord,
    CategoryScores,
    CategoryPerformance,
    DimensionPerformance,
    UserProgress,
    ReadinessScorePoint,
    ChartDataPoint,
    ProgressAnalysis,
} from "./progress";

export {
    InterviewCategory,
    ScoreDimension,
    SessionStatus,
    DifficultyLevel,
    TimeRange,
} from "./progress";

// Common types and constants
export type {
    ApiResponse,
    PaginationParams,
    PaginatedResponse,
    AppSettings,
} from "./common";

export {
    LocalStorageKeys,
    XP_LEVELS,
    XP_REWARDS,
    BADGE_CONFIGS,
    CATEGORY_THRESHOLDS,
    SCORE_DIMENSION_CONFIGS,
    DIMENSION_THRESHOLDS,
    DEFAULT_CONFIG,
    DAILY_QUOTES,
} from "./common";
