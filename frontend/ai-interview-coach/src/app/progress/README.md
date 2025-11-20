# Progress Page - User Guide

## Overview

The Progress Page provides comprehensive analytics and tracking for your interview practice performance. It visualizes your improvement over time, tracks your login consistency, and analyzes your strengths and weaknesses across different evaluation dimensions.

## Features

### 1. Interview Performance Progression

**Purpose**: Track your readiness score improvement across interview sessions

**Key Components**:

-   Line chart showing score trends over time
-   Toggle between "Last 7 Sessions" and "Last 15 Sessions" views
-   Statistics cards showing:
    -   Last session score
    -   Average score
    -   Highest score
    -   Total interviews completed

**How to Use**:

1. View the default "Last 7 Sessions" chart upon page load
2. Click "Last 15 Sessions" button to see longer-term trends
3. Hover over chart points to see exact scores for each session
4. Monitor your progress and identify improvement patterns

### 2. Login Activity Tracking

**Purpose**: Monitor your practice consistency and build a learning streak

**Key Components**:

-   Interactive calendar showing login days
-   Current streak counter
-   Maximum streak record
-   Total active days counter

**Calendar Legend**:

-   Highlighted dates: Days with interview practice
-   Regular dates: Days without practice
-   Navigate months using arrow buttons

**How to Use**:

1. Check your current streak to maintain motivation
2. View the calendar to identify practice gaps
3. Aim to beat your maximum streak record
4. Build consistent daily practice habits

### 3. Performance Dimensions Analysis

**Purpose**: Identify your strengths and areas for improvement

**Dimensions Tracked**:

1. **Clarity & Structure**: How well-organized your answers are
2. **Relevance to Question/Job**: Answer appropriateness
3. **Keyword & Skill Alignment**: Technical term usage
4. **Confidence & Delivery**: Communication effectiveness
5. **Conciseness**: Answer brevity and precision

**Visualization Types**:

-   **Radar Chart**: Overall performance across all dimensions
-   **Bar Charts**: Individual dimension performance with percentages

**Target Score Setting**:

1. Click "Set Target (X/5)" button in the radar chart section
2. Use + and - buttons to adjust your target score (0-5 scale)
3. Click "Save" to store your target
4. Click "Cancel" to discard changes
5. The radar chart will display your target as a reference line

**How to Use**:

1. Review the radar chart for a holistic view of your skills
2. Identify dimensions below your target score
3. Focus practice on weaker dimensions
4. Track improvement over time
5. Adjust your target as you improve

### 4. Recent Interview Questions

**Purpose**: Review questions from your latest practice sessions

**Information Displayed**:

-   Question text
-   Interview date
-   Your readiness score
-   Category/dimension evaluated

**How to Use**:

1. Review questions you've recently practiced
2. Identify patterns in question types
3. Revisit questions where scores were lower
4. Track which categories need more practice

## Technical Details

### Data Loading

**Authentication Required**: You must be logged in to view this page

**Error States**:

-   "Please login first": No authentication token found
-   "Failed to load data": API connection issue or server error
-   "Loading progress data...": Data is being fetched

### Time Range Logic

-   **Last 7 Sessions**: Shows your 7 most recent interview sessions
-   **Last 15 Sessions**: Shows your 15 most recent interview sessions
-   Sessions are sorted by date, most recent last
-   If you have fewer sessions than selected range, all available sessions are shown

### Target Score Persistence

-   Target scores are saved to the backend
-   Same target applies to all five dimensions
-   Target persists across sessions
-   Default target is 0 if not set

### Performance Calculation

**Readiness Score**: 0-100 scale

-   Calculated from individual dimension scores
-   Higher is better
-   Tracked per session

**Dimension Scores**: 1-5 scale

-   1: Needs significant improvement
-   2: Below average
-   3: Average/acceptable
-   4: Good performance
-   5: Excellent performance

**Percentage Conversion**: Score × 20 = Percentage

-   Example: Score 4.2 = 84%

## Best Practices

### For Effective Progress Tracking

1. **Regular Practice**: Aim for daily sessions to maintain streaks
2. **Review Trends**: Check your line chart weekly to identify patterns
3. **Set Realistic Targets**: Start with achievable goals, increase gradually
4. **Focus on Weaknesses**: Prioritize dimensions with lower scores
5. **Celebrate Progress**: Acknowledge improvements in your statistics

### For Skill Development

1. **Balanced Improvement**: Don't neglect any dimension
2. **Track Consistency**: Monitor if your scores are stable or fluctuating
3. **Learn from Mistakes**: Review questions where you scored poorly
4. **Build Streaks**: Consistent practice beats irregular intensive sessions

## Troubleshooting

### Page Not Loading

-   Check your internet connection
-   Verify you're logged in (check for auth token)
-   Refresh the page
-   Clear browser cache

### Data Not Updating

-   Complete at least one interview session
-   Ensure the interview was submitted successfully
-   Refresh the page to fetch latest data
-   Check backend service status

### Charts Not Displaying

-   Ensure JavaScript is enabled
-   Try a different browser
-   Check browser console for errors
-   Verify you have interview data

### Target Score Not Saving

-   Check network connectivity
-   Verify authentication status
-   Ensure target is between 0-5
-   Check backend API availability

## Keyboard Shortcuts

-   **Tab**: Navigate between interactive elements
-   **Enter/Space**: Activate buttons and controls
-   **Arrow Keys**: Navigate calendar months (when calendar is focused)
-   **+/-**: Adjust target score (when target input is open)

## Mobile Responsiveness

The page adapts to different screen sizes:

-   **Desktop**: Full layout with side-by-side charts
-   **Tablet**: Stacked charts with full width
-   **Mobile**: Single column layout, touch-optimized controls

## Data Privacy

-   All progress data is tied to your user account
-   Data is stored securely on the backend
-   Login streaks and statistics are personal
-   No data is shared with other users

## Future Enhancements

Planned features:

-   Export progress reports as PDF
-   Compare performance with anonymized averages
-   Custom date range selection
-   Downloadable practice history
-   Performance milestones and achievements
