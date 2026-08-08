# AI Agent Instructions

This document records the general instructions and expectations consistently provided to AI assistants throughout the development of Cinephile.

These instructions were intended to ensure that AI responses aligned with the existing project architecture, coding standards, and development goals rather than generating unrelated or replacement solutions.

---

# Role of AI

AI was used as a software development assistant rather than as an autonomous developer.

Its primary responsibilities included:

- Explaining concepts and technologies.
- Reviewing implementation approaches.
- Assisting with debugging.
- Suggesting improvements.
- Reviewing existing code.
- Helping write documentation.
- Assisting with automated testing.
- Explaining framework behaviour.
- Providing deployment guidance.

Final implementation decisions remained the responsibility of the developer.

---

# General Instructions

The following guidance was consistently provided when requesting assistance.

## Preserve Existing Architecture

Solutions should integrate into the existing Cinephile architecture rather than replacing major sections of the project.

Suggestions should work with the current:

- React frontend
- ASP.NET Core backend
- PostgreSQL database
- Entity Framework Core models
- Existing API structure

---

## Prefer Incremental Changes

Large rewrites were generally avoided.

When possible, AI was instructed to:

- modify only the necessary code
- preserve existing functionality
- minimise unnecessary refactoring
- explain why changes were required

This made reviewing and testing changes significantly easier.

---

## Explain Before Implementing

Whenever possible, AI was asked to explain:

- why a problem occurred
- how the proposed solution worked
- possible alternatives
- trade-offs involved

Understanding the reasoning behind a solution was considered more valuable than simply receiving code.

---

## Follow Project Conventions

Generated code was expected to follow the conventions already established within the project.

Examples included:

### Frontend

- React functional components
- TypeScript
- Tailwind CSS
- Shadcn UI components
- React Router
- Reusable UI components

### Backend

- ASP.NET Core Web API conventions
- Entity Framework Core
- Dependency Injection
- DTO-based request models
- RESTful endpoints

---

## Keep Business Logic Separate

Business logic should remain inside services or controllers where appropriate.

The frontend should primarily:

- display information
- validate basic user input
- communicate with the backend

The backend should remain responsible for:

- authentication
- gamification
- validation
- database operations
- authorisation
- external API communication

---

## Prioritise Security

Whenever authentication or user data was involved, AI was expected to consider security best practices.

Examples included:

- BCrypt password hashing
- JWT authentication
- input validation
- DTO validation
- ownership checks
- avoiding sensitive data exposure
- protecting authenticated endpoints

---

## Consider Performance

Suggestions should avoid unnecessary work where possible.

Typical considerations included:

- avoiding duplicate API calls
- efficient Entity Framework queries
- limiting unnecessary React re-renders
- caching external API responses where appropriate

---

## Include Testing

When implementing new functionality, AI was frequently asked to recommend appropriate testing.

Depending on the feature this included:

- backend unit tests
- frontend unit tests
- Cypress end-to-end tests

Testing was treated as part of feature completion rather than a completely separate activity.

---

# Code Review Expectations

AI-generated suggestions were reviewed before being incorporated into the project.

Typical review steps included:

- verifying correctness
- checking compatibility with existing code
- testing locally
- identifying edge cases
- modifying generated code where required

AI suggestions were rarely copied without modification.

---

# Documentation Expectations

AI was also used to improve project documentation.

Examples included:

- improving wording
- organising documentation
- reviewing explanations
- suggesting README structure
- refining technical descriptions

Documentation was edited to ensure it accurately reflected the final implementation.

---

# AI Tools Used

The project used multiple AI tools for different purposes.

## ChatGPT

Used throughout the project for:

- planning
- architecture discussions
- debugging
- testing guidance
- deployment support
- documentation
- code review

---

## Claude

Used primarily as a secondary reviewer to compare implementation approaches, review design decisions, and provide alternative explanations for selected technical problems.

---

## v0

Used to generate the initial visual design for the authentication screens and application interface.

The generated UI was customised, integrated into the existing React application, and further refined during development.

---

# Guiding Principle

Throughout development, AI was treated as a collaborative engineering assistant rather than a replacement for software development.

Every significant implementation decision, architectural choice, and code integration was reviewed, tested, and adapted before becoming part of the final Cinephile application.