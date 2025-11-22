# Login Page Testing Documentation

## Overview

Tests for the Login Page component (`src/app/login/page.tsx`).



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
