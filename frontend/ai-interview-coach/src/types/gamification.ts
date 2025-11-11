/**
 * 游戏化系统数据类型定义
 * 包含XP、徽章、连续登录等功能的TypeScript接口
 */

// ===============================
// 基础数据类型
// ===============================

/**
 * 徽章类型枚举
 */
export enum BadgeType {
    // XP相关徽章
    FIRST_XP = "FIRST_XP", // 获得第一个XP
    XP_100 = "XP_100", // 累计100 XP
    XP_500 = "XP_500", // 累计500 XP
    XP_1000 = "XP_1000", // 累计1000 XP

    // 答题相关徽章
    FIRST_ANSWER = "FIRST_ANSWER", // 第一次答题
    ANSWER_10 = "ANSWER_10", // 答题10次
    ANSWER_50 = "ANSWER_50", // 答题50次
    ANSWER_100 = "ANSWER_100", // 答题100次

    // 连续登录徽章
    LOGIN_STREAK_3 = "LOGIN_STREAK_3", // 连续登录3天
    LOGIN_STREAK_7 = "LOGIN_STREAK_7", // 连续登录7天
    LOGIN_STREAK_30 = "LOGIN_STREAK_30", // 连续登录30天

    // 类别表现徽章 (使用英式拼写与队友保持一致)
    BEHAVIOURAL_MASTER = "BEHAVIOURAL_MASTER", // 行为类别大师
    TECHNICAL_MASTER = "TECHNICAL_MASTER", // 技术类别大师
    PSYCHOMETRIC_MASTER = "PSYCHOMETRIC_MASTER", // 心理测评大师

    // 特殊成就徽章
    PERFECTIONIST = "PERFECTIONIST", // 完美主义者（连续满分）
    IMPROVER = "IMPROVER", // 进步者（分数持续提升）
    DEDICATED = "DEDICATED", // 专注者（长期坚持练习）
}

/**
 * 徽章接口
 */
export interface Badge {
    id: BadgeType;
    name: string; // 徽章名称
    description: string; // 徽章描述
    icon: string; // 徽章图标（Heroicon名称或emoji）
    unlockedAt: Date | null; // 解锁时间，null表示未解锁
    progress?: number; // 解锁进度 (0-100)，可选
    requirement: number; // 解锁要求的数值
}

/**
 * XP等级配置
 */
export interface XPLevel {
    level: number; // 等级
    minXP: number; // 该等级所需最低XP
    maxXP: number; // 该等级最高XP
    title: string; // 等级称号
    color: string; // 等级颜色（Tailwind CSS类名）
}

/**
 * XP奖励配置
 */
export interface XPReward {
    action: string; // 动作类型
    baseXP: number; // 基础XP奖励
    multiplier?: number; // 倍数（可选）
    description: string; // 奖励描述
}

// ===============================
// 游戏化状态接口
// ===============================

/**
 * 用户游戏化状态接口
 */
export interface UserGamification {
    // 基础信息
    userId: string; // 用户ID（用户名）

    // XP系统
    totalXP: number; // 总XP
    currentLevel: number; // 当前等级
    levelProgress: number; // 当前等级进度百分比 (0-100)

    // 徽章系统
    badges: Badge[]; // 所有徽章（包含已解锁和未解锁）
    unlockedBadges: BadgeType[]; // 已解锁的徽章ID列表

    // 连续登录系统
    loginStreak: number; // 当前连续登录天数
    maxLoginStreak: number; // 历史最高连续登录天数
    lastLoginDate: string | null; // 最后登录日期 (YYYY-MM-DD)
    totalLoginDays: number; // 总登录天数

    // 答题统计
    totalAnswers: number; // 总答题数
    correctAnswers: number; // 正确答题数
    accuracyRate: number; // 准确率 (0-100)

    // 会话统计
    totalSessions: number; // 总会话数
    completedSessions: number; // 完成的会话数

    // 时间戳
    createdAt: string; // 创建时间
    updatedAt: string; // 最后更新时间
}

/**
 * 游戏化操作结果
 */
export interface GamificationResult {
    success: boolean; // 操作是否成功
    xpGained?: number; // 获得的XP
    levelUp?: boolean; // 是否升级
    newLevel?: number; // 新等级
    badgesUnlocked?: BadgeType[]; // 新解锁的徽章
    message?: string; // 提示信息
}

/**
 * 每日登录奖励
 */
export interface DailyLoginReward {
    day: number; // 连续登录第几天
    xpReward: number; // XP奖励
    quote: string; // 每日励志语录
    bonusMessage: string; // 奖励提示消息
}
