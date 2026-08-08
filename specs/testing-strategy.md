# Testing Strategy

## Purpose

Testing was implemented to improve the reliability and maintainability of Cinephile by verifying functionality across multiple layers of the application.

Rather than relying solely on manual testing, the project combines backend unit tests, frontend unit tests, and end-to-end tests to validate business logic, user interface behaviour, and complete user workflows.

Each testing layer serves a different purpose and together provides confidence that the application behaves as expected.

---

# Testing Philosophy

The testing strategy follows the principle that different types of tests are responsible for validating different parts of the system.

- **Backend unit tests** verify business logic and API behaviour.
- **Frontend unit tests** verify React components, pages, and client-side logic.
- **End-to-end tests** verify complete user workflows through the browser.

Using multiple testing layers reduces the likelihood of regressions while ensuring that changes can be made with greater confidence.

---

# Backend Unit Testing

## Framework

- xUnit
- Moq

Backend unit tests focus on validating server-side functionality independently from the frontend.

Areas covered include:

- Authentication
- User management
- Movie logging
- Watchlists
- Movie search
- Profile endpoints
- Achievements
- Gamification
- Token generation
- TMDB caching

Dependencies such as services are mocked where appropriate using **Moq**, allowing individual classes and controllers to be tested in isolation.

This ensures that business logic can be verified without relying on external services or a running frontend.

---

# Frontend Unit Testing

## Framework

- Vitest
- React Testing Library

Frontend unit tests focus on user interface behaviour and component logic.

Tests cover:

- Authentication page
- Dashboard
- Search page
- Movie details
- Profile
- Rating component
- Community reviews
- Protected routes
- Authentication context
- Utility functions
- Gamification notifications

React Testing Library was selected because it encourages testing components from the user's perspective rather than relying on implementation details.

This results in tests that are more resilient to internal code changes while still verifying the expected behaviour.

---

# End-to-End Testing

## Framework

- Cypress

While unit tests validate individual pieces of functionality, they cannot verify that the entire application works together correctly.

Cypress tests simulate real user interactions by running against the complete application.

The implemented test suite covers workflows including:

- User registration
- User login
- Authentication
- Protected routes
- Searching for movies
- Managing the watchlist
- Logging watched movies
- Updating movie logs
- Deleting movie logs
- Rating movies
- Writing reviews
- Viewing community reviews
- Dashboard
- User profile
- Navigation
- Theme switching
- Responsive layouts
- Logout

These tests validate that the frontend, backend, database, and authentication system integrate correctly.

---

# Continuous Integration

Automated testing is integrated into the project's GitHub Actions workflows.

## Backend CI

The backend workflow automatically:

- Restores NuGet packages
- Builds the solution
- Executes all backend unit tests

This ensures that backend changes do not introduce regressions before being merged.

---

## Frontend CI

The frontend workflow automatically:

- Installs dependencies
- Runs ESLint
- Executes frontend unit tests
- Builds the application

Running these checks on every push and pull request helps maintain code quality throughout development.

---

# Manual Testing

Although automated testing provides broad coverage, manual testing remained an important part of development.

Manual testing was used to verify:

- Visual layout
- Responsive behaviour
- User experience
- Theme switching
- Animations and transitions
- Deployment behaviour
- Cloud configuration

This complemented automated testing by validating areas that are difficult to test programmatically.

---

# Challenges

One of the biggest lessons learned was the importance of introducing automated testing earlier in the project.

Backend, frontend, and Cypress tests were implemented after the majority of features had already been developed.

While this still resulted in comprehensive test coverage, introducing tests alongside feature development would have reduced debugging effort and made regression testing more straightforward.

This experience reinforced the value of test-driven and incremental development practices.

---

# Future Improvements

If the project were to continue, the testing strategy could be expanded further by including:

- Integration tests for backend services
- Performance and load testing
- Accessibility testing
- Visual regression testing
- Code coverage reporting within CI
- Automated deployment verification

These additions would further strengthen the overall quality assurance process.

---

# Summary

The combination of backend unit tests, frontend unit tests, and end-to-end testing provides multiple levels of confidence that Cinephile behaves correctly.

Each testing framework was selected for a specific purpose:

| Testing Type | Framework | Purpose |
|--------------|-----------|---------|
| Backend Unit Tests | xUnit + Moq | Validate API and business logic |
| Frontend Unit Tests | Vitest + React Testing Library | Validate React components and client-side behaviour |
| End-to-End Tests | Cypress | Validate complete user workflows |

Together with continuous integration, this testing strategy helped improve software quality, reduce regressions, and ensure that the application remained stable as new features were introduced.