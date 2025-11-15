/**
 * Progress Page Data Service
 * Transforms user statistics into Progress page specific data structures
 */

import {
    getUserStatistics,
    getUserInterviewScores,
    getLatestInterviewQuestions,
    generateLoginCalendarData,
    calculateCurrentStreak,
    calculateMaxLoginStreak,
    calculateTotalLoginDays,
    type UserProgressData,
    type QuestionSummary,
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

    // Latest interview questions (NEW)
    latestInterviewQuestions: QuestionSummary[];

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
    // Fetch user statistics, interview scores, and latest interview questions in parallel
    const [stats, interviewScores, latestQuestions] = await Promise.all([
        getUserStatistics(token),
        getUserInterviewScores(token),
        getLatestInterviewQuestions(token),
    ]);

    // 🔍 DEBUG: Log raw interview data from backend
    console.log("=== Backend Interview Data Debug ===");
    console.log(
        "Total interviews from /user/statistics:",
        stats.interviews.length
    );
    console.log("Raw interview data:", stats.interviews);
    console.log(
        "Interview timestamps with dates:",
        stats.interviews.map((i) => ({
            id: i.interviewId,
            timestamp: i.timestamp,
            date: new Date(i.timestamp).toISOString(), // Timestamp is in milliseconds
            localDate: new Date(i.timestamp).toLocaleDateString(),
            dateOnly: new Date(i.timestamp).toISOString().split("T")[0],
        }))
    );
    console.log("====================================");

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

    // Generate login calendar data from interview timestamps
    // Each day with at least one interview counts as a "check-in"
    const loginData = generateLoginCalendarData(stats.interviews, 30);

    // Calculate check-in statistics from interview data
    const currentStreak = calculateCurrentStreak(stats.interviews);
    const maxLoginStreak = calculateMaxLoginStreak(stats.interviews);
    const totalLoginDays = calculateTotalLoginDays(stats.interviews);

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
        loginStreakDays: currentStreak,
        maxLoginStreak,
        totalLoginDays,
        dimensionPerformance,
        latestInterviewQuestions: latestQuestions,
        userId: stats.userId,
        userEmail: stats.userEmail,
        xp: stats.xp,
        totalInterviews: stats.totalInterviews,
        totalQuestions: stats.totalQuestions,
    };
}
