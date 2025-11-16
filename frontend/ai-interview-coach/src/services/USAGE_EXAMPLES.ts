/**
 * Service Usage Examples
 * Demonstrates how to use the data services in Progress and Game pages
 */

import { getProgressPageData } from "./progressService";
import {
    getGamePageData,
    getBadgeProgress,
    getRecentlyUnlockedBadges,
} from "./gameService";

// ============================================
// PROGRESS PAGE USAGE EXAMPLE
// ============================================

/**
 * Example: Fetching data for Progress page
 */
export async function exampleProgressPageUsage(token: string) {
    try {
        // Fetch all progress data with a single API call
        const progressData = await getProgressPageData(token);

        // Use readiness scores for the line chart
        console.log("Readiness Scores:", progressData.readinessScores);
        // Output: [
        //   { session: 1, score: 65, date: Date },
        //   { session: 2, score: 72, date: Date },
        //   ...
        // ]

        // Use login data for the calendar
        console.log("Login Calendar Data:", progressData.loginData);
        // Output: [
        //   { date: "2025-10-01", hasLogin: true },
        //   { date: "2025-10-02", hasLogin: true },
        //   ...
        // ]

        // Use login statistics for streak cards
        console.log("Current Streak:", progressData.loginStreakDays);
        console.log("Max Streak:", progressData.maxLoginStreak);
        console.log("Total Days:", progressData.totalLoginDays);

        // Use dimension performance for radar chart
        console.log(
            "Dimension Performance:",
            progressData.dimensionPerformance
        );
        // Output: [
        //   {
        //     dimension: ScoreDimension.CLARITY_STRUCTURE,
        //     dimension_name: "Clarity & Structure",
        //     average_score: 4.2,
        //     percentage: 84,
        //     is_strength: true
        //   },
        //   ...
        // ]

        // Transform for radar chart
        const radarChartData = progressData.dimensionPerformance.map((dim) => ({
            subject: dim.dimension_name.split(" ")[0], // "Clarity"
            current: dim.percentage, // 84
            target: 85, // Target benchmark
            fullMark: 100,
        }));

        return progressData;
    } catch (error) {
        console.error("Error fetching progress data:", error);
        throw error;
    }
}

// ============================================
// GAME PAGE USAGE EXAMPLE
// ============================================

/**
 * Example: Fetching data for Game page
 */
export async function exampleGamePageUsage(token: string) {
    try {
        // Fetch all game data with a single API call
        const gameData = await getGamePageData(token);

        // Use badge data for badge display
        console.log("All Badges:", gameData.badges);
        // Output: [
        //   { badgeId: 1, unlockedTimestamp: 1698796800, unlockedDate: Date, isUnlocked: true },
        //   { badgeId: 2, unlockedTimestamp: 0, unlockedDate: Date(0), isUnlocked: false },
        //   ...
        // ]

        // Filter unlocked vs locked badges
        const unlockedBadges = gameData.badges.filter((b) => b.isUnlocked);
        const lockedBadges = gameData.badges.filter((b) => !b.isUnlocked);
        console.log("Unlocked:", unlockedBadges.length);
        console.log("Locked:", lockedBadges.length);

        // Use XP data for progress bar
        console.log("XP Data:", gameData.xpData);
        // Output: {
        //   currentXP: 1250,
        //   currentLevel: 3,
        //   xpToNextLevel: 350,
        //   levelProgress: 65.5
        // }

        // Get badge progress percentage
        const badgeProgressPercent = getBadgeProgress(gameData);
        console.log("Badge Progress:", badgeProgressPercent + "%");

        // Get recently unlocked badges
        const recentBadges = getRecentlyUnlockedBadges(gameData, 5);
        console.log("Recently Unlocked:", recentBadges);

        return gameData;
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}

// ============================================
// REACT COMPONENT USAGE EXAMPLES
// ============================================

/**
 * Example: Using in a React component with useState and useEffect
 */
/*
import { useState, useEffect } from 'react';
import { getProgressPageData, type ProgressPageData } from '@/services';

function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('auth_token'); // or from your auth context
        if (!token) {
          throw new Error('No authentication token found');
        }

        const data = await getProgressPageData(token);
        setProgressData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!progressData) return null;

  return (
    <div>
      <h1>Progress Tracking</h1>
      <p>Total Interviews: {progressData.totalInterviews}</p>
      <p>Current Streak: {progressData.loginStreakDays} days</p>
      
      // Use progressData.readinessScores for chart
      // Use progressData.dimensionPerformance for radar
      // Use progressData.loginData for calendar
    </div>
  );
}
*/

/**
 * Example: Using in Game page
 */
/*
import { useState, useEffect } from 'react';
import { getGamePageData, getBadgeProgress, type GamePageData } from '@/services';

function GamePage() {
  const [gameData, setGameData] = useState<GamePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const data = await getGamePageData(token);
        setGameData(data);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || !gameData) return <div>Loading...</div>;

  const badgeProgress = getBadgeProgress(gameData);

  return (
    <div>
      <h1>Gamification</h1>
      <p>Level: {gameData.xpData.currentLevel}</p>
      <p>XP: {gameData.xpData.currentXP}</p>
      <p>Badge Progress: {badgeProgress}%</p>
      
      <div>
        {gameData.badges.map(badge => (
          <BadgeCard 
            key={badge.badgeId} 
            badge={badge}
          />
        ))}
      </div>
    </div>
  );
}
*/
