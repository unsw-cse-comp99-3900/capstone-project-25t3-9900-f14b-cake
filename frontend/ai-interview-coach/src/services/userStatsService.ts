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
    // Note: Backend returns timestamp in milliseconds, not seconds
    const interviews = data.interviews.map((interview) => ({
        interviewId: interview.interview_id,
        timestamp: interview.timestamp,
        date: new Date(interview.timestamp), // Already in milliseconds
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
 * Generate login/check-in data from interview timestamps
 * Each day with at least one interview counts as a "check-in"
 * @param interviews - Array of interview data with timestamps
 * @param daysBack - Number of days to look back (default 30)
 * @returns Array of login dates with hasLogin flag
 */
export function generateLoginCalendarData(
    interviews: Array<{ timestamp: number }>,
    daysBack: number = 30
): Array<{ date: string; hasLogin: boolean }> {
    const result: Array<{ date: string; hasLogin: boolean }> = [];
    const today = new Date();

    // Create a Set of interview dates (YYYY-MM-DD format) for O(1) lookup
    // Note: Backend returns timestamp in milliseconds, not seconds
    // Use local date to avoid timezone offset issues
    const interviewDates = new Set<string>();
    interviews.forEach((interview) => {
        const interviewDate = new Date(interview.timestamp);
        console.log("🔍 Debug interview timestamp:", {
            rawTimestamp: interview.timestamp,
            timestampLength: String(interview.timestamp).length,
            dateObject: interviewDate,
            toISOString: interviewDate.toISOString(),
            getFullYear: interviewDate.getFullYear(),
            getMonth: interviewDate.getMonth() + 1,
            getDate: interviewDate.getDate(),
            toLocaleDateString: interviewDate.toLocaleDateString("en-CA"),
        });
        // Use local date instead of UTC to avoid timezone issues
        const year = interviewDate.getFullYear();
        const month = String(interviewDate.getMonth() + 1).padStart(2, "0");
        const day = String(interviewDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        console.log("📅 Generated dateStr:", dateStr);
        interviewDates.add(dateStr);
    });

    // Generate dates for the last N days and check if each has an interview
    for (let i = daysBack - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        // Use local date instead of UTC
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        result.push({
            date: dateStr,
            hasLogin: interviewDates.has(dateStr),
        });
    }

    return result;
}

/**
 * Calculate current consecutive check-in streak (strict: every day must have interview)
 * @param interviews - Array of interview data with timestamps
 * @returns Number of consecutive days with interviews (counting backwards from today)
 */
export function calculateCurrentStreak(
    interviews: Array<{ timestamp: number }>
): number {
    if (interviews.length === 0) return 0;

    // Create a Set of interview dates for O(1) lookup
    // Note: Backend returns timestamp in milliseconds, not seconds
    // Use local date to avoid timezone offset issues
    const interviewDates = new Set<string>();
    interviews.forEach((interview) => {
        const interviewDate = new Date(interview.timestamp);
        const year = interviewDate.getFullYear();
        const month = String(interviewDate.getMonth() + 1).padStart(2, "0");
        const day = String(interviewDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        interviewDates.add(dateStr);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day

    let streak = 0;
    let currentDate = new Date(today);

    // Count backwards from today until we find a day without an interview
    while (true) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        if (!interviewDates.has(dateStr)) {
            break;
        }
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

/**
 * Calculate maximum consecutive check-in streak from all interview history
 * @param interviews - Array of interview data with timestamps
 * @returns Maximum number of consecutive days with interviews
 */
export function calculateMaxLoginStreak(
    interviews: Array<{ timestamp: number }>
): number {
    if (interviews.length === 0) return 0;

    // Create a sorted Set of unique interview dates
    // Note: Backend returns timestamp in milliseconds, not seconds
    // Use local date to avoid timezone offset issues
    const interviewDates = new Set<string>();
    interviews.forEach((interview) => {
        const interviewDate = new Date(interview.timestamp);
        const year = interviewDate.getFullYear();
        const month = String(interviewDate.getMonth() + 1).padStart(2, "0");
        const day = String(interviewDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        interviewDates.add(dateStr);
    });

    // Convert to sorted array
    const sortedDates = Array.from(interviewDates).sort();

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);

        // Calculate difference in days
        const diffTime = currDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            // Streak broken
            currentStreak = 1;
        }
    }

    return maxStreak;
}

/**
 * Calculate total unique check-in days from interview history
 * @param interviews - Array of interview data with timestamps
 * @returns Total number of unique days with at least one interview
 */
export function calculateTotalLoginDays(
    interviews: Array<{ timestamp: number }>
): number {
    if (interviews.length === 0) return 0;

    // Create a Set of unique interview dates
    // Note: Backend returns timestamp in milliseconds, not seconds
    // Use local date to avoid timezone offset issues
    const interviewDates = new Set<string>();
    interviews.forEach((interview) => {
        const interviewDate = new Date(interview.timestamp);
        const year = interviewDate.getFullYear();
        const month = String(interviewDate.getMonth() + 1).padStart(2, "0");
        const day = String(interviewDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        interviewDates.add(dateStr);
    });

    return interviewDates.size;
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
