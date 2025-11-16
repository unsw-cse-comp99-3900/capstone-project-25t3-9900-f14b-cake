# Services Layer Documentation

## 📁 Structure

```
src/services/
├── api.ts                    # Base API configuration and utilities
├── userStatsService.ts       # Core user statistics fetching and transformation
├── progressService.ts        # Progress page specific data service
├── gameService.ts           # Game page specific data service
├── index.ts                 # Central export point
├── USAGE_EXAMPLES.ts        # Detailed usage examples
└── README.md               # This file
```

---

## 🎯 Purpose

This services layer provides a unified, typed interface for fetching and transforming backend data for the **Progress** and **Game** pages. It encapsulates all API calls and data transformations in one place, making the components cleaner and easier to maintain.

---

## 🚀 Quick Start

### For Progress Page

```typescript
import { getProgressPageData } from "@/services";

// In your component
const progressData = await getProgressPageData(token);

// Use the data
console.log(progressData.readinessScores); // For line chart
console.log(progressData.dimensionPerformance); // For radar chart
console.log(progressData.loginData); // For calendar
console.log(progressData.loginStreakDays); // For streak display
```

### For Game Page

```typescript
import { getGamePageData, getBadgeProgress } from "@/services";

// In your component
const gameData = await getGamePageData(token);

// Use the data
console.log(gameData.badges); // All badges (locked + unlocked)
console.log(gameData.xpData); // XP and level info
console.log(getBadgeProgress(gameData)); // Badge completion percentage
```

---

## 📊 Data Flow

```
Backend API (/user/statistics)
         ↓
   getUserStatistics()
   (Raw API response → Typed UserProgressData)
         ↓
    ┌────────────────┬────────────────┐
    ↓                ↓                ↓
getProgressPageData() getGamePageData() (Transform for specific pages)
    ↓                ↓
Progress Page      Game Page
```

---

## 🔑 Key Features

### 1. **Single API Call**

-   Both Progress and Game pages use `/user/statistics` endpoint
-   One API call fetches all necessary data
-   Reduces network requests and loading time

### 2. **Type Safety**

-   Full TypeScript support
-   Well-defined interfaces for all data structures
-   Compile-time error checking

### 3. **Data Transformation**

-   Backend data (snake_case) → Frontend data (camelCase)
-   Timestamps → Date objects
-   5-point scale → Percentage (0-100)
-   Raw API response → Page-specific structures

### 4. **Error Handling**

-   Custom APIError class
-   Detailed error messages
-   HTTP status code tracking

### 5. **Extensibility**

-   Easy to add new endpoints
-   Modular service structure
-   Utility functions for common operations

---

## 📖 API Reference

### Core Services

#### `getUserStatistics(token: string): Promise<UserProgressData>`

Fetches raw statistics from backend and transforms into frontend-friendly format.

**Returns:**

```typescript
{
  userId: string,
  userEmail: string,
  xp: number,
  badges: Array<{ badgeId, unlockedTimestamp, unlockedDate }>,
  totalBadges: number,
  loginStreak: number,
  totalLogins: number,
  lastLogin: string,
  totalInterviews: number,
  totalQuestions: number,
  interviews: Array<{ interviewId, timestamp, date }>,
  dimensions: {
    clarity: { max, total, average, percentage },
    relevance: { max, total, average, percentage },
    keyword: { max, total, average, percentage },
    confidence: { max, total, average, percentage },
    conciseness: { max, total, average, percentage }
  },
  overallScore: { max, total, average }
}
```

---

### Progress Page Service

#### `getProgressPageData(token: string): Promise<ProgressPageData>`

Transforms user statistics into Progress page specific format.

**Returns:**

```typescript
{
  readinessScores: Array<{ session, score, date }>,
  loginData: Array<{ date, hasLogin }>,
  loginStreakDays: number,
  maxLoginStreak: number,
  totalLoginDays: number,
  dimensionPerformance: Array<{
    dimension: ScoreDimension,
    dimension_name: string,
    average_score: number,
    percentage: number,
    is_strength: boolean
  }>,
  userId: string,
  userEmail: string,
  xp: number,
  totalInterviews: number,
  totalQuestions: number
}
```

**Usage in Progress Page:**

```typescript
const data = await getProgressPageData(token);

// For Recharts LineChart
<LineChart data={data.readinessScores}>
    <XAxis dataKey="session" />
    <YAxis />
    <Line dataKey="score" />
</LineChart>;

// For Recharts RadarChart
const radarData = data.dimensionPerformance.map((dim) => ({
    subject: dim.dimension_name.split(" ")[0],
    current: dim.percentage,
    target: 85,
}));

// For Calendar
<Calendar
    tileClassName={({ date }) => {
        const dateStr = date.toISOString().split("T")[0];
        const hasLogin = data.loginData.find(
            (d) => d.date === dateStr
        )?.hasLogin;
        return hasLogin ? "has-login" : "";
    }}
/>;
```

---

### Game Page Service

#### `getGamePageData(token: string): Promise<GamePageData>`

Transforms user statistics into Game page specific format.

**Returns:**

```typescript
{
  badges: Array<{
    badgeId: number,
    unlockedTimestamp: number,
    unlockedDate: Date,
    isUnlocked: boolean
  }>,
  totalBadges: number,        // Total possible badges (30)
  unlockedBadges: number,     // User's unlocked count
  xpData: {
    currentXP: number,
    currentLevel: number,
    xpToNextLevel: number,
    levelProgress: number      // 0-100 percentage
  },
  userId: string,
  userEmail: string
}
```

#### Helper Functions

**`getBadgeProgress(gameData: GamePageData): number`**
Returns percentage of badges unlocked (0-100).

**`getRecentlyUnlockedBadges(gameData: GamePageData, count?: number): BadgeUnlockData[]`**
Returns N most recently unlocked badges, sorted by unlock time.

**Usage in Game Page:**

```typescript
const data = await getGamePageData(token);

// Display badge grid
{data.badges.map(badge => (
  <Badge
    key={badge.badgeId}
    locked={!badge.isUnlocked}
    unlockedDate={badge.unlockedDate}
  />
))}

// Display XP progress
<ProgressBar
  current={data.xpData.currentXP}
  max={(data.xpData.currentLevel + 1) ** 2 * 100}
  percentage={data.xpData.levelProgress}
/>

// Badge statistics
<p>Unlocked: {data.unlockedBadges} / {data.totalBadges}</p>
<p>Progress: {getBadgeProgress(data)}%</p>
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:9000
```

This will be used by `API_ENDPOINTS` in `api.ts`.

---

## 🛡️ Error Handling

All services use the `APIError` class for consistent error handling:

```typescript
try {
    const data = await getProgressPageData(token);
} catch (error) {
    if (error instanceof APIError) {
        console.error("API Error:", error.message);
        console.error("Status:", error.status);
        console.error("Details:", error.details);
    } else {
        console.error("Unknown error:", error);
    }
}
```

---

## 🧪 Testing

See `USAGE_EXAMPLES.ts` for detailed usage examples and patterns.

---

## 📝 Notes

1. **Authentication**: All services require a valid JWT token
2. **Mock Data Fallback**: If no backend data, services provide sensible defaults
3. **Date Handling**: Timestamps are automatically converted to Date objects
4. **Score Conversion**: 5-point scores are converted to percentages (0-100)

---

## 🤝 Integration with Existing Code

### Replacing Mock Data in Progress Page

**Before:**

```typescript
const mockReadinessDataAll = [
    { session: 1, score: 65 },
    // ...
];
```

**After:**

```typescript
const [progressData, setProgressData] = useState<ProgressPageData | null>(null);

useEffect(() => {
    async function fetchData() {
        const token = getAuthToken(); // Your auth method
        const data = await getProgressPageData(token);
        setProgressData(data);
    }
    fetchData();
}, []);

// Use progressData.readinessScores instead of mockReadinessDataAll
```

### Replacing Mock Data in Game Page

**Before:**

```typescript
const mockBadges = [...];
```

**After:**

```typescript
const [gameData, setGameData] = useState<GamePageData | null>(null);

useEffect(() => {
    async function fetchData() {
        const token = getAuthToken();
        const data = await getGamePageData(token);
        setGameData(data);
    }
    fetchData();
}, []);

// Use gameData.badges instead of mockBadges
```

---

## 📚 Further Reading

-   See `USAGE_EXAMPLES.ts` for complete component examples
-   Check backend `/user/statistics` API documentation
-   Review TypeScript interfaces in each service file
