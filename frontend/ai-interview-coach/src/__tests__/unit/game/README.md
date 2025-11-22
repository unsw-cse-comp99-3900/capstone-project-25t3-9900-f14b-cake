# Game Page Testing Documentation

## Overview

Tests for the Game Page component (`src/app/game/page.tsx`).

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
-   Badge list display
-   Unlocked vs locked badge differentiation
-   Badge statistics display
-   Daily quote display

#### 2. User Interactions (4 tests)

-   Badge click to open details modal
-   Modal close button functionality
-   Badge status display in modal (unlocked/locked)
-   Modal interaction flow

#### 3. Component Behaviour (6 tests)

-   API calls with correct authentication token
-   Unlocked badge count calculation
-   Empty badge data handling
-   Unlocked badge styling (yellow border, colored icons)
-   Locked badge styling (gray border, grayscale icons)

**Total**: 17 tests

## Test Results

| Metric      | Result | Status |
| ----------- | ------ | ------ |
| Total Tests | 17     | -      |
| Passed      | 17     | PASS   |
| Failed      | 0      | PASS   |
| Pass Rate   | 100%   | PASS   |

### Coverage

-   **Lines**: 91.3%
-   **Branches**: 83.78%
-   **Functions**: 70%
-   **Statements**: 91.3%

**Status**: Excellent coverage (PASS)

## Running Tests

### Run Game Page tests only

```bash
npm test game/page.test
```

### Run with coverage

```bash
npm test:coverage -- game/page.test
```

### Watch mode

```bash
npm test:watch game/page.test
```

## Test Highlights

### All Tests Passing

All 17 tests pass successfully, demonstrating:

-   Robust component rendering
-   Proper state management
-   Correct user interaction handling
-   Accurate API integration

### High Coverage

Achieves 91.3% line coverage, exceeding the 50% threshold significantly.

## Mocked Dependencies

-   **Next.js Router**: Mocked navigation functions
-   **localStorage**: Mocked authentication token storage
-   **API Services**: `getGamePageData` mocked for controlled responses

## Test Strategy

### What We Test

-   Loading, error, and success states
-   Badge unlocking logic
-   Modal open/close interactions
-   Badge styling (unlocked vs locked)
-   API integration with authentication
-   Empty state handling
-   Badge statistics calculation

### Test Data

Mock data includes:

-   Badge collection with mixed unlocked/locked states
-   Badge details (title, description, icon, XP)
-   Daily motivational quotes
-   User statistics (current level, total XP, unlocked badges)

## Badge State Testing

### Unlocked Badge Rendering

Tests verify:

-   Yellow border (`border-yellow-400`)
-   Colored icons (full opacity)
-   "Unlocked" label in modal
-   Correct unlock date display

### Locked Badge Rendering

Tests verify:

-   Gray border (`border-gray-600`)
-   Grayscale icons (`grayscale`)
-   "Locked" label in modal
-   Lock icon display

## Maintenance

When updating the Game Page:

1. Run tests: `npm test game/page.test`
2. Add new tests for new badges or features
3. Maintain 90%+ coverage standard
4. Ensure all tests continue passing
