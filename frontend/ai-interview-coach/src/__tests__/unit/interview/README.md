# Interview Page Testing Documentation

## Overview

Tests for the Interview Setup Page component (`src/app/interview/page.tsx`).

## Test Methods

- `render` - Render React components for testing
- `screen` - Query elements from the rendered component
- `waitFor` - Wait for asynchronous operations to complete
- `fireEvent` - Simulate DOM events (click, change, mouseDown, etc.)
- `userEvent` - Simulate user interactions (type, etc.)
- `jest.mock` - Mock modules and dependencies
- `jest.fn` - Create mock functions
- `jest.clearAllMocks` - Clear all mocks between tests

## Rendering (5 tests)

- Page title and description

- Question type selector

- Job description textarea (required)

- Start Interview button

- Navbar component

## Form Validation (4 tests)

- Button disabled when question type is not selected

- Button disabled when job description is empty

- Button disabled when job description contains only whitespace

- Button enabled when both fields are filled

## Question Type Selection (3 tests)

- Select Behavioural (behavioral interview)

- Select Technical (technical interview)

- Select Psychometric (psychometric test)

## Job Description Input (2 tests)

- Update content when user types

- Support multiline input

## Modal Interactions (6 tests)

- Open modal when clicking “Start Interview”

- Modal displays options for audio recording and text input

- Close button works

- Navigation and parameters when selecting audio mode

- Navigation and parameters when selecting text mode

- Automatically trim job description when navigating

## Navigation (1 test)

- Correct query parameters passed for different question types
