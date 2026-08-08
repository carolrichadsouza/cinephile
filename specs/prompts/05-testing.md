# Testing

This document contains representative prompts from the testing phase of Cinephile.

Unlike the core application features, automated testing was introduced after the majority of functionality had been completed. AI was primarily used to discuss testing strategy, explain testing frameworks, review test quality, and assist in writing meaningful automated tests.

The resulting test suite includes backend unit tests, frontend unit tests, end-to-end testing, and automated CI workflows.

---

## Prompt 1 : Planning a Testing Strategy

### Prompt

> My application is almost feature complete. What's the best way to approach testing so I have good coverage without writing unnecessary tests?

### Why I asked

At this stage most of the application's functionality had already been implemented. I wanted to understand which areas would provide the greatest value if tested.

### Summary of AI Response

The discussion focused on separating testing into multiple layers:

- Backend unit tests
- Frontend unit tests
- End-to-end tests

Each layer would validate different aspects of the application rather than duplicating the same tests.

---

## Prompt 2 : Backend Unit Testing

### Prompt

> I've never written backend tests using xUnit before. Can you explain how I should structure tests for my controllers and services?

### Why I asked

Although I understood the application logic, I wanted to learn the recommended structure for ASP.NET Core unit tests.

### Summary of AI Response

The explanation covered:

- xUnit test structure
- Arrange–Act–Assert pattern
- Mocking dependencies using Moq
- Using an in-memory database
- Testing controllers independently

This became the foundation of the backend test suite.

---

## Prompt 3 : Verifying Test Quality

### Prompt

> All of my backend tests are passing. How can I check that they're actually testing something meaningful and not just passing by accident?

### Why I asked

I wanted confidence that the tests were genuinely validating application behaviour rather than always succeeding.

### Summary of AI Response

The recommendation was to intentionally introduce small changes that should cause specific tests to fail.

Examples included:

- Changing expected values
- Modifying authentication logic
- Altering password hashing

When these intentional changes caused tests to fail, it confirmed that the tests were correctly validating the implementation.

---

## Prompt 4 : Frontend Unit Testing

### Prompt

> Which parts of my React application are worth testing with Vitest and React Testing Library?

### Why I asked

Rather than testing every component indiscriminately, I wanted to focus on functionality that provided the greatest value.

### Summary of AI Response

Priority was given to:

- Authentication
- Protected routes
- User interactions
- Rating components
- Utility functions
- Page behaviour

Tests focused on observable behaviour rather than implementation details.

---

## Prompt 5 : Cypress End-to-End Testing

### Prompt

> I already have backend and frontend unit tests. Which user workflows should I automate using Cypress?

### Why I asked

End-to-end tests should validate complete user journeys rather than individual components.

### Summary of AI Response

Recommended workflows included:

- Registration
- Login
- Authentication
- Searching for movies
- Watchlists
- Ratings
- Reviews
- Movie logs
- User profile
- Logout

These workflows became the basis of the Cypress test suite.

---

## Prompt 6 : Continuous Integration

### Prompt

> I've finished writing my tests. How should I configure GitHub Actions so they automatically run whenever I push changes?

### Why I asked

I wanted automated validation without needing to run every test manually before each commit.

### Summary of AI Response

Separate workflows were recommended for:

Frontend:

- Install dependencies
- ESLint
- Unit tests
- Build

Backend:

- Restore packages
- Build
- Execute unit tests

This approach kept frontend and backend validation independent while maintaining fast feedback during development.

---

## Prompt 7 : Reflection

### Prompt

> Looking back, when would have been the best time to introduce automated testing during the project?

### Why I asked

After completing the testing suite, I reflected on how the development process could be improved.

### Summary of AI Response

The discussion concluded that introducing automated tests alongside feature development would have reduced debugging effort and made regression testing easier.

This became one of the key lessons learned from the project and influenced the final project reflection.
