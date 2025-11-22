# Interview Flow Integration Testing Documentation

## Overview

Integration tests for the complete interview flow across multiple pages.

## Test Methods

- `render` - Render React components for testing
- `screen` - Query elements from the rendered component
- `waitFor` - Wait for asynchronous operations to complete
- `fireEvent` - Simulate DOM events (click, change, mouseDown, etc.)
- `userEvent` - Simulate user interactions (type, etc.)
- `rerender` - Re-render components with new props
- `jest.mock` - Mock modules and dependencies
- `jest.fn` - Create mock functions
- `jest.clearAllMocks` - Clear all mocks between tests
- `global.fetch` - Mock fetch API calls
- `mockSessionStorage` - Mock sessionStorage for data persistence
- `Storage.prototype.getItem/setItem` - Mock localStorage operations

## Complete Interview Flow (6 tests)

- Full flow: login -> setup -> answer -> feedback -> history

- Complete flow with favorite toggle

- Flow with pagination when multiple records exist

- Error scenarios in the flow

- Empty state when no interviews exist

- Data consistency across pages

## Cross-page Navigation Flow (1 test)

- Navigate correctly between interview setup and answering
