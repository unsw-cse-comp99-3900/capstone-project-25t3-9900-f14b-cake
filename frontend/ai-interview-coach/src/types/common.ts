/**
 * 通用数据类型和常量定义
 * 包含共享的接口、工具类型和配置常量
 */

import { BadgeType, XPLevel, XPReward } from "./gamification";
import { InterviewCategory, DifficultyLevel } from "./progress";

// ===============================
// 通用工具类型
// ===============================

/**
 * API响应包装器
 */
export interface ApiResponse<T> {
    success: boolean; // 请求是否成功
    data?: T; // 响应数据（可选）
    error?: string; // 错误信息（可选）
    message?: string; // 提示信息（可选）
    timestamp: string; // 响应时间戳
}

/**
 * 分页参数
 */
export interface PaginationParams {
    page: number; // 页码（从1开始）
    limit: number; // 每页数量
    sortBy?: string; // 排序字段（可选）
    sortOrder?: "ASC" | "DESC"; // 排序顺序（可选）
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
    items: T[]; // 数据项列表
    total: number; // 总数量
    page: number; // 当前页码
    limit: number; // 每页数量
    totalPages: number; // 总页数
    hasNext: boolean; // 是否有下一页
    hasPrev: boolean; // 是否有上一页
}

/**
 * 本地存储键枚举
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
 * 应用设置接口
 */
export interface AppSettings {
    // 主题设置
    theme: "light" | "dark" | "auto"; // 主题模式

    // 通知设置
    enableNotifications: boolean; // 是否启用通知
    enableXPNotifications: boolean; // 是否启用XP获得通知
    enableBadgeNotifications: boolean; // 是否启用徽章解锁通知
    enableDailyReminders: boolean; // 是否启用每日提醒

    // 显示设置
    showAnimations: boolean; // 是否显示动画
    compactMode: boolean; // 是否使用紧凑模式
    showProgressDetails: boolean; // 是否显示详细进度

    // 隐私设置
    shareAnalytics: boolean; // 是否共享分析数据
    autoSaveProgress: boolean; // 是否自动保存进度

    // 时间戳
    lastUpdated: string; // 最后更新时间
}

// ===============================
// 配置常量
// ===============================

/**
 * XP等级配置
 */
export const XP_LEVELS: XPLevel[] = [
    { level: 1, minXP: 0, maxXP: 99, title: "新手", color: "text-gray-500" },
    {
        level: 2,
        minXP: 100,
        maxXP: 249,
        title: "学徒",
        color: "text-green-500",
    },
    {
        level: 3,
        minXP: 250,
        maxXP: 499,
        title: "熟练者",
        color: "text-blue-500",
    },
    {
        level: 4,
        minXP: 500,
        maxXP: 999,
        title: "专家",
        color: "text-purple-500",
    },
    {
        level: 5,
        minXP: 1000,
        maxXP: 1999,
        title: "大师",
        color: "text-orange-500",
    },
    {
        level: 6,
        minXP: 2000,
        maxXP: 3999,
        title: "宗师",
        color: "text-red-500",
    },
    {
        level: 7,
        minXP: 4000,
        maxXP: 7999,
        title: "传奇",
        color: "text-pink-500",
    },
    {
        level: 8,
        minXP: 8000,
        maxXP: 15999,
        title: "神话",
        color: "text-indigo-500",
    },
    {
        level: 9,
        minXP: 16000,
        maxXP: 31999,
        title: "史诗",
        color: "text-yellow-500",
    },
    {
        level: 10,
        minXP: 32000,
        maxXP: Infinity,
        title: "至尊",
        color: "text-gradient",
    },
];

/**
 * XP奖励配置
 */
export const XP_REWARDS: Record<string, XPReward> = {
    // 基础答题奖励
    ANSWER_CORRECT: {
        action: "ANSWER_CORRECT",
        baseXP: 10,
        description: "正确回答问题",
    },
    ANSWER_PARTIAL: {
        action: "ANSWER_PARTIAL",
        baseXP: 5,
        description: "部分正确回答",
    },

    // 会话完成奖励
    COMPLETE_SESSION: {
        action: "COMPLETE_SESSION",
        baseXP: 50,
        description: "完成面试会话",
    },
    PERFECT_SESSION: {
        action: "PERFECT_SESSION",
        baseXP: 100,
        description: "完美完成会话（90%+分数）",
    },

    // 连续登录奖励
    DAILY_LOGIN: {
        action: "DAILY_LOGIN",
        baseXP: 5,
        multiplier: 1,
        description: "每日登录",
    },
    STREAK_BONUS: {
        action: "STREAK_BONUS",
        baseXP: 10,
        description: "连续登录奖励",
    },

    // 特殊成就奖励
    FIRST_SESSION: {
        action: "FIRST_SESSION",
        baseXP: 25,
        description: "第一次面试会话",
    },
    CATEGORY_MASTERY: {
        action: "CATEGORY_MASTERY",
        baseXP: 200,
        description: "掌握某个类别",
    },
};

/**
 * 徽章配置映射
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
    // XP徽章
    [BadgeType.FIRST_XP]: {
        name: "初出茅庐",
        description: "获得第一个经验值",
        icon: "⭐",
        requirement: 1,
        category: "xp",
    },
    [BadgeType.XP_100]: {
        name: "经验新手",
        description: "累计获得100经验值",
        icon: "🏆",
        requirement: 100,
        category: "xp",
    },
    [BadgeType.XP_500]: {
        name: "经验达人",
        description: "累计获得500经验值",
        icon: "🥇",
        requirement: 500,
        category: "xp",
    },
    [BadgeType.XP_1000]: {
        name: "经验大师",
        description: "累计获得1000经验值",
        icon: "👑",
        requirement: 1000,
        category: "xp",
    },

    // 答题徽章
    [BadgeType.FIRST_ANSWER]: {
        name: "破冰者",
        description: "回答第一个问题",
        icon: "🎯",
        requirement: 1,
        category: "answers",
    },
    [BadgeType.ANSWER_10]: {
        name: "答题新手",
        description: "回答10个问题",
        icon: "📝",
        requirement: 10,
        category: "answers",
    },
    [BadgeType.ANSWER_50]: {
        name: "答题达人",
        description: "回答50个问题",
        icon: "📚",
        requirement: 50,
        category: "answers",
    },
    [BadgeType.ANSWER_100]: {
        name: "答题专家",
        description: "回答100个问题",
        icon: "🎓",
        requirement: 100,
        category: "answers",
    },

    // 连续登录徽章
    [BadgeType.LOGIN_STREAK_3]: {
        name: "坚持者",
        description: "连续登录3天",
        icon: "🔥",
        requirement: 3,
        category: "login",
    },
    [BadgeType.LOGIN_STREAK_7]: {
        name: "持之以恒",
        description: "连续登录7天",
        icon: "⚡",
        requirement: 7,
        category: "login",
    },
    [BadgeType.LOGIN_STREAK_30]: {
        name: "不懈努力",
        description: "连续登录30天",
        icon: "💪",
        requirement: 30,
        category: "login",
    },

    // 类别大师徽章
    [BadgeType.BEHAVIORAL_MASTER]: {
        name: "行为面试大师",
        description: "在行为面试中表现优异",
        icon: "🎭",
        requirement: 80,
        category: "category",
    },
    [BadgeType.TECHNICAL_MASTER]: {
        name: "技术面试大师",
        description: "在技术面试中表现优异",
        icon: "💻",
        requirement: 80,
        category: "category",
    },
    [BadgeType.PSYCHOMETRIC_MASTER]: {
        name: "心理测评大师",
        description: "在心理测评中表现优异",
        icon: "🧠",
        requirement: 80,
        category: "category",
    },

    // 特殊成就徽章
    [BadgeType.PERFECTIONIST]: {
        name: "完美主义者",
        description: "连续5次获得满分",
        icon: "💎",
        requirement: 5,
        category: "special",
    },
    [BadgeType.IMPROVER]: {
        name: "进步之星",
        description: "分数持续提升",
        icon: "📈",
        requirement: 1,
        category: "special",
    },
    [BadgeType.DEDICATED]: {
        name: "专注达人",
        description: "坚持练习30天",
        icon: "🌟",
        requirement: 30,
        category: "special",
    },
};

/**
 * 类别阈值配置
 */
export const CATEGORY_THRESHOLDS = {
    WEAK_AREA_THRESHOLD: 60, // 弱项阈值（低于此分数视为弱项）
    MASTERY_THRESHOLD: 80, // 掌握阈值（高于此分数视为掌握）
    EXCELLENT_THRESHOLD: 90, // 优秀阈值（高于此分数视为优秀）
};

/**
 * 默认配置值
 */
export const DEFAULT_CONFIG = {
    MAX_SESSIONS_PER_DAY: 10, // 每日最大会话数
    DEFAULT_SESSION_DURATION: 30, // 默认会话时长（分钟）
    AUTOSAVE_INTERVAL: 30000, // 自动保存间隔（毫秒）
    NOTIFICATION_DURATION: 5000, // 通知显示时长（毫秒）
    CHART_MAX_POINTS: 50, // 图表最大数据点数
    DAILY_QUOTE_CACHE_DURATION: 86400000, // 每日语录缓存时长（毫秒）
};

/**
 * 每日励志语录
 */
export const DAILY_QUOTES = [
    "今天的努力是明天的实力！",
    "每一次练习都是向成功迈进的一步。",
    "坚持不懈，你一定能达到目标！",
    "相信自己，你比想象中更强大。",
    "成功属于那些永不放弃的人。",
    "今天的你比昨天更优秀！",
    "机会总是留给有准备的人。",
    "持续改进，追求卓越。",
    "每个专家都曾是初学者。",
    "进步不在于速度，而在于坚持。",
];
