/**
 * User Statistics Service
 * Handles fetching and transforming user statistics data for Progress and Game pages
 */

import { API_ENDPOINTS, getAuthHeaders, apiFetch } from "./api";

/**
 * Raw API response from /user/statistics endpoint
 */
export interface UserStatisticsAPIResponse {
    user_id: string;
    user_email: string;
    xp: number;
    interviews: Array<{
        interview_id: string;
        timestamp: number;
    }>;
    badges: Array<{
        badge_id: number;
        unlocked_timestamp: number;
    }>;
    total_questions: number;
    total_interviews: number;
    total_badges: number;
    total_logins: number;
    last_login: string;
    consecutive_days: number;
    max_clarity: number;
    max_relevance: number;
    max_keyword: number;
    max_confidence: number;
    max_conciseness: number;
    max_overall: number;
    total_clarity: number;
    total_relevance: number;
    total_keyword: number;
    total_confidence: number;
    total_conciseness: number;
    total_overall: number;
}

/**
 * Transformed data structure for frontend consumption
 */
export interface UserProgressData {
    // User info
    userId: string;
    userEmail: string;
    xp: number;

    // Badge data (for Game page)
    badges: Array<{
        badgeId: number;
        unlockedTimestamp: number;
        unlockedDate: Date;
    }>;
    totalBadges: number;

    // Login data (for Progress page - Login Activity section)
    loginStreak: number;
    totalLogins: number;
    lastLogin: string;
    lastLoginDate: Date;

    // Interview statistics (for Progress page)
    totalInterviews: number;
    totalQuestions: number;
    interviews: Array<{
        interviewId: string;
        timestamp: number;
        date: Date;
    }>;

    // Performance dimensions (for Progress page - Radar Chart)
    dimensions: {
        clarity: {
            max: number;
            total: number;
            average: number;
            percentage: number; // 0-100
        };
        relevance: {
            max: number;
            total: number;
            average: number;
            percentage: number;
        };
        keyword: {
            max: number;
            total: number;
            average: number;
            percentage: number;
        };
        confidence: {
            max: number;
            total: number;
            average: number;
            percentage: number;
        };
        conciseness: {
            max: number;
            total: number;
            average: number;
            percentage: number;
        };
    };
    overallScore: {
        max: number;
        total: number;
        average: number;
    };
}

/**
 * Fetches comprehensive user statistics from the backend
 * @param token - JWT authentication token
 * @returns Transformed user progress data
 */
export async function getUserStatistics(
    token: string
): Promise<UserProgressData> {
    const data = await apiFetch<UserStatisticsAPIResponse>(
        API_ENDPOINTS.user.statistics,
        {
            method: "GET",
            headers: getAuthHeaders(token),
        }
    );

    // Transform badges data
    const badges = data.badges.map((badge) => ({
        badgeId: badge.badge_id,
        unlockedTimestamp: badge.unlocked_timestamp,
        unlockedDate: new Date(badge.unlocked_timestamp * 1000),
    }));

    // Transform interviews data
    const interviews = data.interviews.map((interview) => ({
        interviewId: interview.interview_id,
        timestamp: interview.timestamp,
        date: new Date(interview.timestamp * 1000),
    }));

    // Calculate averages and percentages for each dimension (5-point scale to percentage)
    const calculateDimensionStats = (
        max: number,
        total: number,
        questionCount: number
    ) => {
        const average = questionCount > 0 ? total / questionCount : 0;
        const percentage = (average / 5) * 100; // Convert 5-point scale to percentage
        return {
            max,
            total,
            average: Number(average.toFixed(2)),
            percentage: Number(percentage.toFixed(1)),
        };
    };

    const questionCount = data.total_questions || 1; // Avoid division by zero

    return {
        // User info
        userId: data.user_id,
        userEmail: data.user_email,
        xp: data.xp,

        // Badge data
        badges,
        totalBadges: data.total_badges,

        // Login data
        loginStreak: data.consecutive_days,
        totalLogins: data.total_logins,
        lastLogin: data.last_login,
        lastLoginDate: new Date(data.last_login),

        // Interview statistics
        totalInterviews: data.total_interviews,
        totalQuestions: data.total_questions,
        interviews,

        // Performance dimensions
        dimensions: {
            clarity: calculateDimensionStats(
                data.max_clarity,
                data.total_clarity,
                questionCount
            ),
            relevance: calculateDimensionStats(
                data.max_relevance,
                data.total_relevance,
                questionCount
            ),
            keyword: calculateDimensionStats(
                data.max_keyword,
                data.total_keyword,
                questionCount
            ),
            confidence: calculateDimensionStats(
                data.max_confidence,
                data.total_confidence,
                questionCount
            ),
            conciseness: calculateDimensionStats(
                data.max_conciseness,
                data.total_conciseness,
                questionCount
            ),
        },
        overallScore: {
            max: data.max_overall,
            total: data.total_overall,
            average:
                questionCount > 0
                    ? Number((data.total_overall / questionCount).toFixed(2))
                    : 0,
        },
    };
}

/**
 * Generate mock login data for calendar visualization
 * This converts the login statistics into calendar-compatible format
 * @param stats - User progress data
 * @param daysBack - Number of days to look back (default 30)
 * @returns Array of login dates with hasLogin flag
 */
export function generateLoginCalendarData(
    stats: UserProgressData,
    daysBack: number = 30
): Array<{ date: string; hasLogin: boolean }> {
    const result: Array<{ date: string; hasLogin: boolean }> = [];
    const today = new Date();

    // Generate dates for the last N days
    for (let i = daysBack - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // For now, mark recent days as logged in based on streak
        // In production, this should come from backend with actual login dates
        const hasLogin = i < stats.loginStreak;

        result.push({
            date: dateStr,
            hasLogin,
        });
    }

    return result;
}

/**
 * Calculate max login streak from login history
 * This is a helper function until backend provides this data
 * @param stats - User progress data
 * @returns Maximum consecutive login streak
 */
export function calculateMaxLoginStreak(stats: UserProgressData): number {
    // For now, return a calculated value
    // In production, this should come directly from backend
    return Math.max(stats.loginStreak, 7);
}
