"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { BadgeType, BADGE_CONFIGS, DAILY_QUOTES } from "@/types";

// 模拟用户徽章数据 - 后端会提供真实数据
const mockUserBadges = [
    { id: BadgeType.FIRST_XP, unlockedAt: new Date("2025-10-10") },
    { id: BadgeType.FIRST_ANSWER, unlockedAt: new Date("2025-10-12") },
    { id: BadgeType.LOGIN_STREAK_3, unlockedAt: new Date("2025-10-14") },
    { id: BadgeType.XP_100, unlockedAt: null }, // 未解锁
    { id: BadgeType.ANSWER_10, unlockedAt: null }, // 未解锁
    { id: BadgeType.LOGIN_STREAK_7, unlockedAt: null }, // 未解锁
];

export default function GamePage() {
    const [showDailyQuote, setShowDailyQuote] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

    // 获取今日金句
    const todayQuote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];

    // 处理每日签到
    const handleDailyCheckIn = () => {
        setShowDailyQuote(true);
        setHasCheckedInToday(true);
    };

    // 处理徽章点击
    const handleBadgeClick = (badgeType: BadgeType) => {
        setSelectedBadge(badgeType);
    };

    // 检查徽章是否已解锁
    const isBadgeUnlocked = (badgeType: BadgeType) => {
        return (
            mockUserBadges.find((b) => b.id === badgeType)?.unlockedAt !== null
        );
    };

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

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Object.entries(BADGE_CONFIGS).map(
                            ([badgeType, config]) => {
                                const isUnlocked = isBadgeUnlocked(
                                    badgeType as BadgeType
                                );

                                return (
                                    <button
                                        key={badgeType}
                                        onClick={() =>
                                            handleBadgeClick(
                                                badgeType as BadgeType
                                            )
                                        }
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
                                                {config.icon}
                                            </div>
                                            <h3
                                                className={`font-semibold text-sm mb-1 ${
                                                    isUnlocked
                                                        ? "text-gray-800"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {config.name}
                                            </h3>
                                            <p
                                                className={`text-xs ${
                                                    isUnlocked
                                                        ? "text-gray-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {config.description}
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
                            }
                        )}
                    </div>
                </div>
            </main>

            {/* Daily Quote Modal */}
            {showDailyQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
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
                                    onClick={() => setShowDailyQuote(false)}
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
