/**
 * 类型定义统一导出文件
 * 集中导出所有类型定义，便于其他模块使用
 */

// 游戏化相关类型
export type {
    Badge,
    XPLevel,
    XPReward,
    UserGamification,
    GamificationResult,
    DailyLoginReward,
} from "./gamification";

export { BadgeType } from "./gamification";

// 进度追踪相关类型
export type {
    AnswerRecord,
    SessionRecord,
    CategoryScores,
    CategoryPerformance,
    UserProgress,
    ReadinessScorePoint,
    ChartDataPoint,
    ProgressAnalysis,
} from "./progress";

export {
    InterviewCategory,
    SessionStatus,
    DifficultyLevel,
    TimeRange,
} from "./progress";

// 通用类型和常量
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
    DEFAULT_CONFIG,
    DAILY_QUOTES,
} from "./common";
