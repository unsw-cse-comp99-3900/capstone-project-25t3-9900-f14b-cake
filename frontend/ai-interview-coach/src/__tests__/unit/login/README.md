# Login Page Testing Documentation

## Overview

Tests for the Login Page component (`src/app/login/page.tsx`).

## Test Methods

- `render` - Render React components for testing
- `screen` - Query elements from the rendered component
- `waitFor` - Wait for asynchronous operations to complete
- `fireEvent` - Simulate DOM events (click, etc.)
- `userEvent` - Simulate user interactions (type, etc.)
- `jest.mock` - Mock modules and dependencies
- `jest.fn` - Create mock functions
- `jest.clearAllMocks` - Clear all mocks between tests
- `global.fetch` - Mock fetch API calls

## Rendering (3 tests)

- Page title and description are displayed

- Google login option is shown by default

- Clicking “Use other email” displays the email input field

## Email Login Functionality (6 tests)

- Invalid email format validation

- Empty email validation (button disabled)

- API call and data storage on successful login

- Error message displayed on login failure

- Pressing Enter triggers login

- Loading state during login process

## Google Login Functionality (1 test)

- Error handling when Google Client ID is missing

## Error Handling (2 tests)

- Display error message on network errors

- Clear error message when switching login methods
