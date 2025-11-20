"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ScoreDimension } from "@/types";
import { SCORE_DIMENSION_CONFIGS } from "@/types/common";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { getProgressPageData } from "@/services";

// Time range options for filtering interview sessions
enum TimeRange {
    RECENT_7 = "RECENT_7", // Last 7 sessions
    RECENT_15 = "RECENT_15", // Last 15 sessions
}

// ===== MOCK DATA - COMMENTED OUT FOR BACKEND TESTING =====
// Mock data for development - backend will provide real data
// Changed from date-based to interview session-based
/* const mockReadinessDataAll = [
    { session: 1, score: 65 },
    { session: 2, score: 68 },
    { session: 3, score: 72 },
    { session: 4, score: 75 },
    { session: 5, score: 78 },
    { session: 6, score: 82 },
    { session: 7, score: 85 },
    { session: 8, score: 88 },
    { session: 9, score: 90 },
    { session: 10, score: 87 },
    { session: 11, score: 91 },
    { session: 12, score: 93 },
    { session: 13, score: 89 },
    { session: 14, score: 92 },
    { session: 15, score: 94 },
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

// Prepare radar chart data with dual layers (current vs target)
const radarChartData = mockCategoryPerformance.map((dim) => ({
    subject: dim.dimension_name.split(" ")[0], // Shortened names for radar chart
    current: dim.percentage, // Current performance
    target: 85, // Target/benchmark score
    fullMark: 100,
})); */
// ===== END OF MOCK DATA =====

export default function ProgressPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.RECENT_7);
    const [progressData, setProgressData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [targetScore, setTargetScore] = useState<number>(4.25); // Default target: 4.25 (85% of 5)
    const [showTargetInput, setShowTargetInput] = useState(false);

    // Load saved target score from localStorage on mount
    useEffect(() => {
        const savedTarget = localStorage.getItem("progress_target_score");
        if (savedTarget) {
            const parsedTarget = parseFloat(savedTarget);
            if (
                !isNaN(parsedTarget) &&
                parsedTarget >= 0 &&
                parsedTarget <= 5
            ) {
                setTargetScore(parsedTarget);
            }
        }
    }, []);

    // Save target score to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("progress_target_score", targetScore.toString());
    }, [targetScore]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get token from localStorage (set during login)
                const token = localStorage.getItem("auth_token"); // 注意:登录页面使用的是 'auth_token'

                if (!token) {
                    setError("Please login first");
                    setLoading(false);
                    return;
                }
                const data = await getProgressPageData(token);

                // 🔍 DEBUG: Log login/check-in data for verification
                console.log("=== Login Activity Debug Info ===");
                console.log("Current Streak:", data.loginStreakDays);
                console.log("Max Streak:", data.maxLoginStreak);
                console.log("Total Days:", data.totalLoginDays);
                console.log("Login Calendar Data (ALL 30 days):");
                data.loginData.forEach((day: any) => {
                    if (day.hasLogin) {
                        console.log(`  ✓ ${day.date} - HAS INTERVIEW`);
                    }
                });
                console.log(
                    "Today's date:",
                    new Date().toISOString().split("T")[0]
                );
                console.log("=================================");

                setProgressData(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch progress data:", err);
                setError(err.message || "Failed to load progress data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">
                            Loading progress data...
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
                <main className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
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

    // Use real data from backend
    const mockReadinessDataAll = progressData?.readinessScores || [];
    const mockLoginData = progressData?.loginData || [];
    const mockCategoryPerformance = progressData?.dimensionPerformance || [];
    const latestInterviewQuestions =
        progressData?.latestInterviewQuestions || [];

    // Prepare radar chart data with dual layers (current vs target)
    // Using 5-point scale (1-5) instead of percentage
    const radarChartData = mockCategoryPerformance.map((dim: any) => ({
        subject: dim.dimension_name.split(" ")[0], // Shortened names for radar chart
        current: Number(dim.average_score.toFixed(2)), // Current performance (1-5 scale)
        target: targetScore, // User-customizable target score
        fullMark: 5,
    }));

    // Filter data based on selected time range
    const mockReadinessData =
        timeRange === TimeRange.RECENT_7
            ? mockReadinessDataAll.slice(-7) // Last 7 sessions
            : mockReadinessDataAll.slice(-15); // Last 15 sessions

    // Calculate statistics
    const maxScore = Math.max(...mockReadinessData.map((d: any) => d.score));
    const minScore = Math.min(...mockReadinessData.map((d: any) => d.score));
    const averageScore =
        mockReadinessData.reduce((sum: number, d: any) => sum + d.score, 0) /
        mockReadinessData.length;
    const lastScore =
        mockReadinessData[mockReadinessData.length - 1]?.score || 0;

    // Get login/check-in statistics from backend data
    // These are calculated based on interview timestamps
    const loginStreakDays = progressData?.loginStreakDays || 0;
    const totalLoginDays = progressData?.totalLoginDays || 0;
    const maxLoginStreak = progressData?.maxLoginStreak || 0;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Progress Tracking System
                    </h1>
                    <p className="text-lg text-gray-600">
                        Detailed analysis of your interview performance and
                        progress
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Readiness Scores Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Interview Performance Progression
                            </h2>
                            <p className="text-sm text-gray-600">
                                Track your readiness score improvement across
                                interview sessions
                            </p>
                        </div>

                        {/* Time Range Selector */}
                        <div className="flex space-x-2 mb-6">
                            {[TimeRange.RECENT_7, TimeRange.RECENT_15].map(
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
                                        {range === TimeRange.RECENT_7
                                            ? "Last 7 Sessions"
                                            : "Last 15 Sessions"}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Chart with X-axis as Interview Sessions */}
                        <div
                            className="relative bg-gray-50 rounded-lg p-6 mb-6"
                            style={{ height: "320px" }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={mockReadinessData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="lineGradient"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#2563eb"
                                                stopOpacity={1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                        vertical={false}
                                        opacity={0.5}
                                    />
                                    <XAxis
                                        dataKey="session"
                                        stroke="#6b7280"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 500,
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                        label={{
                                            value: "Interview Sessions",
                                            position: "insideBottom",
                                            offset: -10,
                                            style: {
                                                fontSize: "13px",
                                                fill: "#374151",
                                                fontWeight: 600,
                                            },
                                        }}
                                        tickFormatter={(value) =>
                                            `Session ${value}`
                                        }
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        stroke="#6b7280"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 500,
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                        label={{
                                            value: "Readiness Score",
                                            angle: -90,
                                            position: "center",
                                            offset: 15,
                                            style: {
                                                fontSize: "14px",
                                                fill: "#374151",
                                                fontWeight: 600,
                                                textAnchor: "middle",
                                            },
                                        }}
                                        ticks={[0, 1, 2, 3, 4, 5]}
                                        width={85}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            boxShadow:
                                                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            padding: "8px 12px",
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            color: "#374151",
                                            marginBottom: "4px",
                                        }}
                                        formatter={(value: number) => [
                                            `${value}`,
                                            "Readiness Score",
                                        ]}
                                        labelFormatter={(label) =>
                                            `Session #${label}`
                                        }
                                        separator=": "
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#3b82f6",
                                            r: 5,
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
                                        activeDot={{
                                            r: 7,
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                            fill: "#2563eb",
                                        }}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm text-blue-600 font-medium mb-1 flex items-center gap-1.5">
                                    <img
                                        src="/icons/star.svg"
                                        alt="Current Score"
                                        className="w-4 h-4"
                                        style={{
                                            filter: "invert(40%) sepia(100%) saturate(1500%) hue-rotate(200deg) brightness(0.9)",
                                        }}
                                    />
                                    Current Score
                                </div>
                                <div className="text-3xl font-bold text-blue-700">
                                    {
                                        mockReadinessData[
                                            mockReadinessData.length - 1
                                        ].score
                                    }
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm text-green-600 font-medium mb-1 flex items-center gap-1.5">
                                    <img
                                        src="/icons/show_chart.svg"
                                        alt="Average Score"
                                        className="w-4 h-4"
                                        style={{
                                            filter: "invert(50%) sepia(100%) saturate(1000%) hue-rotate(80deg) brightness(0.8)",
                                        }}
                                    />
                                    Average Score
                                </div>
                                <div className="text-3xl font-bold text-green-700">
                                    {averageScore.toFixed(1)}
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-sm text-purple-600 font-medium mb-1 flex items-center gap-1.5">
                                    <img
                                        src="/icons/military_tech.svg"
                                        alt="Best Score"
                                        className="w-4 h-4"
                                        style={{
                                            filter: "invert(40%) sepia(100%) saturate(1500%) hue-rotate(260deg) brightness(0.9)",
                                        }}
                                    />
                                    Best Score
                                </div>
                                <div className="text-3xl font-bold text-purple-700">
                                    {maxScore}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <img
                                    src="/icons/assessment.svg"
                                    alt="Analysis"
                                    className="w-5 h-5"
                                    style={{
                                        filter: "invert(20%) sepia(100%) saturate(3000%) hue-rotate(200deg)",
                                    }}
                                />
                                Performance Analysis
                            </h4>
                            <p className="text-sm text-blue-800">
                                Over the selected {mockReadinessData.length}{" "}
                                interview sessions, your average readiness score
                                is <strong>{averageScore.toFixed(2)}</strong>,
                                with a best score of{" "}
                                <strong>{maxScore.toFixed(2)}</strong>. Your
                                current score is{" "}
                                <strong>{lastScore.toFixed(2)}</strong>, showing
                                consistent progress in your interview skills.
                                Keep up the great work!
                            </p>
                        </div>
                    </div>

                    {/* Bottom Grid: Login History + Dimension Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Login History - Left Side */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Login Activity
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your practice consistency record
                                </p>
                            </div>

                            {/* Calendar */}
                            <div className="mb-6">
                                <style jsx global>{`
                                    .react-calendar {
                                        width: 100%;
                                        border: none;
                                        font-family: inherit;
                                        background: transparent;
                                    }
                                    .react-calendar__navigation {
                                        margin-bottom: 1rem;
                                    }
                                    .react-calendar__navigation button {
                                        color: #374151;
                                        font-size: 1rem;
                                        font-weight: 600;
                                        padding: 0.5rem;
                                    }
                                    .react-calendar__navigation
                                        button:enabled:hover,
                                    .react-calendar__navigation
                                        button:enabled:focus {
                                        background-color: #f3f4f6;
                                        border-radius: 0.5rem;
                                    }
                                    .react-calendar__month-view__weekdays {
                                        text-align: center;
                                        font-size: 0.75rem;
                                        font-weight: 600;
                                        color: #6b7280;
                                        margin-bottom: 0.5rem;
                                    }
                                    .react-calendar__month-view__weekdays__weekday {
                                        padding: 0.5rem;
                                    }
                                    .react-calendar__tile {
                                        padding: 0.75rem 0.5rem;
                                        font-size: 0.875rem;
                                        border-radius: 0.5rem;
                                        transition: all 0.2s;
                                        background: transparent;
                                    }
                                    .react-calendar__tile:enabled:hover,
                                    .react-calendar__tile:enabled:focus {
                                        background-color: #f3f4f6;
                                    }
                                    .react-calendar__tile--active {
                                        background: #3b82f6 !important;
                                        color: white !important;
                                        font-weight: 600;
                                    }
                                    .react-calendar__tile--now {
                                        background: #dbeafe;
                                        font-weight: 600;
                                    }
                                    .react-calendar__tile--hasLogin {
                                        background: #10b981 !important;
                                        color: white !important;
                                        font-weight: 600;
                                        position: relative;
                                    }
                                    .react-calendar__tile--hasLogin::after {
                                        content: "✓";
                                        position: absolute;
                                        top: 2px;
                                        right: 4px;
                                        font-size: 0.7rem;
                                    }
                                    .react-calendar__month-view__days__day--neighboringMonth {
                                        color: #d1d5db;
                                    }
                                `}</style>
                                <Calendar
                                    value={new Date()}
                                    tileClassName={({ date }) => {
                                        // Use local date string instead of UTC to avoid timezone issues
                                        // react-calendar passes local date objects at midnight
                                        const year = date.getFullYear();
                                        const month = String(
                                            date.getMonth() + 1
                                        ).padStart(2, "0");
                                        const day = String(
                                            date.getDate()
                                        ).padStart(2, "0");
                                        const dateStr = `${year}-${month}-${day}`;

                                        const hasLogin = mockLoginData.find(
                                            (d: any) => d.date === dateStr
                                        )?.hasLogin;

                                        // 🔍 DEBUG: Log calendar tile date matching
                                        if (hasLogin) {
                                            console.log(
                                                "📆 Calendar tile matched:",
                                                {
                                                    tileDate: date,
                                                    tileDateISO:
                                                        date.toISOString(),
                                                    tileDateLocal: dateStr,
                                                    matchedData:
                                                        mockLoginData.find(
                                                            (d: any) =>
                                                                d.date ===
                                                                dateStr
                                                        ),
                                                }
                                            );
                                        }

                                        return hasLogin
                                            ? "react-calendar__tile--hasLogin"
                                            : "";
                                    }}
                                    locale="en-US"
                                    showNeighboringMonth={true}
                                    next2Label={null}
                                    prev2Label={null}
                                />
                            </div>

                            {/* Login Statistics */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-green-600 font-medium">
                                            Current Streak
                                        </div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {loginStreakDays} days
                                        </div>
                                    </div>
                                    <img
                                        src="/icons/local_fire_department.svg"
                                        alt="Fire"
                                        className="w-8 h-8"
                                        style={{
                                            filter: "invert(45%) sepia(100%) saturate(1000%) hue-rotate(100deg) brightness(0.9)",
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-blue-600 font-medium">
                                            Max Streak
                                        </div>
                                        <div className="text-2xl font-bold text-blue-700">
                                            {maxLoginStreak} days
                                        </div>
                                    </div>
                                    <img
                                        src="/icons/bolt.svg"
                                        alt="Lightning"
                                        className="w-8 h-8"
                                        style={{
                                            filter: "invert(40%) sepia(100%) saturate(1500%) hue-rotate(200deg) brightness(0.9)",
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-purple-600 font-medium">
                                            Total Days
                                        </div>
                                        <div className="text-2xl font-bold text-purple-700">
                                            {totalLoginDays} days
                                        </div>
                                    </div>
                                    <img
                                        src="/icons/event.svg"
                                        alt="Calendar"
                                        className="w-8 h-8"
                                        style={{
                                            filter: "invert(40%) sepia(100%) saturate(1500%) hue-rotate(260deg) brightness(0.9)",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Motivational Message */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                                <p className="text-sm text-gray-700 italic flex items-center gap-2">
                                    <img
                                        src="/icons/psychology.svg"
                                        alt="Motivation"
                                        className="w-5 h-5 flex-shrink-0"
                                        style={{
                                            filter: "invert(35%) sepia(50%) saturate(1000%) hue-rotate(150deg) brightness(0.9)",
                                        }}
                                    />
                                    <span>
                                        You&apos;ve maintained a{" "}
                                        <strong>{loginStreakDays}-day</strong>{" "}
                                        login streak. Consistent practice is the
                                        key to interview success!
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Performance Dimensions - Right Side (2 cols) */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Performance Dimensions Analysis
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        5-dimensional breakdown of your
                                        interview skills
                                    </p>
                                </div>

                                {/* Target Score Settings */}
                                <div className="flex items-center gap-2">
                                    {showTargetInput ? (
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                            <label className="text-sm font-medium text-gray-700">
                                                Target:
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                value={targetScore}
                                                onChange={(e) => {
                                                    const value = parseFloat(
                                                        e.target.value
                                                    );
                                                    if (
                                                        value >= 0 &&
                                                        value <= 5
                                                    ) {
                                                        setTargetScore(value);
                                                    }
                                                }}
                                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <span className="text-sm text-gray-600">
                                                /5
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setShowTargetInput(false)
                                                }
                                                className="ml-2 text-green-600 hover:text-green-700 font-medium text-sm"
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setShowTargetInput(true)
                                            }
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                                        >
                                            <span>⚙️</span>
                                            <span>
                                                Set Target ({targetScore}/5)
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Radar Chart */}
                            <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={radarChartData}>
                                        <defs>
                                            <linearGradient
                                                id="radarGradient1"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#2563eb"
                                                    stopOpacity={0.3}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="radarGradient2"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.6}
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#059669"
                                                    stopOpacity={0.2}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <PolarGrid
                                            stroke="#cbd5e1"
                                            strokeWidth={1.5}
                                            strokeDasharray="3 3"
                                        />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{
                                                fill: "#1e293b",
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                            tickLine={false}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 5]}
                                            tick={{
                                                fill: "#64748b",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            }}
                                            tickCount={6}
                                            axisLine={false}
                                        />
                                        {/* Target/Benchmark Layer (behind) */}
                                        <Radar
                                            name={`Target (${targetScore}/5)`}
                                            dataKey="target"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fill="url(#radarGradient2)"
                                            fillOpacity={0.4}
                                            dot={{
                                                r: 4,
                                                fill: "#10b981",
                                                strokeWidth: 0,
                                            }}
                                        />
                                        {/* Current Performance Layer (front) */}
                                        <Radar
                                            name="Your Performance"
                                            dataKey="current"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fill="url(#radarGradient1)"
                                            fillOpacity={0.6}
                                            dot={{
                                                r: 5,
                                                fill: "#3b82f6",
                                                strokeWidth: 2,
                                                stroke: "#fff",
                                            }}
                                            activeDot={{
                                                r: 7,
                                                fill: "#2563eb",
                                                strokeWidth: 2,
                                                stroke: "#fff",
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                border: "2px solid #e2e8f0",
                                                borderRadius: "12px",
                                                boxShadow:
                                                    "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                                padding: "12px 16px",
                                            }}
                                            labelStyle={{
                                                color: "#1e293b",
                                                fontWeight: 700,
                                                fontSize: "14px",
                                                marginBottom: "8px",
                                            }}
                                            itemStyle={{
                                                color: "#64748b",
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                padding: "4px 0",
                                            }}
                                            formatter={(
                                                value: number,
                                                name: string
                                            ) => [
                                                `${value.toFixed(2)}/5`,
                                                name,
                                            ]}
                                        />
                                        <Legend
                                            wrapperStyle={{
                                                paddingTop: "20px",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                            }}
                                            iconType="circle"
                                            iconSize={12}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>

                                {/* Chart Legend Description */}
                                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-gray-700 font-medium">
                                            Your Current Performance
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-gray-700 font-medium">
                                            Target Benchmark ({targetScore}/5)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Latest Interview Questions Summary */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-800 mb-3">
                                    Latest Interview - Question Summaries:
                                </h4>
                                {latestInterviewQuestions.length === 0 ? (
                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 text-center">
                                        <p className="text-gray-600">
                                            No interview data available yet.
                                            Complete your first interview to see
                                            detailed feedback here!
                                        </p>
                                    </div>
                                ) : (
                                    latestInterviewQuestions.map(
                                        (question: any, index: number) => (
                                            <div
                                                key={question.questionId}
                                                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="text-2xl">
                                                        💬
                                                    </span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-semibold text-gray-800">
                                                                Question #
                                                                {index + 1}
                                                            </h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-bold text-gray-800">
                                                                    {question.averageScore.toFixed(
                                                                        2
                                                                    )}
                                                                    /5
                                                                </span>
                                                                <span
                                                                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                                        question.averageScore >=
                                                                        3.5
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-orange-100 text-orange-700"
                                                                    }`}
                                                                >
                                                                    {question.averageScore >=
                                                                    3.5
                                                                        ? "✓ Good"
                                                                        : "⚠ Needs Work"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 font-medium mb-2">
                                                            {
                                                                question.questionText
                                                            }
                                                        </p>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                                            <div
                                                                className={`h-2 rounded-full transition-all ${
                                                                    question.averageScore >=
                                                                    3.5
                                                                        ? "bg-green-500"
                                                                        : "bg-orange-500"
                                                                }`}
                                                                style={{
                                                                    width: `${
                                                                        (question.averageScore /
                                                                            5) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                                                            <p className="text-xs text-gray-700">
                                                                <strong>
                                                                    📝 Summary:
                                                                </strong>{" "}
                                                                {
                                                                    question.overallSummary
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
