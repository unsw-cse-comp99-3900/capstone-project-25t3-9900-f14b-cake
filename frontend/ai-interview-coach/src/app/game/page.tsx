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
    const [selectedBadge, setSelectedBadge] = useState<{
        badge: any;
        iconPath: string;
    } | null>(null);
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

                            // Map badge names to SVG icons (case-insensitive matching)
                            const badgeIconMap: { [key: string]: string } = {
                                // XP Progression (4)
                                "first steps": "/icons/badge/star.svg",
                                "xp novice": "/icons/badge/trophy.svg",
                                "xp expert":
                                    "/icons/badge/workspace_premium.svg",
                                "xp master": "/icons/badge/diamond.svg",

                                // Answering Progress (4)
                                "ice breaker": "/icons/badge/ac_unit.svg",
                                "answer rookie": "/icons/badge/spa.svg",
                                "answer expert": "/icons/badge/menu_book.svg",
                                "answer master": "/icons/badge/school.svg",

                                // Login Streaks (3)
                                persistent:
                                    "/icons/badge/local_fire_department.svg",
                                dedicated: "/icons/badge/bolt.svg",
                                relentless: "/icons/badge/fitness_center.svg",

                                // Dimension Masters (5)
                                "clarity champion": "/icons/badge/diamond.svg",
                                "relevance expert":
                                    "/icons/badge/my_location.svg",
                                "keyword wizard": "/icons/badge/science.svg",
                                "confidence king/queen":
                                    "/icons/badge/workspace_premium.svg",
                                "conciseness master":
                                    "/icons/badge/star_rate.svg",

                                // Special Achievements (3)
                                "first session": "/icons/badge/celebration.svg",
                                "night owl": "/icons/badge/nightlight.svg",
                                "early bird": "/icons/badge/wb_sunny.svg",
                            };

                            const badgeName = (badge.name || "")
                                .toLowerCase()
                                .trim();
                            const iconPath =
                                badgeIconMap[badgeName] ||
                                "/icons/badge/star.svg";

                            return (
                                <button
                                    key={badge.badgeId}
                                    onClick={() => {
                                        // Show badge details in modal
                                        setSelectedBadge({ badge, iconPath });
                                    }}
                                    className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                                        isUnlocked
                                            ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md hover:shadow-lg"
                                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-center">
                                        <div
                                            className={`mb-3 flex justify-center ${
                                                isUnlocked
                                                    ? ""
                                                    : "grayscale opacity-50"
                                            }`}
                                        >
                                            <img
                                                src={iconPath}
                                                alt={badge.name}
                                                className="w-12 h-12"
                                                style={{
                                                    filter: isUnlocked
                                                        ? "invert(50%) sepia(100%) saturate(1000%) hue-rotate(30deg) brightness(1.1)"
                                                        : "",
                                                }}
                                            />
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
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={selectedBadge.iconPath}
                                    alt={selectedBadge.badge.name}
                                    className="w-20 h-20"
                                    style={{
                                        filter: selectedBadge.badge.isUnlocked
                                            ? "invert(50%) sepia(100%) saturate(1000%) hue-rotate(30deg) brightness(1.1)"
                                            : "grayscale(100%) opacity(0.5)",
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedBadge.badge.name ||
                                    `Badge #${selectedBadge.badge.badgeId}`}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {selectedBadge.badge.description}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        Status:{" "}
                                    </span>
                                    {selectedBadge.badge.isUnlocked ? (
                                        <span className="text-green-600 font-semibold">
                                            ✓ Unlocked on{" "}
                                            {new Date(
                                                selectedBadge.badge
                                                    .unlockedTimestamp * 1000
                                            ).toLocaleDateString("en-US")}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 font-semibold">
                                            🔒 Locked
                                        </span>
                                    )}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
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
