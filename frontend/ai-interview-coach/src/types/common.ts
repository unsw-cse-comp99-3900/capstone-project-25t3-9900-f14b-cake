/**
 * Common Data Types and Constant Definitions
 * Contains shared interfaces, utility types, and configuration constants
 */

import { BadgeType, XPLevel, XPReward } from "./gamification";
import { InterviewCategory, DifficultyLevel, ScoreDimension } from "./progress";

// ===============================
// Common Utility Types
// ===============================

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
    success: boolean; // Whether the request was successful
    data?: T; // Response data (optional)
    error?: string; // Error message (optional)
    message?: string; // Notification message (optional)
    timestamp: string; // Response timestamp
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
    page: number; // Page number (starting from 1)
    limit: number; // Number of items per page
    sortBy?: string; // Sort field (optional)
    sortOrder?: "ASC" | "DESC"; // Sort order (optional)
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
    items: T[]; // List of data items
    total: number; // Total count
    page: number; // Current page number
    limit: number; // Items per page
    totalPages: number; // Total number of pages
    hasNext: boolean; // Whether there is a next page
    hasPrev: boolean; // Whether there is a previous page
}

/**
 * Local Storage Keys Enumeration
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
 * Application Settings Interface
 */
export interface AppSettings {
    // Theme settings
    theme: "light" | "dark" | "auto"; // Theme mode

    // Notification settings
    enableNotifications: boolean; // Whether to enable notifications
    enableXPNotifications: boolean; // Whether to enable XP gain notifications
    enableBadgeNotifications: boolean; // Whether to enable badge unlock notifications
    enableDailyReminders: boolean; // Whether to enable daily reminders

    // Display settings
    showAnimations: boolean; // Whether to show animations
    compactMode: boolean; // Whether to use compact mode
    showProgressDetails: boolean; // Whether to show detailed progress

    // Privacy settings
    shareAnalytics: boolean; // Whether to share analytics data
    autoSaveProgress: boolean; // Whether to auto-save progress

    // Timestamp
    lastUpdated: string; // Last updated time
}

// ===============================
// Configuration Constants
// ===============================

/**
 * XP Level Configuration
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
 * XP Reward Configuration
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
 * Badge Configuration Mapping
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
 * Category Threshold Configuration
 */
export const CATEGORY_THRESHOLDS = {
    WEAK_AREA_THRESHOLD: 60, // Weak area threshold (below this score is considered weak)
    MASTERY_THRESHOLD: 80, // Mastery threshold (above this score is considered mastered)
    EXCELLENT_THRESHOLD: 90, // Excellent threshold (above this score is considered excellent)
};

/**
 * Score Dimension Configuration (corresponding to 5 dimensions in interview_score array)
 */
export const SCORE_DIMENSION_CONFIGS: Record<
    ScoreDimension,
    {
        displayName: string;
        shortName: string;
        index: number; // Index in interview_score array
        color: string; // Color for chart display
        icon: string; // Icon
    }
> = {
    [ScoreDimension.CLARITY_STRUCTURE]: {
        displayName: "Clarity & Structure",
        shortName: "Clarity",
        index: 0,
        color: "#3b82f6", // blue
        icon: "📝",
    },
    [ScoreDimension.RELEVANCE]: {
        displayName: "Relevance to Question/Job",
        shortName: "Relevance",
        index: 1,
        color: "#8b5cf6", // purple
        icon: "🎯",
    },
    [ScoreDimension.KEYWORD_ALIGNMENT]: {
        displayName: "Keyword & Skill Alignment",
        shortName: "Keywords",
        index: 2,
        color: "#ec4899", // pink
        icon: "🔑",
    },
    [ScoreDimension.CONFIDENCE_DELIVERY]: {
        displayName: "Confidence & Delivery",
        shortName: "Confidence",
        index: 3,
        color: "#f59e0b", // amber
        icon: "💪",
    },
    [ScoreDimension.CONCISENESS_FOCUS]: {
        displayName: "Conciseness & Focus",
        shortName: "Conciseness",
        index: 4,
        color: "#10b981", // green
        icon: "✨",
    },
};

/**
 * Dimension Score Thresholds (based on percentage)
 */
export const DIMENSION_THRESHOLDS = {
    STRENGTH_THRESHOLD: 75, // Strength threshold (>= 75% is considered strength)
    WEAKNESS_THRESHOLD: 75, // Weakness threshold (< 75% is considered weakness)
};

/**
 * Default Configuration Values
 */
export const DEFAULT_CONFIG = {
    MAX_SESSIONS_PER_DAY: 10, // Maximum sessions per day
    DEFAULT_SESSION_DURATION: 30, // Default session duration (minutes)
    AUTOSAVE_INTERVAL: 30000, // Auto-save interval (milliseconds)
    NOTIFICATION_DURATION: 5000, // Notification display duration (milliseconds)
    CHART_MAX_POINTS: 50, // Maximum chart data points
    DAILY_QUOTE_CACHE_DURATION: 86400000, // Daily quote cache duration (milliseconds)
};

/**
 * Daily Motivational Quotes
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
