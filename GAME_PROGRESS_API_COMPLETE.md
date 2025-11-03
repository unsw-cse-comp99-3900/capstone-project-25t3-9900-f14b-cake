# Game & Progress Pages API Documentation

**Author**: Aaron  
**Pages**: Game Page (`/game`) & Progress Page (`/progress`)  
**Date**: 2025-10-24  
**Version**: 3.0 Final

---

## 📋 API Overview

This document contains all API endpoints required for the Game and Progress pages.

### Base Configuration

-   **Base URL**: `http://localhost:5555`
-   **Authentication**: Bearer Token (automatically handled by `fetcher`)
-   **Response Format**: Direct JSON (no wrapper)

---

## 🎮 Game Page APIs

The Game page requires **2 API endpoints** for gamification features.

### 1. Get User Gamification Data

**Endpoint**: `GET /gamification/user`

**Purpose**: Fetch complete gamification status including XP, badges, login streaks, and statistics.

**Authentication**: Required (Bearer Token)

**Request**:

```http
GET /gamification/user
Authorization: Bearer <token>
```

**Response**:

```json
{
    "user_id": "user_12345",
    "total_xp": 850,
    "current_level": 4,
    "level_progress": 70,
    "badges": [
        {
            "id": "FIRST_XP",
            "unlocked_at": "2025-10-10T10:30:00Z"
        },
        {
            "id": "XP_100",
            "unlocked_at": null
        },
        {
            "id": "FIRST_ANSWER",
            "unlocked_at": "2025-10-11T14:20:00Z"
        }
    ],
    "unlocked_badges": ["FIRST_XP", "FIRST_ANSWER", "LOGIN_STREAK_3"],
    "login_streak": 5,
    "max_login_streak": 7,
    "last_login_date": "2025-10-24",
    "total_login_days": 15,
    "total_answers": 42,
    "correct_answers": 35,
    "accuracy_rate": 83.3,
    "total_sessions": 8,
    "completed_sessions": 7
}
```

**Response Fields**:

| Field                  | Type         | Description                                |
| ---------------------- | ------------ | ------------------------------------------ |
| `user_id`              | string       | User identifier                            |
| `total_xp`             | number       | Total experience points earned             |
| `current_level`        | number       | Current level (1-10)                       |
| `level_progress`       | number       | Progress to next level (0-100)             |
| `badges`               | array        | All 15 badge records (locked and unlocked) |
| `badges[].id`          | string       | Badge ID (see Badge Types below)           |
| `badges[].unlocked_at` | string\|null | ISO timestamp or null if locked            |
| `unlocked_badges`      | string[]     | Array of unlocked badge IDs only           |
| `login_streak`         | number       | Current consecutive login days             |
| `max_login_streak`     | number       | Highest consecutive login days ever        |
| `last_login_date`      | string       | Last login date (YYYY-MM-DD)               |
| `total_login_days`     | number       | Total days user has logged in              |
| `total_answers`        | number       | Total interview questions answered         |
| `correct_answers`      | number       | Number of correct/good answers             |
| `accuracy_rate`        | number       | Percentage (0-100)                         |
| `total_sessions`       | number       | Total interview sessions started           |
| `completed_sessions`   | number       | Sessions completed                         |

**Badge Types** (15 total):

| Category           | Badge ID              | Requirement                  |
| ------------------ | --------------------- | ---------------------------- |
| **XP Badges**      | `FIRST_XP`            | Earn first XP                |
|                    | `XP_100`              | Reach 100 XP                 |
|                    | `XP_500`              | Reach 500 XP                 |
|                    | `XP_1000`             | Reach 1000 XP                |
| **Answer Badges**  | `FIRST_ANSWER`        | Answer first question        |
|                    | `ANSWER_10`           | Answer 10 questions          |
|                    | `ANSWER_50`           | Answer 50 questions          |
|                    | `ANSWER_100`          | Answer 100 questions         |
| **Login Badges**   | `LOGIN_STREAK_3`      | 3-day login streak           |
|                    | `LOGIN_STREAK_7`      | 7-day login streak           |
|                    | `LOGIN_STREAK_30`     | 30-day login streak          |
| **Mastery Badges** | `BEHAVIORAL_MASTER`   | Master behavioral interviews |
|                    | `TECHNICAL_MASTER`    | Master technical interviews  |
|                    | `PSYCHOMETRIC_MASTER` | Master psychometric tests    |
| **Special Badges** | `PERFECTIONIST`       | Achieve 100% in a session    |
|                    | `IMPROVER`            | Show consistent improvement  |
|                    | `DEDICATED`           | Practice regularly           |

**Frontend Usage**:

```typescript
import { gameService } from "@/features/game/services";

// In component
const fetchGamificationData = async () => {
    try {
        const data = await gameService.getGamificationData();
        setUserData(data);
    } catch (error) {
        console.error("Failed to fetch gamification data:", error);
    }
};
```

---

### 2. Daily Check-in

**Endpoint**: `POST /gamification/check-in`

**Purpose**: Perform daily check-in to earn XP and maintain login streak.

**Authentication**: Required (Bearer Token)

**Request**:

```http
POST /gamification/check-in
Authorization: Bearer <token>
Content-Type: application/json

{}
```

**Response**:

```json
{
    "xp_gained": 10,
    "level_up": false,
    "new_level": null,
    "badges_unlocked": [],
    "current_streak": 6,
    "daily_quote": "Today's effort is tomorrow's strength!",
    "message": "Daily check-in successful! +10 XP"
}
```

**Response Fields**:

| Field             | Type         | Description                         |
| ----------------- | ------------ | ----------------------------------- |
| `xp_gained`       | number       | XP earned from this check-in (5-10) |
| `level_up`        | boolean      | Whether user leveled up             |
| `new_level`       | number\|null | New level number if leveled up      |
| `badges_unlocked` | string[]     | Array of newly unlocked badge IDs   |
| `current_streak`  | number       | Updated login streak count          |
| `daily_quote`     | string       | Random motivational quote           |
| `message`         | string       | Success message                     |

**Business Logic**:

-   User can only check in **once per day**
-   Awards **5-10 XP** based on streak
-   Increments login streak if consecutive days
-   Returns one of 10 random daily quotes
-   May unlock badges (e.g., `LOGIN_STREAK_3`)

**Error Cases**:

-   Already checked in today → Return error message
-   Invalid token → 401 Unauthorized

**Frontend Usage**:

```typescript
import { gameService } from "@/features/game/services";

const handleCheckIn = async () => {
    try {
        const result = await gameService.checkIn();

        if (result.level_up) {
            showLevelUpModal(result.new_level);
        }

        if (result.badges_unlocked.length > 0) {
            showBadgeUnlockModal(result.badges_unlocked);
        }

        showQuoteModal(result.daily_quote);
    } catch (error) {
        alert("Already checked in today or error occurred");
    }
};
```

---

## 📊 Progress Page APIs

The Progress page requires **3 API endpoints** for progress tracking.

### 3. Get Readiness Scores

**Endpoint**: `GET /progress/readiness-scores`

**Purpose**: Fetch readiness score history over time for chart visualization.

**Authentication**: Required (Bearer Token)

**Query Parameters**:

| Parameter    | Type   | Required | Default  | Description                        |
| ------------ | ------ | -------- | -------- | ---------------------------------- |
| `time_range` | string | No       | `WEEKLY` | `WEEKLY`, `MONTHLY`, or `ALL_TIME` |

**Request**:

```http
GET /progress/readiness-scores?time_range=WEEKLY
Authorization: Bearer <token>
```

**Response**:

```json
{
    "readiness_scores": [
        {
            "date": "2025-10-01",
            "score": 65
        },
        {
            "date": "2025-10-03",
            "score": 68
        },
        {
            "date": "2025-10-05",
            "score": 72
        },
        {
            "date": "2025-10-07",
            "score": 75
        },
        {
            "date": "2025-10-15",
            "score": 88
        }
    ],
    "current_score": 88,
    "average_score": 76.5,
    "best_score": 88,
    "improvement_rate": 35.4
}
```

**Response Fields**:

| Field                      | Type   | Description            |
| -------------------------- | ------ | ---------------------- |
| `readiness_scores`         | array  | Array of score points  |
| `readiness_scores[].date`  | string | Date (YYYY-MM-DD)      |
| `readiness_scores[].score` | number | Score (0-100)          |
| `current_score`            | number | Most recent score      |
| `average_score`            | number | Average of all scores  |
| `best_score`               | number | Highest score achieved |
| `improvement_rate`         | number | Percentage improvement |

**Data Requirements**:

-   Scores must be in **0-100 range**
-   Dates in **YYYY-MM-DD format**, sorted ascending
-   **WEEKLY**: Last 7-14 days of data
-   **MONTHLY**: Last 30 days of data
-   **ALL_TIME**: All historical data

**Data Source**:

-   Calculate from interview session scores (from `/interview/feedback`)
-   Average all dimension scores per day
-   Formula: `(sum of all 5 dimensions) / 5`

**Frontend Usage**:

```typescript
import { progressService } from "@/features/progress/services";

const fetchScores = async (timeRange: string) => {
    const data = await progressService.getReadinessScores(timeRange);
    renderChart(data.readiness_scores);
};

// Default: Weekly
fetchScores("WEEKLY");

// When user changes time range
fetchScores("MONTHLY");
```

---

### 4. Get Login History

**Endpoint**: `GET /progress/login-history`

**Purpose**: Fetch login history for calendar visualization.

**Authentication**: Required (Bearer Token)

**Query Parameters**:

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- | ------- | ------------------------------ |
| `days`    | number | No       | 30      | Number of recent days to fetch |

**Request**:

```http
GET /progress/login-history?days=14
Authorization: Bearer <token>
```

**Response**:

```json
{
    "login_history": [
        {
            "date": "2025-10-01",
            "has_login": true
        },
        {
            "date": "2025-10-02",
            "has_login": true
        },
        {
            "date": "2025-10-03",
            "has_login": false
        },
        {
            "date": "2025-10-04",
            "has_login": true
        }
    ],
    "current_streak": 5,
    "max_streak": 7,
    "total_login_days": 15,
    "last_login_date": "2025-10-24"
}
```

**Response Fields**:

| Field                       | Type    | Description                    |
| --------------------------- | ------- | ------------------------------ |
| `login_history`             | array   | Array of login records         |
| `login_history[].date`      | string  | Date (YYYY-MM-DD)              |
| `login_history[].has_login` | boolean | True if user logged in         |
| `current_streak`            | number  | Current consecutive login days |
| `max_streak`                | number  | Highest consecutive days ever  |
| `total_login_days`          | number  | Total days logged in           |
| `last_login_date`           | string  | Most recent login (YYYY-MM-DD) |

**Data Requirements**:

-   Include **ALL dates** in range (even if `has_login: false`)
-   Dates in **YYYY-MM-DD format**, sorted ascending
-   `current_streak`: Count consecutive days ending **today**
-   `max_streak`: Historical maximum consecutive days

**Data Source**:

-   Track from user login events (from `/login`)
-   Can share data with gamification login streak

**Frontend Usage**:

```typescript
import { progressService } from "@/features/progress/services";

// Fetch 14 days for calendar
const data = await progressService.getLoginHistory(14);

// Render calendar
data.login_history.forEach((day) => {
    renderCalendarDay(day.date, day.has_login);
});
```

---

### 5. Get Dimension Performance

**Endpoint**: `GET /progress/dimension-performance`

**Purpose**: Fetch performance across 5 scoring dimensions from interview feedback.

**Authentication**: Required (Bearer Token)

**Query Parameters**:

| Parameter    | Type   | Required | Default    | Description                        |
| ------------ | ------ | -------- | ---------- | ---------------------------------- |
| `time_range` | string | No       | `ALL_TIME` | `WEEKLY`, `MONTHLY`, or `ALL_TIME` |

**Request**:

```http
GET /progress/dimension-performance?time_range=ALL_TIME
Authorization: Bearer <token>
```

**Response**:

```json
{
    "dimension_performances": [
        {
            "dimension": "CLARITY_STRUCTURE",
            "dimension_name": "Clarity & Structure",
            "average_score": 4.2,
            "percentage": 84,
            "is_strength": true
        },
        {
            "dimension": "RELEVANCE",
            "dimension_name": "Relevance to Question/Job",
            "average_score": 3.8,
            "percentage": 76,
            "is_strength": true
        },
        {
            "dimension": "KEYWORD_ALIGNMENT",
            "dimension_name": "Keyword & Skill Alignment",
            "average_score": 3.1,
            "percentage": 62,
            "is_strength": false
        },
        {
            "dimension": "CONFIDENCE_DELIVERY",
            "dimension_name": "Confidence & Delivery",
            "average_score": 3.5,
            "percentage": 70,
            "is_strength": false
        },
        {
            "dimension": "CONCISENESS_FOCUS",
            "dimension_name": "Conciseness & Focus",
            "average_score": 4.0,
            "percentage": 80,
            "is_strength": true
        }
    ]
}
```

**Response Fields**:

| Field                    | Type    | Description                        |
| ------------------------ | ------- | ---------------------------------- |
| `dimension_performances` | array   | All 5 dimensions (must return all) |
| `dimension`              | string  | Dimension enum value               |
| `dimension_name`         | string  | Human-readable name                |
| `average_score`          | number  | Average score (1-5 scale)          |
| `percentage`             | number  | Percentage (0-100 scale)           |
| `is_strength`            | boolean | True if percentage >= 75           |

**Score Dimensions**:

| Dimension                 | Enum Value            | Index | Description                   |
| ------------------------- | --------------------- | ----- | ----------------------------- |
| Clarity & Structure       | `CLARITY_STRUCTURE`   | 0     | How clear and well-structured |
| Relevance to Question/Job | `RELEVANCE`           | 1     | How relevant to question/job  |
| Keyword & Skill Alignment | `KEYWORD_ALIGNMENT`   | 2     | How well keywords used        |
| Confidence & Delivery     | `CONFIDENCE_DELIVERY` | 3     | How confident delivery was    |
| Conciseness & Focus       | `CONCISENESS_FOCUS`   | 4     | How concise and focused       |

**Business Logic**:

-   Each dimension score: **1-5 scale** (from interview feedback)
-   `average_score`: Average across all user's answers for that dimension
-   `percentage`: `(average_score / 5.0) * 100`
-   `is_strength`: `true` if percentage >= 75, otherwise `false`
-   **Must return all 5 dimensions**

**Data Source**:

-   Extract from `interview_score` array in `/interview/feedback` response
-   Example: `interview_score: [4, 3, 5, 4, 3]`
    -   Index 0 (4) → Clarity & Structure
    -   Index 1 (3) → Relevance
    -   Index 2 (5) → Keyword Alignment
    -   Index 3 (4) → Confidence & Delivery
    -   Index 4 (3) → Conciseness & Focus

**Frontend Usage**:

```typescript
import { progressService } from "@/features/progress/services";
import { SCORE_DIMENSION_CONFIGS } from "@/types";

const data = await progressService.getDimensionPerformance("ALL_TIME");

data.dimension_performances.forEach((dim) => {
    const config = SCORE_DIMENSION_CONFIGS[dim.dimension];

    renderDimensionBar({
        icon: config.icon,
        name: dim.dimension_name,
        score: dim.average_score,
        percentage: dim.percentage,
        isStrength: dim.is_strength,
        color: dim.is_strength ? "green" : "orange",
    });
});
```

---

## 🔗 Data Relationships

### How APIs Connect to Existing Interview System

```
User answers interview question
    ↓
POST /interview/start (existing)
  → Creates session
  → Sets question_type (behavioral/technical/psychometric)
    ↓
POST /interview/feedback (existing)
  → Returns interview_score: [4, 3, 5, 4, 3]
  → Returns interview_feedback: string
    ↓
    ↓ Backend aggregates this data
    ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│  Game Page (Gamification)                       │
│  ├─ GET /gamification/user                      │
│  │   ├─ total_answers (count from feedback)     │
│  │   ├─ correct_answers (score >= 70%)          │
│  │   ├─ total_xp (calculated from performance)  │
│  │   └─ badges (unlock based on milestones)     │
│  └─ POST /gamification/check-in                 │
│      └─ login_streak (from login events)        │
│                                                 │
│  Progress Page (Analytics)                      │
│  ├─ GET /progress/readiness-scores              │
│  │   └─ Average of all 5 dimensions per day     │
│  ├─ GET /progress/login-history                 │
│  │   └─ Track login events                      │
│  └─ GET /progress/dimension-performance         │
│      └─ Average each index of interview_score   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📝 Implementation Examples

### Game Page - Complete Example

```typescript
"use client";

import { useState, useEffect } from "react";
import { gameService } from "@/features/game/services";
import type { UserGamificationResponse } from "@/features/game/types";
import { BADGE_CONFIGS } from "@/types";

export default function GamePage() {
    const [userData, setUserData] = useState<UserGamificationResponse | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGameData();
    }, []);

    const fetchGameData = async () => {
        try {
            setLoading(true);
            const data = await gameService.getGamificationData();
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch game data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const result = await gameService.checkIn();

            // Show success message
            alert(`${result.message}\n\n"${result.daily_quote}"`);

            // Refresh data
            await fetchGameData();
        } catch (error) {
            alert("Already checked in today!");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Level {userData?.current_level}</h1>
            <p>XP: {userData?.total_xp}</p>

            <button onClick={handleCheckIn}>Daily Check-in</button>

            {/* Render badges */}
            {userData?.badges.map((badge) => (
                <div key={badge.id}>
                    <img src={BADGE_CONFIGS[badge.id].icon} />
                    <span>{badge.unlocked_at ? "Unlocked" : "Locked"}</span>
                </div>
            ))}
        </div>
    );
}
```

### Progress Page - Complete Example

```typescript
"use client";

import { useState, useEffect } from "react";
import { progressService } from "@/features/progress/services";
import { SCORE_DIMENSION_CONFIGS } from "@/types";
import type {
    ReadinessScoresResponse,
    DimensionPerformanceResponse,
} from "@/features/progress/types";

export default function ProgressPage() {
    const [scores, setScores] = useState<ReadinessScoresResponse | null>(null);
    const [dimensions, setDimensions] =
        useState<DimensionPerformanceResponse | null>(null);
    const [timeRange, setTimeRange] = useState("WEEKLY");

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        try {
            const [scoresData, dimensionsData] = await Promise.all([
                progressService.getReadinessScores(timeRange),
                progressService.getDimensionPerformance(timeRange),
            ]);

            setScores(scoresData);
            setDimensions(dimensionsData);
        } catch (error) {
            console.error("Failed to fetch progress data:", error);
        }
    };

    return (
        <div>
            {/* Readiness Chart */}
            <h2>Readiness Scores</h2>
            <svg>
                {scores?.readiness_scores.map((point, i) => (
                    <circle
                        key={point.date}
                        cx={i * 50}
                        cy={200 - point.score * 2}
                        r={5}
                    />
                ))}
            </svg>

            {/* Dimension Performance */}
            <h2>Performance Dimensions</h2>
            {dimensions?.dimension_performances.map((dim) => (
                <div key={dim.dimension}>
                    <span>{SCORE_DIMENSION_CONFIGS[dim.dimension].icon}</span>
                    <span>{dim.dimension_name}</span>
                    <span>
                        {dim.average_score}/5 ({dim.percentage}%)
                    </span>
                    <span>
                        {dim.is_strength ? "✓ Strength" : "⚠ Needs Work"}
                    </span>
                </div>
            ))}
        </div>
    );
}
```

---

## ✅ Testing Checklist

### Game Page APIs

-   [ ] **GET /gamification/user**

    -   [ ] Returns all 15 badge types
    -   [ ] Locked badges have `unlocked_at: null`
    -   [ ] Unlocked badges have valid ISO timestamp
    -   [ ] XP and level calculations correct
    -   [ ] Statistics (answers, sessions) accurate

-   [ ] **POST /gamification/check-in**
    -   [ ] Prevents duplicate check-ins same day
    -   [ ] Awards 5-10 XP correctly
    -   [ ] Increments login streak
    -   [ ] Returns random daily quote (1 of 10)
    -   [ ] Detects and returns new badge unlocks
    -   [ ] `level_up` flag works correctly

### Progress Page APIs

-   [ ] **GET /progress/readiness-scores**

    -   [ ] Scores in 0-100 range
    -   [ ] Dates sorted ascending (YYYY-MM-DD)
    -   [ ] Weekly returns ~7-14 data points
    -   [ ] Monthly returns ~30 data points
    -   [ ] Statistics (current, average, best) calculated correctly

-   [ ] **GET /progress/login-history**

    -   [ ] Includes ALL dates in range
    -   [ ] `has_login` boolean correct
    -   [ ] Current streak counts consecutive days to today
    -   [ ] Max streak is historical maximum

-   [ ] **GET /progress/dimension-performance**
    -   [ ] Returns all 5 dimensions
    -   [ ] `average_score` in 1-5 range
    -   [ ] `percentage` = (average_score / 5) \* 100
    -   [ ] `is_strength` = (percentage >= 75)
    -   [ ] Time range filtering works

### Authentication

-   [ ] All endpoints require Bearer token
-   [ ] Invalid token returns 401
-   [ ] User identity extracted from token (no userId in requests)

---

## 📊 Summary Table

| Page     | Endpoint                          | Method | Purpose              | Dependencies                  |
| -------- | --------------------------------- | ------ | -------------------- | ----------------------------- |
| Game     | `/gamification/user`              | GET    | Get user game data   | Interview answers, sessions   |
| Game     | `/gamification/check-in`          | POST   | Daily check-in       | Login tracking                |
| Progress | `/progress/readiness-scores`      | GET    | Score history chart  | Interview feedback scores     |
| Progress | `/progress/login-history`         | GET    | Login calendar       | Login events                  |
| Progress | `/progress/dimension-performance` | GET    | 5 dimension analysis | Interview score array indices |

---

## 🚀 Next Steps

### For Frontend (Aaron)

1. Replace mock data in pages with real API calls
2. Add error handling and loading states
3. Test all API integrations

### For Backend Team

1. Implement all 5 endpoints
2. Set up data aggregation from interview system
3. Test with Postman/curl
4. Deploy and share API base URL

---

**End of Documentation**
