/**
 * 进度追踪系统数据类型定义
 * 包含会话记录、分数统计、类别表现等功能的TypeScript接口
 */

// ===============================
// 基础枚举类型
// ===============================

/**
 * 面试类别枚举
 */
export enum InterviewCategory {
    BEHAVIORAL = "BEHAVIORAL", // 行为面试
    TECHNICAL = "TECHNICAL", // 技术面试
    PSYCHOMETRIC = "PSYCHOMETRIC", // 心理测评
}

/**
 * 会话状态枚举
 */
export enum SessionStatus {
    IN_PROGRESS = "IN_PROGRESS", // 进行中
    COMPLETED = "COMPLETED", // 已完成
    ABANDONED = "ABANDONED", // 已放弃
    INTERRUPTED = "INTERRUPTED", // 中断
}

/**
 * 难度等级枚举
 */
export enum DifficultyLevel {
    BEGINNER = "BEGINNER", // 初级
    INTERMEDIATE = "INTERMEDIATE", // 中级
    ADVANCED = "ADVANCED", // 高级
    EXPERT = "EXPERT", // 专家级
}

/**
 * 时间范围枚举（用于图表筛选）
 */
export enum TimeRange {
    WEEKLY = "WEEKLY", // 周视图
    MONTHLY = "MONTHLY", // 月视图
    ALL_TIME = "ALL_TIME", // 全部时间
}

// ===============================
// 会话和答题相关接口
// ===============================

/**
 * 单个答题记录
 */
export interface AnswerRecord {
    questionId: string; // 题目ID
    question: string; // 题目内容
    userAnswer: string; // 用户答案
    aiFeedback?: string; // AI反馈（可选）
    score: number; // 得分 (0-100)
    category: InterviewCategory; // 题目类别
    difficulty: DifficultyLevel; // 难度等级
    timeSpent: number; // 答题用时（秒）
    answeredAt: string; // 答题时间戳
}

/**
 * 面试会话记录
 */
export interface SessionRecord {
    // 基础信息
    sessionId: string; // 会话ID
    userId: string; // 用户ID

    // 会话配置
    category: InterviewCategory; // 主要类别
    difficulty: DifficultyLevel; // 难度等级
    expectedDuration: number; // 预期时长（分钟）

    // 会话状态
    status: SessionStatus; // 会话状态
    startTime: string; // 开始时间
    endTime?: string; // 结束时间（可选）
    actualDuration?: number; // 实际时长（分钟）

    // 答题记录
    answers: AnswerRecord[]; // 答题记录列表
    totalQuestions: number; // 总题目数
    answeredQuestions: number; // 已答题目数

    // 分数统计
    overallScore: number; // 总体分数 (0-100)
    categoryScores: CategoryScores; // 各类别分数
    readinessScore: number; // 准备度分数 (0-100)

    // 表现分析
    strengths: string[]; // 优势领域
    weaknesses: string[]; // 需要改进的领域
    recommendations: string[]; // 推荐练习内容

    // 元数据
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
}

/**
 * 类别分数统计
 */
export interface CategoryScores {
    [InterviewCategory.BEHAVIORAL]: number; // 行为面试分数
    [InterviewCategory.TECHNICAL]: number; // 技术面试分数
    [InterviewCategory.PSYCHOMETRIC]: number; // 心理测评分数
}

/**
 * 类别表现详情
 */
export interface CategoryPerformance {
    category: InterviewCategory; // 类别
    currentScore: number; // 当前分数
    averageScore: number; // 平均分数
    bestScore: number; // 最高分数
    improvementRate: number; // 改进率 (正数表示提升，负数表示下降)
    isWeakArea: boolean; // 是否为弱项（低于阈值）
    sessionsCount: number; // 该类别的会话次数
    lastPracticed: string; // 最后练习时间
    recommendations: string[]; // 针对性建议
}

// ===============================
// 进度统计和分析接口
// ===============================

/**
 * 用户进度统计
 */
export interface UserProgress {
    // 基础信息
    userId: string; // 用户ID

    // 会话统计
    sessions: SessionRecord[]; // 所有会话记录
    totalSessions: number; // 总会话数
    completedSessions: number; // 完成的会话数
    completionRate: number; // 完成率 (0-100)

    // 分数统计
    currentReadinessScore: number; // 当前准备度分数
    averageReadinessScore: number; // 平均准备度分数
    bestReadinessScore: number; // 最佳准备度分数
    readinessScoreHistory: ReadinessScorePoint[]; // 准备度分数历史

    // 类别表现
    categoryPerformances: CategoryPerformance[]; // 各类别表现详情
    overallCategoryScores: CategoryScores; // 总体类别分数

    // 时间统计
    totalPracticeTime: number; // 总练习时间（分钟）
    averageSessionDuration: number; // 平均会话时长（分钟）
    practiceFrequency: number; // 练习频率（次/周）

    // 趋势分析
    improvementTrend: "IMPROVING" | "STABLE" | "DECLINING"; // 改进趋势
    consistencyScore: number; // 练习一致性分数 (0-100)

    // 目标和里程碑
    targetReadinessScore?: number; // 目标准备度分数（可选）
    nextMilestone?: string; // 下一个里程碑（可选）

    // 时间戳
    firstSessionDate: string; // 第一次会话日期
    lastSessionDate: string; // 最后一次会话日期
    lastUpdated: string; // 最后更新时间
}

/**
 * 准备度分数时间点
 */
export interface ReadinessScorePoint {
    date: string; // 日期 (YYYY-MM-DD)
    score: number; // 分数 (0-100)
    sessionId: string; // 对应的会话ID
    category: InterviewCategory; // 主要类别
}

/**
 * 图表数据点（用于可视化）
 */
export interface ChartDataPoint {
    x: string | number; // X轴数据（日期或索引）
    y: number; // Y轴数据（分数）
    label?: string; // 标签（可选）
    category?: InterviewCategory; // 类别（可选）
}

/**
 * 进度分析结果
 */
export interface ProgressAnalysis {
    // 总体评估
    overallAssessment: string; // 总体评估描述
    readinessLevel: "LOW" | "MEDIUM" | "HIGH" | "EXCELLENT"; // 准备度等级

    // 优势和弱项
    topStrengths: string[]; // 主要优势
    primaryWeaknesses: string[]; // 主要弱项

    // 改进建议
    priorityRecommendations: string[]; // 优先改进建议
    practiceAreas: InterviewCategory[]; // 推荐练习的类别

    // 预测和目标
    projectedImprovement: number; // 预测改进幅度
    estimatedTimeToTarget?: number; // 预计达到目标的时间（天）

    // 比较数据
    percentileRank?: number; // 百分位排名（可选）
    benchmarkComparison?: string; // 基准比较（可选）
}
