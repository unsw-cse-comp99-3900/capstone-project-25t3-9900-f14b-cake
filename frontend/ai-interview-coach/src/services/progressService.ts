/**
 * Progress Page Data Service
 * Transforms user statistics into Progress page specific data structures
 */

import {
    getUserStatistics,
    getUserInterviewScores,
    generateLoginCalendarData,
    calculateMaxLoginStreak,
    type UserProgressData,
} from "./userStatsService";
import { ScoreDimension } from "@/types";

/**
 * Interview session data for readiness score chart
 */
export interface ReadinessScoreData {
    session: number;
    score: number;
    date: Date;
}

/**
 * Login calendar data
 */
export interface LoginCalendarData {
    date: string;
    hasLogin: boolean;
}

/**
 * Dimension performance data for radar chart
 */
export interface DimensionPerformance {
    dimension: ScoreDimension;
    dimension_name: string;
    average_score: number; // 0-5 scale
    percentage: number; // 0-100 scale
    is_strength: boolean; // true if percentage >= 70
}

/**
 * Progress page data bundle
 */
export interface ProgressPageData {
    // Readiness score progression
    readinessScores: ReadinessScoreData[];

    // Login activity
    loginData: LoginCalendarData[];
    loginStreakDays: number;
    maxLoginStreak: number;
    totalLoginDays: number;

    // Performance dimensions
    dimensionPerformance: DimensionPerformance[];

    // User info
    userId: string;
    userEmail: string;
    xp: number;
    totalInterviews: number;
    totalQuestions: number;
}

/**
 * Fetches and transforms data for Progress page
 * @param token - JWT authentication token
 * @returns Structured data ready for Progress page consumption
 */
export async function getProgressPageData(
    token: string
): Promise<ProgressPageData> {
    // Fetch user statistics and interview scores in parallel
    const [stats, interviewScores] = await Promise.all([
        getUserStatistics(token),
        getUserInterviewScores(token),
    ]);

    // Transform interview scores to readiness scores
    // Each interview gets its own calculated average score (1-5 scale)
    const readinessScores: ReadinessScoreData[] = interviewScores.map(
        (interview, index) => ({
            session: index + 1,
            score: interview.averageScore, // Already in 1-5 scale
            date: interview.date,
        })
    );

    // If no interviews yet, provide a default
    if (readinessScores.length === 0) {
        readinessScores.push({
            session: 1,
            score: 0,
            date: new Date(),
        });
    }

    // Generate login calendar data
    const loginData = generateLoginCalendarData(stats, 30);

    // Calculate max login streak
    const maxLoginStreak = calculateMaxLoginStreak(stats);

    // Transform dimension performance for radar chart
    const dimensionMapping: Record<
        string,
        { name: string; dimension: ScoreDimension }
    > = {
        clarity: {
            name: "Clarity & Structure",
            dimension: ScoreDimension.CLARITY_STRUCTURE,
        },
        relevance: {
            name: "Relevance to Question/Job",
            dimension: ScoreDimension.RELEVANCE,
        },
        keyword: {
            name: "Keyword & Skill Alignment",
            dimension: ScoreDimension.KEYWORD_ALIGNMENT,
        },
        confidence: {
            name: "Confidence & Delivery",
            dimension: ScoreDimension.CONFIDENCE_DELIVERY,
        },
        conciseness: {
            name: "Conciseness & Focus",
            dimension: ScoreDimension.CONCISENESS_FOCUS,
        },
    };

    const dimensionPerformance: DimensionPerformance[] = Object.entries(
        stats.dimensions
    ).map(([key, value]) => {
        const mapping = dimensionMapping[key];
        return {
            dimension: mapping.dimension,
            dimension_name: mapping.name,
            average_score: value.average,
            percentage: value.percentage,
            is_strength: value.percentage >= 70, // 70% threshold for strength
        };
    });

    return {
        readinessScores,
        loginData,
        loginStreakDays: stats.loginStreak,
        maxLoginStreak,
        totalLoginDays: stats.totalLogins,
        dimensionPerformance,
        userId: stats.userId,
        userEmail: stats.userEmail,
        xp: stats.xp,
        totalInterviews: stats.totalInterviews,
        totalQuestions: stats.totalQuestions,
    };
}
