/**
 * Type declaration for quotes.json
 */

interface QuoteItem {
    quote: string;
    author: string;
}

declare module "./quotes.json" {
    const quotes: QuoteItem[];
    export default quotes;
}
