/**
 * Daily Quotes System
 * 每日金句系统 - 完整实现版本
 *
 * 特性:
 * - 265+条精选金句,全年循环使用
 * - 根据日期自动循环
 * - 自动智能分类
 * - 包含作者信息
 * - 涵盖名人名言和动漫经典语录
 */

import quotesData from "./quotes.json";

export interface DailyQuote {
    id: number;
    text: string;
    author?: string;
    category:
        | "motivation"
        | "success"
        | "learning"
        | "perseverance"
        | "confidence";
}

/**
 * 根据金句内容智能分配类别
 * @param quote - 金句文本
 * @returns 分类标签
 */
function categorizeQuote(quote: string): DailyQuote["category"] {
    const lowerQuote = quote.toLowerCase();

    // Success keywords
    if (
        lowerQuote.match(
            /\b(success|achieve|accomplish|win|victory|triumph|goal)\b/
        )
    ) {
        return "success";
    }

    // Learning keywords
    if (
        lowerQuote.match(
            /\b(learn|knowledge|education|wisdom|teach|study|understand)\b/
        )
    ) {
        return "learning";
    }

    // Perseverance keywords
    if (
        lowerQuote.match(
            /\b(persever|persist|endure|struggle|overcome|fight|fail|try|never give up|keep going)\b/
        )
    ) {
        return "perseverance";
    }

    // Confidence keywords
    if (
        lowerQuote.match(
            /\b(confiden|believe|faith|trust|courage|brave|fear|doubt)\b/
        )
    ) {
        return "confidence";
    }

    // Default to motivation
    return "motivation";
}

/**
 * 从 JSON 文件导入并处理所有金句
 * 自动添加 ID 和智能分类
 */
export const DAILY_QUOTES: DailyQuote[] = quotesData.map((item, index) => ({
    id: index + 1,
    text: item.quote,
    author: item.author,
    category: categorizeQuote(item.quote),
}));

/**
 * 获取今日金句
 * 根据当前日期从金句库中循环选择
 *
 * @returns 当天的金句对象
 */
export function getTodayQuote(): DailyQuote {
    const now = new Date();
    // 计算今天是一年中的第几天 (1-365/366)
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // 使用模运算循环选择金句
    const quoteIndex = dayOfYear % DAILY_QUOTES.length;

    return DAILY_QUOTES[quoteIndex];
}

/**
 * 获取指定日期的金句
 *
 * @param date - 指定的日期
 * @returns 该日期对应的金句
 */
export function getQuoteForDate(date: Date): DailyQuote {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const quoteIndex = dayOfYear % DAILY_QUOTES.length;

    return DAILY_QUOTES[quoteIndex];
}

/**
 * 获取本周的所有金句
 *
 * @returns 本周7天的金句数组
 */
export function getWeekQuotes(): DailyQuote[] {
    const quotes: DailyQuote[] = [];
    const today = new Date();

    // 获取本周的7天
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        quotes.push(getQuoteForDate(date));
    }

    return quotes;
}

/**
 * 按类别获取金句
 *
 * @param category - 金句类别
 * @returns 该类别的所有金句
 */
export function getQuotesByCategory(
    category: DailyQuote["category"]
): DailyQuote[] {
    return DAILY_QUOTES.filter((quote) => quote.category === category);
}

/**
 * 获取随机金句
 *
 * @returns 随机选择的一条金句
 */
export function getRandomQuote(): DailyQuote {
    const randomIndex = Math.floor(Math.random() * DAILY_QUOTES.length);
    return DAILY_QUOTES[randomIndex];
}

/**
 * 获取金句统计信息
 *
 * @returns 各类别的金句数量统计
 */
export function getQuoteStats() {
    const stats = {
        total: DAILY_QUOTES.length,
        byCategory: {
            motivation: 0,
            success: 0,
            learning: 0,
            perseverance: 0,
            confidence: 0,
        },
    };

    DAILY_QUOTES.forEach((quote) => {
        stats.byCategory[quote.category]++;
    });

    return stats;
}
