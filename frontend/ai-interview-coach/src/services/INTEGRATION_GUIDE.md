# 🚀 Quick Integration Guide

## 快速集成你的 Progress 和 Game 页面

### ✅ 已完成的工作

我已经为你创建了完整的服务层:

```
src/services/
├── api.ts                  ✅ API 基础配置和工具函数
├── userStatsService.ts     ✅ 用户统计数据服务(核心)
├── progressService.ts      ✅ Progress 页面数据服务
├── gameService.ts         ✅ Game 页面数据服务
├── index.ts               ✅ 统一导出
├── USAGE_EXAMPLES.ts      ✅ 详细使用示例
└── README.md              ✅ 完整文档
```

---

## 📝 集成步骤

### Step 1: 在 Progress 页面使用服务

打开 `src/app/progress/page.tsx`:

```typescript
// 1. 添加导入
import { getProgressPageData, type ProgressPageData } from "@/services";
import { useState, useEffect } from "react";

// 2. 在组件中添加状态
export default function ProgressPage() {
    const [progressData, setProgressData] = useState<ProgressPageData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. 添加数据获取逻辑
    useEffect(() => {
        async function fetchData() {
            try {
                // 从你的认证系统获取 token
                const token = localStorage.getItem("auth_token"); // 或使用你的 auth context

                if (!token) {
                    throw new Error("未找到认证令牌");
                }

                const data = await getProgressPageData(token);
                setProgressData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "未知错误");
                console.error("获取进度数据失败:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // 4. 添加加载和错误状态
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (!progressData) {
        return null;
    }

    // 5. 替换 mock 数据
    // 原来: const mockReadinessData = ...
    // 现在: 使用 progressData.readinessScores

    // 原来: const mockLoginData = ...
    // 现在: 使用 progressData.loginData

    // 原来: const mockCategoryPerformance = ...
    // 现在: 使用 progressData.dimensionPerformance

    // 6. 更新雷达图数据
    const radarChartData = progressData.dimensionPerformance.map((dim) => ({
        subject: dim.dimension_name.split(" ")[0],
        current: dim.percentage,
        target: 85,
        fullMark: 100,
    }));

    // 7. 其他数据直接使用
    const loginStreakDays = progressData.loginStreakDays;
    const maxLoginStreak = progressData.maxLoginStreak;
    const totalLoginDays = progressData.totalLoginDays;

    // ... 其余的 JSX 保持不变
}
```

### 具体替换示例

#### 替换折线图数据:

**Before:**

```typescript
const mockReadinessData =
    timeRange === TimeRange.RECENT_7
        ? mockReadinessDataAll.slice(-7)
        : mockReadinessDataAll.slice(-15);
```

**After:**

```typescript
const mockReadinessData =
    timeRange === TimeRange.RECENT_7
        ? progressData.readinessScores.slice(-7)
        : progressData.readinessScores.slice(-15);
```

#### 替换日历数据:

**Before:**

```typescript
tileClassName={({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasLogin = mockLoginData.find(d => d.date === dateStr)?.hasLogin;
    return hasLogin ? "react-calendar__tile--hasLogin" : "";
}}
```

**After:**

```typescript
tileClassName={({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasLogin = progressData.loginData.find(d => d.date === dateStr)?.hasLogin;
    return hasLogin ? "react-calendar__tile--hasLogin" : "";
}}
```

#### 替换统计数据:

**Before:**

```typescript
const loginStreakDays =
    currentStreak === -1 ? mockLoginData.length : currentStreak;
const totalLoginDays = mockLoginData.filter((d) => d.hasLogin).length;
const maxLoginStreak = 7;
```

**After:**

```typescript
const loginStreakDays = progressData.loginStreakDays;
const totalLoginDays = progressData.totalLoginDays;
const maxLoginStreak = progressData.maxLoginStreak;
```

---

### Step 2: 在 Game 页面使用服务

打开 `src/app/game/page.tsx`:

```typescript
// 1. 添加导入
import {
    getGamePageData,
    getBadgeProgress,
    type GamePageData,
} from "@/services";
import { useState, useEffect } from "react";

// 2. 在组件中添加状态
export default function GamePage() {
    const [gameData, setGameData] = useState<GamePageData | null>(null);
    const [loading, setLoading] = useState(true);

    // 3. 添加数据获取逻辑
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("auth_token");

                if (!token) {
                    console.warn("未找到认证令牌,使用默认数据");
                    setLoading(false);
                    return;
                }

                const data = await getGamePageData(token);
                setGameData(data);
            } catch (error) {
                console.error("获取游戏数据失败:", error);
                // 可以选择显示错误或使用默认数据
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // 4. 使用数据
    if (!loading && gameData) {
        // 使用 gameData.badges 替换 mock badges
        // 使用 gameData.xpData 显示 XP 和等级
        // 使用 getBadgeProgress(gameData) 显示进度
    }

    // ... 其余的 JSX
}
```

#### 具体替换示例:

**显示徽章:**

```typescript
{
    gameData?.badges.map((badge) => (
        <div
            key={badge.badgeId}
            className={badge.isUnlocked ? "unlocked" : "locked"}
        >
            <Badge id={badge.badgeId} />
            {badge.isUnlocked && (
                <p>解锁于: {badge.unlockedDate.toLocaleDateString()}</p>
            )}
        </div>
    ));
}
```

**显示 XP 和等级:**

```typescript
{
    gameData && (
        <>
            <p>Level: {gameData.xpData.currentLevel}</p>
            <p>XP: {gameData.xpData.currentXP}</p>
            <p>到下一级: {gameData.xpData.xpToNextLevel} XP</p>
            <ProgressBar value={gameData.xpData.levelProgress} max={100} />
        </>
    );
}
```

**显示徽章进度:**

```typescript
{
    gameData && <p>徽章收集进度: {getBadgeProgress(gameData)}%</p>;
}
```

---

## 🔑 关键点

### 1. **认证 Token 获取**

你需要确定如何获取用户的认证 token。常见方式:

```typescript
// 方式 1: 从 localStorage
const token = localStorage.getItem("auth_token");

// 方式 2: 从 auth context (如果你使用了 context)
const { token } = useAuth();

// 方式 3: 从 cookies
import Cookies from "js-cookie";
const token = Cookies.get("auth_token");
```

### 2. **环境变量配置**

创建 `.env.local` 文件:

```bash
NEXT_PUBLIC_API_URL=http://localhost:9000
```

### 3. **保持 Mock 数据作为后备**

在获取真实数据失败时,可以回退到 mock 数据:

```typescript
const [progressData, setProgressData] = useState<ProgressPageData | null>(null);

useEffect(() => {
    async function fetchData() {
        try {
            const token = getAuthToken();
            if (token) {
                const data = await getProgressPageData(token);
                setProgressData(data);
            }
        } catch (error) {
            console.error("使用 mock 数据:", error);
            // 保留原有的 mock 数据逻辑作为后备
        }
    }
    fetchData();
}, []);

// 如果 progressData 为 null,使用 mock 数据
const dataToUse = progressData || {
    readinessScores: mockReadinessDataAll,
    loginData: mockLoginData,
    dimensionPerformance: mockCategoryPerformance,
    // ...
};
```

---

## 🎯 测试步骤

### 1. 启动后端

```bash
cd backend
python manage_docker.py start
```

### 2. 启动前端

```bash
cd frontend/ai-interview-coach
npm run dev
```

### 3. 测试流程

1. 登录获取 token
2. 访问 Progress 页面,检查数据是否正确加载
3. 访问 Game 页面,检查徽章和 XP 是否显示
4. 检查浏览器控制台是否有错误

---

## 📞 需要帮助?

如果遇到问题:

1. 检查浏览器控制台的错误信息
2. 检查 Network 标签,看 API 请求是否成功
3. 验证 token 是否有效
4. 确认后端服务是否运行在 localhost:9000

---

## ✨ 优势

使用这个服务层的好处:

✅ **单一数据源**: 一个 API 调用获取所有数据
✅ **类型安全**: 完整的 TypeScript 支持
✅ **易于维护**: 数据转换逻辑集中管理
✅ **可复用**: Progress 和 Game 页面共享相同的核心服务
✅ **错误处理**: 统一的错误处理机制
✅ **文档完善**: 详细的文档和示例

---

## 🚀 下一步

1. 按照上述步骤集成到 Progress 页面
2. 按照上述步骤集成到 Game 页面
3. 测试所有功能
4. 根据实际 API 响应调整数据转换逻辑(如果需要)
5. 移除不再需要的 mock 数据(可选)

祝你集成顺利! 🎉
