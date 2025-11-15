"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BadgeType, BADGE_CONFIGS, DAILY_QUOTES } from "@/types";
import { getGamePageData } from "@/services";

// ===== MOCK DATA - COMMENTED OUT FOR BACKEND TESTING =====
// Mock user badge data - backend will provide real data
/* const mockUserBadges = [
    { id: BadgeType.FIRST_XP, unlockedAt: new Date("2025-10-10") },
    { id: BadgeType.FIRST_ANSWER, unlockedAt: new Date("2025-10-12") },
    { id: BadgeType.LOGIN_STREAK_3, unlockedAt: new Date("2025-10-14") },
    { id: BadgeType.XP_100, unlockedAt: null }, // Locked
    { id: BadgeType.ANSWER_10, unlockedAt: null }, // Locked
    { id: BadgeType.LOGIN_STREAK_7, unlockedAt: null }, // Locked
]; */
// ===== END OF MOCK DATA =====

export default function GamePage() {
    const router = useRouter();
    const [showDailyQuote, setShowDailyQuote] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
    const [gameData, setGameData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get token from localStorage (set during login)
                const token = localStorage.getItem("auth_token");

                if (!token) {
                    setError("Please login first");
                    setLoading(false);
                    return;
                }
                const data = await getGamePageData(token);
                setGameData(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch game data:", err);
                setError(err.message || "Failed to load game data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get today's quote
    const todayQuote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];

    // Handle daily check-in
    const handleDailyCheckIn = () => {
        setShowDailyQuote(true);
        setHasCheckedInToday(true);
    };

    // Navigate to Home page
    const handleStartPractice = () => {
        router.push("/home");
    };

    // 处理徽章点击
    const handleBadgeClick = (badgeType: BadgeType) => {
        setSelectedBadge(badgeType);
    };

    // 检查徽章是否已解锁 - Use real data from backend
    const isBadgeUnlocked = (badgeType: BadgeType) => {
        if (!gameData?.badges) return false;
        return (
            gameData.badges.find((b: any) => b.badgeType === badgeType)
                ?.isUnlocked || false
        );
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 p-10 pt-24">
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">
                            Loading game data...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 p-10 pt-24">
                    <div className="text-center py-20">
                        <p className="text-xl text-red-600">{error}</p>
                        <p className="text-gray-600 mt-2">
                            Please try logging in again
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 p-10 pt-24">
                {/* Page Title and Daily Check-in Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Gamification System
                        </h1>
                        <p className="text-lg text-gray-600">
                            Improve your interview skills through gamification
                        </p>
                    </div>

                    {/* Daily Check-in Button */}
                    <button
                        onClick={handleDailyCheckIn}
                        disabled={hasCheckedInToday}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            hasCheckedInToday
                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                        }`}
                    >
                        {hasCheckedInToday ? "✓ Checked In" : "Daily Check-in"}
                    </button>
                </div>

                {/* Badge Display Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Achievement Badges
                    </h2>

                    {/* Badge Statistics Display */}
                    {gameData?.badges && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-blue-600">
                                    {
                                        gameData.badges.filter(
                                            (b: any) => b.isUnlocked
                                        ).length
                                    }
                                </span>
                                {" / "}
                                <span className="font-semibold">
                                    {gameData.badges.length}
                                </span>{" "}
                                badges unlocked
                            </p>
                        </div>
                    )}

                    {/* Use backend badge data */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {gameData?.badges?.map((badge: any) => {
                            const isUnlocked = badge.isUnlocked;

                            // Map badge names to icons (case-insensitive matching)
                            const badgeIconMap: { [key: string]: string } = {
                                // XP Progression (4)
                                "first steps": "⭐",
                                "xp novice": "🏆",
                                "xp expert": "🥇",
                                "xp master": "👑",

                                // Answering Progress (4)
                                "ice breaker": "❄️",
                                "answer rookie": "🌱",
                                "answer expert": "📚",
                                "answer master": "🎓",

                                // Login Streaks (3)
                                persistent: "🔥",
                                dedicated: "⚡",
                                relentless: "💪",

                                // Dimension Masters (5)
                                "clarity champion": "💎",
                                "relevance expert": "🎯",
                                "keyword wizard": "🔮",
                                "confidence king/queen": "👑",
                                "conciseness master": "✨",

                                // Special Achievements (2)
                                "first session": "🎉",
                                "night owl": "�",
                                "early bird": "🌅",
                            };

                            const badgeName = (badge.name || "")
                                .toLowerCase()
                                .trim();
                            const icon = badgeIconMap[badgeName] || "�";

                            return (
                                <button
                                    key={badge.badgeId}
                                    onClick={() => {
                                        // Show badge details
                                        const unlockDate = isUnlocked
                                            ? new Date(
                                                  badge.unlockedTimestamp * 1000
                                              ).toLocaleDateString("en-US")
                                            : "Locked";
                                        alert(
                                            `Badge: ${
                                                badge.name ||
                                                `Badge #${badge.badgeId}`
                                            }\n\n${
                                                badge.description ||
                                                "No description"
                                            }\n\n${
                                                isUnlocked
                                                    ? `✅ Unlocked on: ${unlockDate}`
                                                    : "🔒 Not yet unlocked"
                                            }`
                                        );
                                    }}
                                    className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                                        isUnlocked
                                            ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md hover:shadow-lg"
                                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-center">
                                        <div
                                            className={`text-4xl mb-3 ${
                                                isUnlocked
                                                    ? ""
                                                    : "grayscale opacity-50"
                                            }`}
                                        >
                                            {icon}
                                        </div>
                                        <h3
                                            className={`font-semibold text-sm mb-1 ${
                                                isUnlocked
                                                    ? "text-gray-800"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {badge.name ||
                                                `Badge #${badge.badgeId}`}
                                        </h3>
                                        <p
                                            className={`text-xs line-clamp-2 ${
                                                isUnlocked
                                                    ? "text-gray-600"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {badge.description ||
                                                "No description"}
                                        </p>
                                        {isUnlocked && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                                    ✓ Unlocked
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* If no badge data */}
                    {!gameData?.badges ||
                        (gameData.badges.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    No badge data available
                                </p>
                            </div>
                        ))}
                </div>
            </main>

            {/* Daily Quote Modal */}
            {showDailyQuote && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border-4 border-blue-200">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Daily Quote
                            </h3>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                "{todayQuote}"
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleStartPractice}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Start Today's Practice
                                </button>
                                <button
                                    onClick={() => setShowDailyQuote(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Badge Details Modal */}
            {selectedBadge && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">
                                {BADGE_CONFIGS[selectedBadge].icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {BADGE_CONFIGS[selectedBadge].name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {BADGE_CONFIGS[selectedBadge].description}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        Unlock Requirement:{" "}
                                    </span>
                                    {BADGE_CONFIGS[selectedBadge]
                                        .requirement === 1
                                        ? `Complete ${BADGE_CONFIGS[selectedBadge].description}`
                                        : `Reach ${
                                              BADGE_CONFIGS[selectedBadge]
                                                  .requirement
                                          } ${
                                              BADGE_CONFIGS[selectedBadge]
                                                  .category === "xp"
                                                  ? "XP"
                                                  : BADGE_CONFIGS[selectedBadge]
                                                        .category === "answers"
                                                  ? "answers"
                                                  : BADGE_CONFIGS[selectedBadge]
                                                        .category === "login"
                                                  ? "days streak"
                                                  : BADGE_CONFIGS[selectedBadge]
                                                        .category === "category"
                                                  ? "category score"
                                                  : "times"
                                          }`}
                                </p>
                            </div>

                            <div className="mb-6">
                                {isBadgeUnlocked(selectedBadge) ? (
                                    <div className="flex items-center justify-center space-x-2 text-green-600">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            Badge Unlocked
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            Not Unlocked
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
