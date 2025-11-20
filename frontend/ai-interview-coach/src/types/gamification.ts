/**
 * Gamification System Data Type Definitions
 * Contains TypeScript interfaces for XP, badges, consecutive logins, and other features
 */

// ===============================
// Basic Data Types
// ===============================

/**
 * Badge Type Enumeration
 */
export enum BadgeType {
    // XP-related badges
    FIRST_XP = "FIRST_XP", // Earn first XP
    XP_100 = "XP_100", // Accumulate 100 XP
    XP_500 = "XP_500", // Accumulate 500 XP
    XP_1000 = "XP_1000", // Accumulate 1000 XPe 1000 XP

    // Answer-related badges
    FIRST_ANSWER = "FIRST_ANSWER", // First answer
    ANSWER_10 = "ANSWER_10", // Answer 10 questions
    ANSWER_50 = "ANSWER_50", // Answer 50 questions
    ANSWER_100 = "ANSWER_100", // Answer 100 questions

    // Login streak badgesstreak badges
    LOGIN_STREAK_3 = "LOGIN_STREAK_3", // 3-day login streak
    LOGIN_STREAK_7 = "LOGIN_STREAK_7", // 7-day login streak
    LOGIN_STREAK_30 = "LOGIN_STREAK_30", // 30-day login streak

    // Category performance badges (using British spelling for consistency with teammates)
    BEHAVIOURAL_MASTER = "BEHAVIOURAL_MASTER", // Behavioural category master
    TECHNICAL_MASTER = "TECHNICAL_MASTER", // Technical category master
    PSYCHOMETRIC_MASTER = "PSYCHOMETRIC_MASTER", // Psychometric assessment master

    // Special achievement badgesl achievement badges
    PERFECTIONIST = "PERFECTIONIST", // Perfectionist (consecutive perfect scores)
    IMPROVER = "IMPROVER", // Improver (continuous score improvement)
    DEDICATED = "DEDICATED", // Dedicated (long-term practice persistence)
}

/**
 * Badge Interface
 */
export interface Badge {
    id: BadgeType;
    name: string; // Badge name
    description: string; // Badge description
    icon: string; // Badge icon (Heroicon name or emoji)
    unlockedAt: Date | null; // Unlock time, null means not unlocked
    progress?: number; // Unlock progress (0-100), optional
    requirement: number; // Requirement value for unlocking
}

/**
 * XP Level Configuration
 */
export interface XPLevel {
    level: number; // Level
    minXP: number; // Minimum XP required for this level
    maxXP: number; // Maximum XP for this level
    title: string; // Level title
    color: string; // Level color (Tailwind CSS class name)
}

/**
 * XP Reward Configuration
 */
export interface XPReward {
    action: string; // Action type
    baseXP: number; // Base XP reward
    multiplier?: number; // Multiplier (optional)
    description: string; // Reward description
}

// ===============================
// Gamification State Interfaces
// ===============================

/**
 * User Gamification Status Interface
 */
export interface UserGamification {
    // Basic information
    userId: string; // User ID (username)

    // XP system
    totalXP: number; // Total XP
    currentLevel: number; // Current level
    levelProgress: number; // Current level progress percentage (0-100)

    // Badge system
    badges: Badge[]; // All badges (including unlocked and locked)
    unlockedBadges: BadgeType[]; // List of unlocked badge IDs

    // Consecutive login system
    loginStreak: number; // Current consecutive login days
    maxLoginStreak: number; // Historical maximum consecutive login days
    lastLoginDate: string | null; // Last login date (YYYY-MM-DD)
    totalLoginDays: number; // Total login days

    // Answer statistics
    totalAnswers: number; // Total number of answers
    correctAnswers: number; // Number of correct answers
    accuracyRate: number; // Accuracy rate (0-100)

    // Session statistics
    totalSessions: number; // Total number of sessions
    completedSessions: number; // Number of completed sessions

    // Timestamp
    createdAt: string; // Creation time
    updatedAt: string; // Last update time
}

/**
 * Gamification Operation Result
 */
export interface GamificationResult {
    success: boolean; // Whether the operation was successful
    xpGained?: number; // XP gained
    levelUp?: boolean; // Whether leveled up
    newLevel?: number; // New level
    badgesUnlocked?: BadgeType[]; // Newly unlocked badges
    message?: string; // Notification message
}

/**
 * Daily Login Reward
 */
export interface DailyLoginReward {
    day: number; // Which day of consecutive login
    xpReward: number; // XP reward
    quote: string; // Daily motivational quote
    bonusMessage: string; // Reward notification message
}
