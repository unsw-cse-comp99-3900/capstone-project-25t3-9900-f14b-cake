/**
 * Daily Quotes System
 * Complete implementation version
 *
 * Features:
 * - 265+ curated quotes, cycling throughout the year
 * - Automatic cycling based on date
 * - Automatic intelligent categorization
 * - Includes author information
 * - Covers famous quotes and classic anime lines
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
 * Intelligently assign category based on quote content
 * @param quote - Quote text
 * @returns Category label
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
 * Import and process all quotes from JSON file
 * Automatically add ID and intelligent categorization
 */
export const DAILY_QUOTES: DailyQuote[] = quotesData.map((item, index) => ({
    id: index + 1,
    text: item.quote,
    author: item.author,
    category: categorizeQuote(item.quote),
}));

/**
 * Get today's quote
 * Cyclically select from quote library based on current date
 *
 * @returns Today's quote object
 */
export function getTodayQuote(): DailyQuote {
    const now = new Date();
    // Calculate which day of the year it is (1-365/366)
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use modulo operation to cyclically select quote
    const quoteIndex = dayOfYear % DAILY_QUOTES.length;

    return DAILY_QUOTES[quoteIndex];
}

/**
 * Get quote for a specific date
 *
 * @param date - The specified date
 * @returns The quote for that date
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
 * Get all quotes for the week
 *
 * @returns Array of quotes for the 7 days of the week
 */
export function getWeekQuotes(): DailyQuote[] {
    const quotes: DailyQuote[] = [];
    const today = new Date();

    // Get the 7 days of the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        quotes.push(getQuoteForDate(date));
    }

    return quotes;
}

/**
 * Get quotes by category
 *
 * @param category - Quote category
 * @returns All quotes in that category
 */
export function getQuotesByCategory(
    category: DailyQuote["category"]
): DailyQuote[] {
    return DAILY_QUOTES.filter((quote) => quote.category === category);
}

/**
 * Get a random quote
 *
 * @returns A randomly selected quote
 */
export function getRandomQuote(): DailyQuote {
    const randomIndex = Math.floor(Math.random() * DAILY_QUOTES.length);
    return DAILY_QUOTES[randomIndex];
}

/**
 * Get quote statistics
 *
 * @returns Statistics on the number of quotes by category
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
