/**
 * 通用数据类型和常量定义
 * 包含共享的接口、工具类型和配置常量
 */

import { BadgeType, XPLevel, XPReward } from "./gamification";
import { InterviewCategory, DifficultyLevel, ScoreDimension } from "./progress";

// ===============================
// 通用工具类型
// ===============================

/**
 * API响应包装器
 */
export interface ApiResponse<T> {
    success: boolean; // 请求是否成功
    data?: T; // 响应数据（可选）
    error?: string; // 错误信息（可选）
    message?: string; // 提示信息（可选）
    timestamp: string; // 响应时间戳
}

/**
 * 分页参数
 */
export interface PaginationParams {
    page: number; // 页码（从1开始）
    limit: number; // 每页数量
    sortBy?: string; // 排序字段（可选）
    sortOrder?: "ASC" | "DESC"; // 排序顺序（可选）
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
    items: T[]; // 数据项列表
    total: number; // 总数量
    page: number; // 当前页码
    limit: number; // 每页数量
    totalPages: number; // 总页数
    hasNext: boolean; // 是否有下一页
    hasPrev: boolean; // 是否有上一页
}

/**
 * 本地存储键枚举
 */
export enum LocalStorageKeys {
    AUTH_TOKEN = "auth_token",
    USERNAME = "username",
    USER_GAMIFICATION = "user_gamification",
    USER_PROGRESS = "user_progress",
    APP_SETTINGS = "app_settings",
    TEMP_SESSION_DATA = "temp_session_data",
}

/**
 * 应用设置接口
 */
export interface AppSettings {
    // 主题设置
    theme: "light" | "dark" | "auto"; // 主题模式

    // 通知设置
    enableNotifications: boolean; // 是否启用通知
    enableXPNotifications: boolean; // 是否启用XP获得通知
    enableBadgeNotifications: boolean; // 是否启用徽章解锁通知
    enableDailyReminders: boolean; // 是否启用每日提醒

    // 显示设置
    showAnimations: boolean; // 是否显示动画
    compactMode: boolean; // 是否使用紧凑模式
    showProgressDetails: boolean; // 是否显示详细进度

    // 隐私设置
    shareAnalytics: boolean; // 是否共享分析数据
    autoSaveProgress: boolean; // 是否自动保存进度

    // 时间戳
    lastUpdated: string; // 最后更新时间
}

// ===============================
// 配置常量
// ===============================

/**
 * XP等级配置
 */
export const XP_LEVELS: XPLevel[] = [
    { level: 1, minXP: 0, maxXP: 99, title: "Novice", color: "text-gray-500" },
    {
        level: 2,
        minXP: 100,
        maxXP: 249,
        title: "Apprentice",
        color: "text-green-500",
    },
    {
        level: 3,
        minXP: 250,
        maxXP: 499,
        title: "Practitioner",
        color: "text-blue-500",
    },
    {
        level: 4,
        minXP: 500,
        maxXP: 999,
        title: "Expert",
        color: "text-purple-500",
    },
    {
        level: 5,
        minXP: 1000,
        maxXP: 1999,
        title: "Master",
        color: "text-orange-500",
    },
    {
        level: 6,
        minXP: 2000,
        maxXP: 3999,
        title: "Grandmaster",
        color: "text-red-500",
    },
    {
        level: 7,
        minXP: 4000,
        maxXP: 7999,
        title: "Legend",
        color: "text-pink-500",
    },
    {
        level: 8,
        minXP: 8000,
        maxXP: 15999,
        title: "Mythical",
        color: "text-indigo-500",
    },
    {
        level: 9,
        minXP: 16000,
        maxXP: 31999,
        title: "Epic",
        color: "text-yellow-500",
    },
    {
        level: 10,
        minXP: 32000,
        maxXP: Infinity,
        title: "Supreme",
        color: "text-gradient",
    },
];

/**
 * XP奖励配置
 */
export const XP_REWARDS: Record<string, XPReward> = {
    // Basic Answer Rewards
    ANSWER_CORRECT: {
        action: "ANSWER_CORRECT",
        baseXP: 10,
        description: "Answer question correctly",
    },
    ANSWER_PARTIAL: {
        action: "ANSWER_PARTIAL",
        baseXP: 5,
        description: "Partially correct answer",
    },

    // Session Completion Rewards
    COMPLETE_SESSION: {
        action: "COMPLETE_SESSION",
        baseXP: 50,
        description: "Complete interview session",
    },
    PERFECT_SESSION: {
        action: "PERFECT_SESSION",
        baseXP: 100,
        description: "Perfect session completion (90%+ score)",
    },

    // Login Streak Rewards
    DAILY_LOGIN: {
        action: "DAILY_LOGIN",
        baseXP: 5,
        multiplier: 1,
        description: "Daily login",
    },
    STREAK_BONUS: {
        action: "STREAK_BONUS",
        baseXP: 10,
        description: "Login streak bonus",
    },

    // Special Achievement Rewards
    FIRST_SESSION: {
        action: "FIRST_SESSION",
        baseXP: 25,
        description: "First interview session",
    },
    CATEGORY_MASTERY: {
        action: "CATEGORY_MASTERY",
        baseXP: 200,
        description: "Master a category",
    },
};

/**
 * 徽章配置映射
 */
export const BADGE_CONFIGS: Record<
    BadgeType,
    {
        name: string;
        description: string;
        icon: string;
        requirement: number;
        category: "xp" | "answers" | "login" | "category" | "special";
    }
> = {
    // XP Badges
    [BadgeType.FIRST_XP]: {
        name: "First Steps",
        description: "Earn your first experience point",
        icon: "⭐",
        requirement: 1,
        category: "xp",
    },
    [BadgeType.XP_100]: {
        name: "XP Novice",
        description: "Accumulate 100 experience points",
        icon: "🏆",
        requirement: 100,
        category: "xp",
    },
    [BadgeType.XP_500]: {
        name: "XP Expert",
        description: "Accumulate 500 experience points",
        icon: "🥇",
        requirement: 500,
        category: "xp",
    },
    [BadgeType.XP_1000]: {
        name: "XP Master",
        description: "Accumulate 1000 experience points",
        icon: "👑",
        requirement: 1000,
        category: "xp",
    },

    // Answer Badges
    [BadgeType.FIRST_ANSWER]: {
        name: "Ice Breaker",
        description: "Answer your first question",
        icon: "🎯",
        requirement: 1,
        category: "answers",
    },
    [BadgeType.ANSWER_10]: {
        name: "Answer Rookie",
        description: "Answer 10 questions",
        icon: "📝",
        requirement: 10,
        category: "answers",
    },
    [BadgeType.ANSWER_50]: {
        name: "Answer Expert",
        description: "Answer 50 questions",
        icon: "📚",
        requirement: 50,
        category: "answers",
    },
    [BadgeType.ANSWER_100]: {
        name: "Answer Master",
        description: "Answer 100 questions",
        icon: "🎓",
        requirement: 100,
        category: "answers",
    },

    // Login Streak Badges
    [BadgeType.LOGIN_STREAK_3]: {
        name: "Persistent",
        description: "Log in for 3 consecutive days",
        icon: "🔥",
        requirement: 3,
        category: "login",
    },
    [BadgeType.LOGIN_STREAK_7]: {
        name: "Dedicated",
        description: "Log in for 7 consecutive days",
        icon: "⚡",
        requirement: 7,
        category: "login",
    },
    [BadgeType.LOGIN_STREAK_30]: {
        name: "Relentless",
        description: "Log in for 30 consecutive days",
        icon: "💪",
        requirement: 30,
        category: "login",
    },

    // Category Master Badges
    [BadgeType.BEHAVIOURAL_MASTER]: {
        name: "Behavioural Interview Master",
        description: "Excel in behavioural interviews",
        icon: "🎭",
        requirement: 80,
        category: "category",
    },
    [BadgeType.TECHNICAL_MASTER]: {
        name: "Technical Interview Master",
        description: "Excel in technical interviews",
        icon: "💻",
        requirement: 80,
        category: "category",
    },
    [BadgeType.PSYCHOMETRIC_MASTER]: {
        name: "Psychometric Assessment Master",
        description: "Excel in psychometric assessments",
        icon: "🧠",
        requirement: 80,
        category: "category",
    },

    // Special Achievement Badges
    [BadgeType.PERFECTIONIST]: {
        name: "Perfectionist",
        description: "Achieve perfect scores 5 times in a row",
        icon: "💎",
        requirement: 5,
        category: "special",
    },
    [BadgeType.IMPROVER]: {
        name: "Rising Star",
        description: "Show continuous score improvement",
        icon: "📈",
        requirement: 1,
        category: "special",
    },
    [BadgeType.DEDICATED]: {
        name: "Dedicated Practitioner",
        description: "Practice consistently for 30 days",
        icon: "🌟",
        requirement: 30,
        category: "special",
    },
};

/**
 * 类别阈值配置
 */
export const CATEGORY_THRESHOLDS = {
    WEAK_AREA_THRESHOLD: 60, // 弱项阈值（低于此分数视为弱项）
    MASTERY_THRESHOLD: 80, // 掌握阈值（高于此分数视为掌握）
    EXCELLENT_THRESHOLD: 90, // 优秀阈值（高于此分数视为优秀）
};

/**
 * 评分维度配置（对应 interview_score 数组的 5 个维度）
 */
export const SCORE_DIMENSION_CONFIGS: Record<
    ScoreDimension,
    {
        name: string;
        description: string;
        index: number; // 在 interview_score 数组中的索引
        color: string; // 用于图表显示的颜色
        icon: string; // 图标
    }
> = {
    [ScoreDimension.CLARITY_STRUCTURE]: {
        name: "Clarity & Structure",
        description: "How clear and well-structured your answer is",
        index: 0,
        color: "#3b82f6", // blue
        icon: "📝",
    },
    [ScoreDimension.RELEVANCE]: {
        name: "Relevance to Question/Job",
        description: "How relevant your answer is to the question and job",
        index: 1,
        color: "#8b5cf6", // purple
        icon: "🎯",
    },
    [ScoreDimension.KEYWORD_ALIGNMENT]: {
        name: "Keyword & Skill Alignment",
        description: "How well you used relevant keywords and skills",
        index: 2,
        color: "#ec4899", // pink
        icon: "🔑",
    },
    [ScoreDimension.CONFIDENCE_DELIVERY]: {
        name: "Confidence & Delivery",
        description: "How confident and well-delivered your answer was",
        index: 3,
        color: "#f59e0b", // amber
        icon: "💪",
    },
    [ScoreDimension.CONCISENESS_FOCUS]: {
        name: "Conciseness & Focus",
        description: "How concise and focused your answer was",
        index: 4,
        color: "#10b981", // green
        icon: "✨",
    },
};

/**
 * 维度分数阈值（基于百分比）
 */
export const DIMENSION_THRESHOLDS = {
    STRENGTH_THRESHOLD: 75, // 优势项阈值（>= 75% 为优势）
    WEAKNESS_THRESHOLD: 75, // 弱项阈值（< 75% 为弱项）
};

/**
 * 默认配置值
 */
export const DEFAULT_CONFIG = {
    MAX_SESSIONS_PER_DAY: 10, // 每日最大会话数
    DEFAULT_SESSION_DURATION: 30, // 默认会话时长（分钟）
    AUTOSAVE_INTERVAL: 30000, // 自动保存间隔（毫秒）
    NOTIFICATION_DURATION: 5000, // 通知显示时长（毫秒）
    CHART_MAX_POINTS: 50, // 图表最大数据点数
    DAILY_QUOTE_CACHE_DURATION: 86400000, // 每日语录缓存时长（毫秒）
};

/**
 * 每日励志语录
 */
export const DAILY_QUOTES = [
    "Today's effort is tomorrow's strength!",
    "Every practice session is a step toward success.",
    "Stay persistent, and you will reach your goals!",
    "Believe in yourself, you are stronger than you think.",
    "Success belongs to those who never give up.",
    "Today's you is better than yesterday's!",
    "Opportunities are always reserved for those who are prepared.",
    "Continuous improvement, pursue excellence.",
    "Every expert was once a beginner.",
    "Progress is not about speed, but about persistence.",
];
