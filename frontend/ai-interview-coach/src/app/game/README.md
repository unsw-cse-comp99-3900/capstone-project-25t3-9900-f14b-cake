# Game Page - User Guide

## Overview

The Game Page brings gamification elements to your interview practice experience. Earn badges, track your achievements, level up, and stay motivated with daily inspirational quotes. This page transforms interview preparation into an engaging journey.

## Features

### 1. User Progress Dashboard

**Purpose**: Quick overview of your gaming achievements and status

**Key Metrics**:

-   **Current Level**: Your experience level (starts at 1)
-   **Total XP**: Cumulative experience points earned
-   **Unlocked Badges**: Number of badges you've achieved

**How It Works**:

-   Earn XP by completing interviews and achieving milestones
-   Level up when you reach XP thresholds
-   Track your journey from beginner to expert

### 2. Daily Motivational Quote

**Purpose**: Inspire and motivate you for your practice session

**Features**:

-   New quote displayed each time you visit
-   Carefully curated collection of motivational messages
-   Encourages consistent practice and growth mindset

**Example Quotes**:

-   "Every expert was once a beginner. Keep practicing!"
-   "Success is the sum of small efforts repeated day in and day out."
-   "Your preparation today is your confidence tomorrow."

### 3. Badge Collection

**Purpose**: Recognize and reward your achievements

#### Badge States

**Unlocked Badges**:

-   Yellow border (`border-yellow-400`)
-   Full-color icons
-   Display unlock date
-   Show earned XP
-   Clickable for details

**Locked Badges**:

-   Gray border (`border-gray-600`)
-   Grayscale icons
-   Show unlock requirements
-   Display potential XP reward
-   Clickable to see what's needed

#### Badge Categories

**Practice Frequency**:

-   First Interview: Complete your first practice session
-   Week Warrior: Practice 7 days in a row
-   Month Master: Practice 30 days in a row
-   Century Club: Complete 100 interviews

**Performance Excellence**:

-   Perfect Score: Achieve 100% readiness in an interview
-   Consistent Pro: Score above 80% in 10 consecutive sessions
-   Improvement King: Increase your score by 20+ points

**Skill Development**:

-   Clear Communicator: Master Clarity & Structure dimension
-   Relevant Responder: Excel in Relevance dimension
-   Keyword Expert: Perfect Keyword Alignment
-   Confident Speaker: Ace Confidence & Delivery
-   Concise Genius: Master the art of brevity

### 4. Badge Detail Modal

**Purpose**: View detailed information about any badge

**Information Displayed**:

-   Badge name and description
-   Icon (colored if unlocked, grayscale if locked)
-   XP reward value
-   Current status (Unlocked/Locked)
-   Unlock date (for unlocked badges)
-   Requirements to unlock (for locked badges)

**How to Use**:

1. Click any badge card to open the modal
2. Review badge requirements or achievement date
3. Click the X button or outside the modal to close

## Badge Earning Guide

### How to Unlock Badges

1. **Complete Interviews**: Most badges require interview practice
2. **Build Streaks**: Login and practice daily for streak badges
3. **Excel in Dimensions**: Focus on specific skills for dimension badges
4. **Achieve Milestones**: Reach score thresholds for performance badges

### XP System

**How to Earn XP**:

-   Complete an interview: Base XP
-   Unlock a badge: Bonus XP (varies by badge)
-   Achieve high scores: Performance multipliers
-   Maintain streaks: Streak bonus XP

**XP Values by Badge**:

-   Bronze badges: 50-100 XP
-   Silver badges: 100-200 XP
-   Gold badges: 200-500 XP
-   Platinum badges: 500+ XP

### Leveling Up

**Level Calculation**: Based on total XP accumulated

**Approximate Level Thresholds**:

-   Level 1: 0 XP (Starting level)
-   Level 2: 100 XP
-   Level 3: 300 XP
-   Level 4: 600 XP
-   Level 5: 1000 XP
-   Level 10: 5000 XP
-   Level 20: 20000 XP

**Benefits of Higher Levels**:

-   Sense of achievement
-   Progress visualization
-   Unlock special badges (future feature)
-   Leaderboard ranking (future feature)

## Badge Collection Strategies

### For New Users

1. **Start Simple**: Focus on "First Interview" badge
2. **Build Habits**: Work towards "Week Warrior" for daily practice
3. **Improve Gradually**: Target dimension-specific badges one at a time
4. **Celebrate Small Wins**: Each unlocked badge is progress

### For Advanced Users

1. **Complete the Collection**: Aim for 100% badge completion
2. **Optimize Practice**: Focus on locked badges with high XP rewards
3. **Maintain Streaks**: Don't break your daily practice chain
4. **Master All Dimensions**: Unlock all five skill badges

## Visual Indicators

### Badge Card Design

**Unlocked Badge**:

```
┌─────────────────────────┐
│  [Colored Icon]         │ ← Yellow border
│                         │
│  Badge Name             │
│  Badge Description      │
│  +XXX XP                │
└─────────────────────────┘
```

**Locked Badge**:

```
┌─────────────────────────┐
│  [Gray Icon]            │ ← Gray border
│  🔒                     │ ← Lock icon
│  Badge Name             │
│  Badge Description      │
│  +XXX XP                │
└─────────────────────────┘
```

### Progress Indicators

-   **Badge Counter**: "X/Y Unlocked" shows completion progress
-   **XP Bar**: Total XP displayed prominently
-   **Level Badge**: Current level shown with styling

## Best Practices

### For Maximum Motivation

1. **Check Daily**: Visit the Game Page each session for motivation
2. **Set Goals**: Choose a badge to target each week
3. **Track Progress**: Monitor your XP growth regularly
4. **Share Achievements**: Celebrate unlocked badges
5. **Stay Consistent**: Daily practice unlocks more badges

### For Efficient Badge Earning

1. **Prioritize Streaks**: Daily practice yields multiple benefits
2. **Focus on Weaknesses**: Dimension badges improve skills
3. **Quality Over Quantity**: High scores unlock performance badges
4. **Complete Challenges**: Don't leave interviews unfinished
5. **Review Requirements**: Know what each badge needs

## Troubleshooting

### Badges Not Unlocking

**Check If**:

-   You've met all requirements
-   Interview was completed and submitted
-   Page data has refreshed (try reloading)
-   Backend has processed your achievement

**Common Issues**:

-   Streak broken: Must practice daily without gaps
-   Score threshold: Must meet exact score requirements
-   Completion count: Ensure all interviews counted

### Badge Details Not Showing

**Solutions**:

-   Click directly on the badge card (not whitespace)
-   Wait for page to fully load
-   Check browser JavaScript console for errors
-   Try a different browser

### XP Not Updating

**Verify**:

-   Interview was successfully submitted
-   Badge unlock was confirmed
-   Page has been refreshed
-   Backend service is online

## Keyboard Navigation

-   **Tab**: Navigate between badge cards
-   **Enter/Space**: Open badge detail modal
-   **Escape**: Close modal
-   **Arrow Keys**: Navigate badge grid (when focused)

## Mobile Experience

**Optimizations**:

-   Touch-friendly badge cards
-   Responsive grid layout (adjusts to screen size)
-   Swipeable badge gallery
-   Modal adapted for small screens

**Grid Breakpoints**:

-   Mobile (< 640px): 1-2 columns
-   Tablet (640px-1024px): 2-3 columns
-   Desktop (> 1024px): 3-4 columns

## Achievement Tips

### Quick Wins (Easy Badges)

1. **First Interview**: Complete one practice session
2. **Login Streak (3 days)**: Practice Mon-Wed
3. **Score Above 50%**: Achievable for beginners

### Medium Challenges

1. **Week Warrior**: 7-day streak requires commitment
2. **Dimension Mastery**: Score 90%+ in one dimension
3. **10 Interview Completion**: Regular practice needed

### Hard Achievements

1. **Month Master**: 30-day streak is demanding
2. **Century Club**: 100 interviews takes months
3. **Perfect Score**: Requires exceptional performance

## Privacy & Data

**What's Tracked**:

-   Badge unlock status
-   XP points earned
-   Level achieved
-   Unlock timestamps

**What's NOT Tracked**:

-   Other users' progress
-   Comparative rankings (yet)
-   Private practice content

**Data Security**:

-   All data encrypted in transit
-   Stored securely on backend
-   Tied to your user account
-   Not shared publicly

## Future Features

**Planned Enhancements**:

-   Leaderboards (optional participation)
-   Custom badge creation
-   Badge showcase profiles
-   Team challenges
-   Seasonal special badges
-   XP multiplier events
-   Achievement notifications
-   Badge trading (social feature)

## FAQ

**Q: Can I lose badges?**  
A: No, unlocked badges are permanent achievements.

**Q: Do badges expire?**  
A: No, badges remain unlocked forever.

**Q: Can I reset my progress?**  
A: Contact support if needed, but progress reset isn't reversible.

**Q: Are there hidden badges?**  
A: Currently all badges are visible. Secret badges may be added later.

**Q: What's the maximum level?**  
A: There's no level cap - keep earning XP to level up indefinitely.

**Q: Can I earn XP without unlocking badges?**  
A: Yes, completing interviews earns base XP regardless of badges.

**Q: How often do new badges get added?**  
A: Badge collection is periodically expanded with new achievements.

## Support

If you experience issues with the Game Page:

1. Refresh the page
2. Clear browser cache
3. Check your authentication status
4. Review browser console for errors
5. Contact support with specific details
