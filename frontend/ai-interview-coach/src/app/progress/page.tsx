"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ScoreDimension, TimeRange } from "@/types";
import { SCORE_DIMENSION_CONFIGS } from "@/types/common";

// Mock data for development - backend will provide real data
const mockReadinessData = [
    { date: "2025-10-01", score: 65 },
    { date: "2025-10-03", score: 68 },
    { date: "2025-10-05", score: 72 },
    { date: "2025-10-07", score: 75 },
    { date: "2025-10-09", score: 78 },
    { date: "2025-10-11", score: 82 },
    { date: "2025-10-13", score: 85 },
    { date: "2025-10-15", score: 88 },
];

const mockLoginData = [
    { date: "2025-10-01", hasLogin: true },
    { date: "2025-10-02", hasLogin: true },
    { date: "2025-10-03", hasLogin: true },
    { date: "2025-10-04", hasLogin: false },
    { date: "2025-10-05", hasLogin: true },
    { date: "2025-10-06", hasLogin: true },
    { date: "2025-10-07", hasLogin: true },
    { date: "2025-10-08", hasLogin: true },
    { date: "2025-10-09", hasLogin: true },
    { date: "2025-10-10", hasLogin: false },
    { date: "2025-10-11", hasLogin: true },
    { date: "2025-10-12", hasLogin: true },
    { date: "2025-10-13", hasLogin: true },
    { date: "2025-10-14", hasLogin: true },
    { date: "2025-10-15", hasLogin: true },
];

const mockCategoryPerformance = [
    {
        dimension: ScoreDimension.CLARITY_STRUCTURE,
        dimension_name: "Clarity & Structure",
        average_score: 4.2,
        percentage: 84,
        is_strength: true,
    },
    {
        dimension: ScoreDimension.RELEVANCE,
        dimension_name: "Relevance to Question/Job",
        average_score: 3.8,
        percentage: 76,
        is_strength: true,
    },
    {
        dimension: ScoreDimension.KEYWORD_ALIGNMENT,
        dimension_name: "Keyword & Skill Alignment",
        average_score: 3.1,
        percentage: 62,
        is_strength: false,
    },
    {
        dimension: ScoreDimension.CONFIDENCE_DELIVERY,
        dimension_name: "Confidence & Delivery",
        average_score: 3.5,
        percentage: 70,
        is_strength: false,
    },
    {
        dimension: ScoreDimension.CONCISENESS_FOCUS,
        dimension_name: "Conciseness & Focus",
        average_score: 4.0,
        percentage: 80,
        is_strength: true,
    },
];

export default function ProgressPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.WEEKLY);
    const [showReadinessDetails, setShowReadinessDetails] = useState(false);
    const [showLoginDetails, setShowLoginDetails] = useState(false);
    const [showCategoryDetails, setShowCategoryDetails] = useState(false);

    // Calculate max score for chart scaling
    const maxScore = Math.max(...mockReadinessData.map((d) => d.score));
    const minScore = Math.min(...mockReadinessData.map((d) => d.score));

    // Calculate login streak
    const currentStreak = mockLoginData
        .reverse()
        .findIndex((day) => !day.hasLogin);
    const loginStreakDays =
        currentStreak === -1 ? mockLoginData.length : currentStreak;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 p-10 pt-24">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Progress Tracking System
                    </h1>
                    <p className="text-lg text-gray-600">
                        View your learning statistics and progress
                    </p>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Left Side - Readiness Scores Over Time */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Readiness Scores Over Time
                            </h2>
                            <button
                                onClick={() => setShowReadinessDetails(true)}
                                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Detailed Information
                            </button>
                        </div>

                        {/* Time Range Selector */}
                        <div className="flex space-x-2 mb-6">
                            {[TimeRange.WEEKLY, TimeRange.MONTHLY].map(
                                (range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            timeRange === range
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {range === TimeRange.WEEKLY
                                            ? "Weekly"
                                            : "Monthly"}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Chart Area */}
                        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 400 200"
                            >
                                {/* Grid lines */}
                                {[0, 25, 50, 75, 100].map((value, index) => (
                                    <g key={value}>
                                        <line
                                            x1="40"
                                            y1={180 - value * 1.4}
                                            x2="380"
                                            y2={180 - value * 1.4}
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x="35"
                                            y={185 - value * 1.4}
                                            fontSize="10"
                                            fill="#6b7280"
                                            textAnchor="end"
                                        >
                                            {value}
                                        </text>
                                    </g>
                                ))}

                                {/* Chart line */}
                                <polyline
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    points={mockReadinessData
                                        .map((point, index) => {
                                            const x =
                                                40 +
                                                index *
                                                    (340 /
                                                        (mockReadinessData.length -
                                                            1));
                                            const y =
                                                180 - (point.score - 50) * 2.6;
                                            return `${x},${y}`;
                                        })
                                        .join(" ")}
                                />

                                {/* Data points */}
                                {mockReadinessData.map((point, index) => {
                                    const x =
                                        40 +
                                        index *
                                            (340 /
                                                (mockReadinessData.length - 1));
                                    const y = 180 - (point.score - 50) * 2.6;
                                    return (
                                        <circle
                                            key={index}
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="#3b82f6"
                                            className="hover:fill-blue-700 cursor-pointer"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Current Score Display */}
                            <div className="absolute top-4 right-4 bg-white rounded-lg shadow px-3 py-2">
                                <div className="text-sm text-gray-600">
                                    Current Score
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {
                                        mockReadinessData[
                                            mockReadinessData.length - 1
                                        ].score
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        {/* Consecutive Login Records */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Consecutive Login Records
                                </h3>
                                <button
                                    onClick={() => setShowLoginDetails(true)}
                                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    Detailed Information
                                </button>
                            </div>

                            {/* Current Streak Display */}
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-green-600">
                                    {loginStreakDays}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Days Streak
                                </div>
                            </div>

                            {/* Calendar Thumbnails */}
                            <div className="grid grid-cols-7 gap-1">
                                {mockLoginData.slice(-14).map((day, index) => {
                                    const dayNum = new Date(day.date).getDate();
                                    return (
                                        <div
                                            key={index}
                                            className={`aspect-square rounded text-xs flex items-center justify-center font-medium ${
                                                day.hasLogin
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                        >
                                            {dayNum}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Performance Dimensions Analysis */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Performance Dimensions Analysis
                                </h3>
                                <button
                                    onClick={() => setShowCategoryDetails(true)}
                                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                >
                                    Detailed Information
                                </button>
                            </div>

                            <div className="space-y-4">
                                {mockCategoryPerformance.map((dim) => (
                                    <div
                                        key={dim.dimension}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {
                                                        SCORE_DIMENSION_CONFIGS[
                                                            dim.dimension
                                                        ].icon
                                                    }
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {dim.dimension_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-600">
                                                    {dim.average_score}/5
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {dim.percentage}%
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        dim.is_strength
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {dim.is_strength
                                                        ? "Strength"
                                                        : "Needs Work"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    dim.is_strength
                                                        ? "bg-green-500"
                                                        : "bg-orange-500"
                                                }`}
                                                style={{
                                                    width: `${dim.percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {
                                                SCORE_DIMENSION_CONFIGS[
                                                    dim.dimension
                                                ].description
                                            }
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal placeholders - will show detailed information */}
            {showReadinessDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Readiness Score Details
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your readiness score has improved from {minScore} to{" "}
                            {maxScore} over the selected period. This represents
                            a{" "}
                            {(((maxScore - minScore) / minScore) * 100).toFixed(
                                1
                            )}
                            % improvement.
                        </p>
                        <button
                            onClick={() => setShowReadinessDetails(false)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showLoginDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Login Streak Details
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You have maintained a {loginStreakDays}-day login
                            streak. Consistent practice is key to interview
                            success!
                        </p>
                        <button
                            onClick={() => setShowLoginDetails(false)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showCategoryDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Performance Dimension Details
                        </h3>
                        <div className="space-y-4 mb-6">
                            {mockCategoryPerformance.map((dim) => (
                                <div
                                    key={dim.dimension}
                                    className="bg-gray-50 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">
                                            {
                                                SCORE_DIMENSION_CONFIGS[
                                                    dim.dimension
                                                ].icon
                                            }
                                        </span>
                                        <h4 className="font-semibold text-gray-800">
                                            {dim.dimension_name}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {
                                            SCORE_DIMENSION_CONFIGS[
                                                dim.dimension
                                            ].description
                                        }
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">
                                            Average Score: {dim.average_score}/5
                                            ({dim.percentage}%)
                                        </span>
                                        <span
                                            className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                dim.is_strength
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}
                                        >
                                            {dim.is_strength
                                                ? "Strength - Keep it up!"
                                                : "Needs Work - Practice more"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowCategoryDetails(false)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
