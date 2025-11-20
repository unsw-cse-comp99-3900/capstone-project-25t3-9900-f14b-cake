/**
 * Progress Tracking System Data Type Definitions
 * Contains TypeScript interfaces for session records, score statistics, category performance, and other features
 */

// ===============================
// Basic Enumeration Types
// ===============================

/**
 * Interview Category Enumeration
 */
export enum InterviewCategory {
    BEHAVIOURAL = "BEHAVIOURAL", // Behavioral interview (British spelling, consistent with teammates)
    TECHNICAL = "TECHNICAL", // Technical interview
    PSYCHOMETRIC = "PSYCHOMETRIC", // Psychometric assessment
}

/**
 * Score Dimension Enumeration (5 dimensions from interview_score array)
 */
export enum ScoreDimension {
    CLARITY_STRUCTURE = "CLARITY_STRUCTURE", // Clarity and structure (index 0)
    RELEVANCE = "RELEVANCE", // Relevance (index 1)
    KEYWORD_ALIGNMENT = "KEYWORD_ALIGNMENT", // Keyword matching (index 2)
    CONFIDENCE_DELIVERY = "CONFIDENCE_DELIVERY", // Confident delivery (index 3)
    CONCISENESS_FOCUS = "CONCISENESS_FOCUS", // Conciseness and focus (index 4)
}

/**
 * Session Status Enumeration
 */
export enum SessionStatus {
    IN_PROGRESS = "IN_PROGRESS", // In progress
    COMPLETED = "COMPLETED", // Completed
    ABANDONED = "ABANDONED", // Abandoned
    INTERRUPTED = "INTERRUPTED", // Interrupted
}

/**
 * Difficulty Level Enumeration
 */
export enum DifficultyLevel {
    BEGINNER = "BEGINNER", // Beginner
    INTERMEDIATE = "INTERMEDIATE", // Intermediate
    ADVANCED = "ADVANCED", // Advanced
    EXPERT = "EXPERT", // Expert
}

/**
 * Time Range Enumeration (for chart filtering)
 */
export enum TimeRange {
    WEEKLY = "WEEKLY", // Week view
    MONTHLY = "MONTHLY", // Month view
    ALL_TIME = "ALL_TIME", // All time
}

// ===============================
// Session and Answer Related Interfaces
// ===============================

/**
 * Single Answer Record
 */
export interface AnswerRecord {
    questionId: string; // Question ID
    question: string; // Question content
    userAnswer: string; // User's answer
    aiFeedback?: string; // AI feedback (optional)
    score: number; // Score (0-100)
    category: InterviewCategory; // Question category
    difficulty: DifficultyLevel; // Difficulty level
    timeSpent: number; // Time spent answering (seconds)
    answeredAt: string; // Timestamp of answer
}

/**
 * Interview Session Record
 */
export interface SessionRecord {
    // Basic information
    sessionId: string; // Session ID
    userId: string; // User ID

    // Session configuration
    category: InterviewCategory; // Main category
    difficulty: DifficultyLevel; // Difficulty level
    expectedDuration: number; // Expected duration (minutes)

    // Session statusion status
    status: SessionStatus; // Session status
    startTime: string; // Start time
    endTime?: string; // End time (optional)
    actualDuration?: number; // Actual duration (minutes)

    // Answer recordser records
    answers: AnswerRecord[]; // List of answer records
    totalQuestions: number; // Total number of questions
    answeredQuestions: number; // Number of answered questions

    // Score statistics
    overallScore: number; // Overall score (0-100)
    categoryScores: CategoryScores; // Category scores
    readinessScore: number; // Readiness score (0-100)

    // Performance analysisormance analysis
    strengths: string[]; // Strength areas
    weaknesses: string[]; // Areas for improvement
    recommendations: string[]; // Recommended practice content

    // Metadata
    createdAt: string; // Creation time
    updatedAt: string; // Update time
}

/**
 * Category Score Statistics
 */
export interface CategoryScores {
    [InterviewCategory.BEHAVIOURAL]: number; // Behavioral interview score
    [InterviewCategory.TECHNICAL]: number; // Technical interview score
    [InterviewCategory.PSYCHOMETRIC]: number; // Psychometric assessment score
}

/**
 * Category Performance Details
 */
export interface CategoryPerformance {
    category: InterviewCategory; // Category
    currentScore: number; // Current score
    averageScore: number; // Average score
    bestScore: number; // Best score
    improvementRate: number; // Improvement rate (positive for improvement, negative for decline)
    isWeakArea: boolean; // Whether it's a weak area (below threshold)
    sessionsCount: number; // Number of sessions in this category
    lastPracticed: string; // Last practice time
    recommendations: string[]; // Targeted recommendations
}

/**
 * Dimension Performance Details (new: corresponding to 5 scoring dimensions returned by API)
 */
export interface DimensionPerformance {
    dimension: ScoreDimension; // Dimension type
    dimensionName: string; // Dimension display name
    averageScore: number; // Average score (1-5)
    percentage: number; // Percentage (0-100)
    isStrength: boolean; // Whether it's a strength (>= 75%)
}

// ===============================
// Progress Statistics and Analysis Interfaces
// ===============================

/**
 * User Progress Statistics
 */
export interface UserProgress {
    // Basic information
    userId: string; // User ID

    // Session statistics
    sessions: SessionRecord[]; // All session records
    totalSessions: number; // Total number of sessions
    completedSessions: number; // Number of completed sessions
    completionRate: number; // Completion rate (0-100)

    // Score statistics
    currentReadinessScore: number; // Current readiness score
    averageReadinessScore: number; // Average readiness score
    bestReadinessScore: number; // Best readiness score
    readinessScoreHistory: ReadinessScorePoint[]; // Readiness score history

    // Category performance
    categoryPerformances: CategoryPerformance[]; // Category performance details
    overallCategoryScores: CategoryScores; // Overall category scores

    // Time statistics
    totalPracticeTime: number; // Total practice time (minutes)
    averageSessionDuration: number; // Average session duration (minutes)
    practiceFrequency: number; // Practice frequency (times/week)

    // Trend analysis
    improvementTrend: "IMPROVING" | "STABLE" | "DECLINING"; // Improvement trend
    consistencyScore: number; // Practice consistency score (0-100)

    // Goals and milestones
    targetReadinessScore?: number; // Target readiness score (optional)
    nextMilestone?: string; // Next milestone (optional)

    // Timestamp
    firstSessionDate: string; // First session date
    lastSessionDate: string; // Last session date
    lastUpdated: string; // Last update time
}

/**
 * Readiness Score Time Point
 */
export interface ReadinessScorePoint {
    date: string; // Date (YYYY-MM-DD)
    score: number; // Score (0-100)
    sessionId: string; // Corresponding session ID
    category: InterviewCategory; // Main category
}

/**
 * Chart Data Point (for visualization)
 */
export interface ChartDataPoint {
    x: string | number; // X-axis data (date or index)
    y: number; // Y-axis data (score)
    label?: string; // Label (optional)
    category?: InterviewCategory; // Category (optional)
}

/**
 * Progress Analysis Result
 */
export interface ProgressAnalysis {
    // Overall assessment
    overallAssessment: string; // Overall assessment description
    readinessLevel: "LOW" | "MEDIUM" | "HIGH" | "EXCELLENT"; // Readiness level

    // Strengths and weaknesses
    topStrengths: string[]; // Main strengths
    primaryWeaknesses: string[]; // Main weaknesses

    // Improvement recommendations
    priorityRecommendations: string[]; // Priority improvement recommendations
    practiceAreas: InterviewCategory[]; // Recommended practice categories

    // Predictions and goals
    projectedImprovement: number; // Projected improvement
    estimatedTimeToTarget?: number; // Estimated time to reach target (days)

    // Comparison data
    percentileRank?: number; // Percentile rank (optional)
    benchmarkComparison?: string; // Benchmark comparison (optional)
}
