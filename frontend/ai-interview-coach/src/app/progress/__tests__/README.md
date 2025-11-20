# Progress Page Testing Documentation

## Overview

Tests for the Progress Page component (`src/app/progress/page.tsx`).

## Test Framework

-   **Jest**: Test runner and assertion library
-   **React Testing Library**: Component testing
-   **Testing Library User Event**: User interaction simulation

## Test Coverage

**Location**: `page.test.tsx`

### Test Categories

#### 1. Rendering Logic (7 tests)

-   Loading state display
-   Error state handling
-   Authentication check (no token)
-   Complete page rendering after data load
-   Readiness score statistics display
-   Login streak information display
-   Chart components rendering

#### 2. User Interactions (6 tests)

-   Time range switching (Last 7 vs Last 15 Sessions)
-   Target score input opening
-   Target score saving with API call
-   Target score editing cancellation
-   Button state changes on interaction

#### 3. Component Behaviour (4 tests)

-   Chart data updates on time range change
-   Target score loading from backend
-   API calls with correct authentication token
-   Data validation and error handling

**Total**: 17 tests

## Test Results

| Metric      | Result | Status |
| ----------- | ------ | ------ |
| Total Tests | 17     | -      |
| Passed      | 17     | PASS   |
| Failed      | 0      | PASS   |
| Pass Rate   | 100%   | PASS   |

### Coverage

-   **Lines**: 63.55%
-   **Branches**: 50.9%
-   **Functions**: 48%
-   **Statements**: 63.55%

**Status**: Good coverage - exceeds 50% threshold (PASS)

## Running Tests

### Run Progress Page tests only

```bash
npm test progress/page.test
```

### Run with coverage

```bash
npm test:coverage -- progress/page.test
```

### Watch mode

```bash
npm test:watch progress/page.test
```

## Test Strategy

### What We Test

-   **Next.js Router**: Mocked navigation functions
-   **localStorage**: Mocked authentication token storage
-   **API Services**: `getProgressData` mocked for controlled responses
-   **Recharts**: Mocked to avoid canvas rendering issues
-   **react-calendar**: Mocked to simplify calendar testing

## Mocked Dependencies

-   **Next.js Router**: Mocked navigation functions
-   **localStorage**: Mocked authentication token storage
-   **API Services**: `getProgressData` mocked for controlled responses
-   **Recharts**: Mocked to avoid canvas rendering issues
-   **react-calendar**: Mocked to simplify calendar testing

## Test Strategy

### What We Test

-   Loading, error, and success states
-   Time range switching functionality
-   Target score input and saving
-   API integration with authentication
-   Chart rendering and data updates
-   User interaction flows

### Test Data

Mock data includes:

-   Readiness scores over time
-   Login streak information
-   Calendar activity data
-   Target score settings

## Maintenance

When updating the Progress Page:

1. Run tests: `npm test progress/page.test`
2. Update test expectations if UI text changes
3. Add new tests for new features
4. Ensure coverage remains above 50%
