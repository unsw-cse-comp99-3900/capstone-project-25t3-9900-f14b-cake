/**
 * Game Page Data Service
 * Transforms user statistics into Game page specific data structures
 */

import { getUserStatistics, type UserProgressData } from "./userStatsService";

/**
 * Badge unlock data with name and description
 */
export interface BadgeUnlockData {
    badgeId: number;
    name?: string;
    description?: string;
    unlockedTimestamp: number;
    unlockedDate: Date;
    isUnlocked: boolean;
}

/**
 * User XP and level data
 */
export interface UserXPData {
    currentXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    levelProgress: number; // 0-100 percentage
}

/**
 * Game page data bundle
 */
export interface GamePageData {
    // Badge system
    badges: BadgeUnlockData[];
    totalBadges: number;
    unlockedBadges: number;

    // XP and leveling
    xpData: UserXPData;

    // User info
    userId: string;
    userEmail: string;
}

/**
 * Calculate user level and XP progress
 * Using a simple leveling formula: level = floor(sqrt(XP / 100))
 * Each level requires: (level + 1)^2 * 100 XP
 */
function calculateLevel(xp: number): UserXPData {
    const currentLevel = Math.floor(Math.sqrt(xp / 100));
    const currentLevelXP = currentLevel * currentLevel * 100;
    const nextLevelXP = (currentLevel + 1) * (currentLevel + 1) * 100;
    const xpToNextLevel = nextLevelXP - xp;
    const levelProgress =
        ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
        currentXP: xp,
        currentLevel,
        xpToNextLevel,
        levelProgress: Math.min(100, Math.max(0, levelProgress)),
    };
}

/**
 * Get all possible badge IDs (1-30 based on badge design)
 * This should match the BADGE_DESIGN.md specification
 */
function getAllBadgeIds(): number[] {
    return Array.from({ length: 30 }, (_, i) => i + 1);
}

/**
 * 所有徽章的静态信息(基于后端数据库)
 * 这些信息与后端 badge 表对应
 */
const ALL_BADGES_INFO = [
    {
        badgeId: 1,
        name: "First Steps",
        description: "Start your interview preparation journey",
        icon: "🎯",
    },
    {
        badgeId: 2,
        name: "Ice Breaker",
        description: "Take the first step!",
        icon: "❄️",
    },
    {
        badgeId: 3,
        name: "Answer Rookie",
        description: "Continuous practice",
        icon: "🌱",
    },
    {
        badgeId: 4,
        name: "Answer Expert",
        description: "Rich experience!",
        icon: "⭐",
    },
    {
        badgeId: 5,
        name: "Answer Master",
        description: "True answering expert",
        icon: "👑",
    },
    {
        badgeId: 6,
        name: "Night Owl",
        description: "Dedicated night worker",
        icon: "🌙",
    },
    {
        badgeId: 7,
        name: "Early Bird",
        description: "Morning motivation",
        icon: "🌅",
    },
];

/**
 * Fetches and transforms data for Game page
 * @param token - JWT authentication token
 * @returns Structured data ready for Game page consumption
 */
export async function getGamePageData(token: string): Promise<GamePageData> {
    // Fetch user statistics
    const stats = await getUserStatistics(token);

    // 创建已解锁徽章的 Map (badge_id -> unlock_timestamp)
    const unlockedBadgesMap = new Map(
        stats.badges.map((badge) => [badge.badgeId, badge.unlockedTimestamp])
    );

    // 合并所有徽章信息(静态信息 + 解锁状态)
    const badges: BadgeUnlockData[] = ALL_BADGES_INFO.map((badgeInfo) => {
        const unlockedTimestamp = unlockedBadgesMap.get(badgeInfo.badgeId) || 0;
        const isUnlocked = unlockedTimestamp > 0;

        return {
            badgeId: badgeInfo.badgeId,
            name: badgeInfo.name,
            description: badgeInfo.description,
            unlockedTimestamp,
            unlockedDate: isUnlocked
                ? new Date(unlockedTimestamp * 1000)
                : new Date(0),
            isUnlocked,
        };
    });

    // Calculate XP and level
    const xpData = calculateLevel(stats.xp);

    // 统计已解锁的徽章数量
    const unlockedCount = badges.filter((b) => b.isUnlocked).length;

    return {
        badges,
        totalBadges: badges.length,
        unlockedBadges: unlockedCount,
        xpData,
        userId: stats.userId,
        userEmail: stats.userEmail,
    };
}

/**
 * Get badge progress percentage
 * @param gameData - Game page data
 * @returns Percentage of badges unlocked (0-100)
 */
export function getBadgeProgress(gameData: GamePageData): number {
    if (gameData.totalBadges === 0) return 0;
    return Math.round((gameData.unlockedBadges / gameData.totalBadges) * 100);
}

/**
 * Get recently unlocked badges (last N badges)
 * @param gameData - Game page data
 * @param count - Number of recent badges to return (default 5)
 * @returns Array of recently unlocked badges, sorted by unlock time (newest first)
 */
export function getRecentlyUnlockedBadges(
    gameData: GamePageData,
    count: number = 5
): BadgeUnlockData[] {
    return gameData.badges
        .filter((badge) => badge.isUnlocked)
        .sort((a, b) => b.unlockedTimestamp - a.unlockedTimestamp)
        .slice(0, count);
}
