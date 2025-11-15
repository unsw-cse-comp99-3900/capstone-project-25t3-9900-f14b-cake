/**
 * User Statistics Service
 * Handles fetching and transforming user statistics data for Progress and Game pages
 */

import { API_ENDPOINTS, getAuthHeaders, apiFetch } from "./api";

/**
 * Question feedback structure from backend
 */
export interface QuestionFeedback {
    clarity_structure_score: number;
    clarity_structure_feedback?: string;
    relevance_score: number;
    relevance_feedback?: string;
    keyword_alignment_score: number;
    keyword_alignment_feedback?: string;
    confidence_score: number;
    confidence_feedback?: string;
    conciseness_score: number;
    conciseness_feedback?: string;
    overall_summary?: string;
    overall_score?: number;
    [key: string]: any; // Allow other fields
}

/**
 * Question detail from /user/detail endpoint
 */
export interface QuestionDetail {
    question_id: string;
    question: string;
    answer: string;
    feedback: QuestionFeedback;
    timestamp: number;
}

/**
 * Interview detail from /user/detail endpoint
 */
export interface InterviewDetail {
    interview_id: string;
    interview_time: number;
    is_like: boolean;
    questions: QuestionDetail[];
}

/**
 * User detail API response from /user/detail endpoint
 */
export interface UserDetailAPIResponse {
    user_id: string;
    user_email: string;
    xp: number;
    total_interviews: number;
    total_questions: number;
    interviews: InterviewDetail[];
    badges: Array<{
        badge_id: number;
        unlock_date: number;
    }>;
}

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

/**
 * Interview score data with calculated average
 */
export interface InterviewScore {
    interviewId: string;
    timestamp: number;
    date: Date;
    averageScore: number; // Average of all questions in this interview (1-5 scale)
    questionCount: number;
}

/**
 * Fetches user interview details and calculates average score for each interview
 * @param token - JWT authentication token
 * @returns Array of interview scores
 */
export async function getUserInterviewScores(
    token: string
): Promise<InterviewScore[]> {
    const data = await apiFetch<UserDetailAPIResponse>(
        API_ENDPOINTS.user.detail,
        {
            method: "GET",
            headers: getAuthHeaders(token),
        }
    );

    // Calculate average score for each interview
    const interviewScores: InterviewScore[] = data.interviews.map(
        (interview) => {
            // Calculate average score across all questions in this interview
            let totalScore = 0;
            let validQuestionCount = 0;

            interview.questions.forEach((question) => {
                if (question.feedback) {
                    // Sum up all 5 dimensions for this question
                    const questionScore =
                        (question.feedback.clarity_structure_score +
                            question.feedback.relevance_score +
                            question.feedback.keyword_alignment_score +
                            question.feedback.confidence_score +
                            question.feedback.conciseness_score) /
                        5;

                    totalScore += questionScore;
                    validQuestionCount++;
                }
            });

            // Average score for this interview (1-5 scale)
            const averageScore =
                validQuestionCount > 0 ? totalScore / validQuestionCount : 0;

            return {
                interviewId: interview.interview_id,
                timestamp: interview.interview_time,
                date: new Date(interview.interview_time),
                averageScore: Number(averageScore.toFixed(2)),
                questionCount: interview.questions.length,
            };
        }
    );

    // Sort by timestamp (oldest first)
    return interviewScores.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Question summary for display
 */
export interface QuestionSummary {
    questionId: string;
    questionText: string;
    answer: string;
    overallSummary: string;
    overallScore: number;
    averageScore: number; // Average of 5 dimensions
}

/**
 * Fetches the most recent interview's question summaries
 * @param token - JWT authentication token
 * @returns Array of question summaries from the most recent interview
 */
export async function getLatestInterviewQuestions(
    token: string
): Promise<QuestionSummary[]> {
    const data = await apiFetch<UserDetailAPIResponse>(
        API_ENDPOINTS.user.detail,
        {
            method: "GET",
            headers: getAuthHeaders(token),
        }
    );

    // If no interviews, return empty array
    if (!data.interviews || data.interviews.length === 0) {
        return [];
    }

    // Sort interviews by timestamp to get the most recent one
    const sortedInterviews = [...data.interviews].sort(
        (a, b) => b.interview_time - a.interview_time
    );
    const latestInterview = sortedInterviews[0];

    // Transform questions to question summaries
    const questionSummaries: QuestionSummary[] = latestInterview.questions.map(
        (question) => {
            // Calculate average score from 5 dimensions
            const averageScore =
                (question.feedback.clarity_structure_score +
                    question.feedback.relevance_score +
                    question.feedback.keyword_alignment_score +
                    question.feedback.confidence_score +
                    question.feedback.conciseness_score) /
                5;

            return {
                questionId: question.question_id,
                questionText: question.question,
                answer: question.answer,
                overallSummary:
                    question.feedback.overall_summary || "No summary available",
                overallScore: question.feedback.overall_score || averageScore,
                averageScore: Number(averageScore.toFixed(2)),
            };
        }
    );

    return questionSummaries;
}
