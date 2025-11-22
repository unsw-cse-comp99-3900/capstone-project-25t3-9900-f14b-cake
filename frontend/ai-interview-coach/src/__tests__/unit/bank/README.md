# Bank Page Testing Documentation

## Overview

Tests for the Bank History Page component (`src/app/bank/history/page.tsx`).



## Rendering (4 tests)

- Page title displays

- Navbar component

- History and Favorites tabs

- Initial loading state

## Record Loading (4 tests)

- Load and display interview records from API

- Fallback to localStorage when API fails

- Empty state display when no records exist

- Sort by timestamp (newest first)

## Record Display (4 tests)

- Correct display of question type

- Formatted date and time

- Formatted duration (MM:SS)

- Total score display and styling (green / yellow / red)

## Pagination (5 tests)

- Show pagination when records exceed page size

- Navigate to next page

- Navigate to previous page

- "Previous" button disabled on first page

- "Next" button disabled on last page

## Favorites (3 tests)

- Toggle favorite state by clicking the star

- Update record list after toggling favorite

- Fallback to localStorage when API fails

## View Details (2 tests)

- Navigate to feedback page when clicking “View Details”

- Correctly store record data in sessionStorage

## Error Handling (2 tests)

- Graceful handling of API errors

- Handle localStorage parsing errors
