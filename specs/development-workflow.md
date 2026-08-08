# Development Workflow

## Overview

Cinephile was developed using an iterative approach, with features being implemented incrementally rather than attempting to build the entire application at once.

The project began with planning and design documented in the GitHub Wiki, followed by backend development, frontend implementation, gamification, testing, deployment, and final documentation.

Artificial intelligence was used throughout each stage as a development assistant to discuss ideas, review implementations, explain unfamiliar concepts, and assist with debugging. All implementation decisions, code integration, and testing remained the responsibility of the developer.

---

# Phase 1 – Planning

The first stage of the project focused on understanding the assessment requirements and defining the application's scope.

Planning activities included:

- Identifying the business problem
- Competitor analysis
- Defining functional requirements
- Defining non-functional requirements
- Creating user personas
- Writing user stories
- Establishing the project scope
- Designing the Entity Relationship Diagram (ERD)
- Creating low-fidelity wireframes
- Planning the overall user experience

These planning artefacts are documented in the project Wiki.

---

# Phase 2 – Backend Development

Backend development began before the frontend implementation to establish the application's data model and API.

Major milestones included:

- Configuring ASP.NET Core Web API
- Setting up PostgreSQL
- Configuring Entity Framework Core
- Creating the initial database schema
- Implementing authentication
- Generating JWT tokens
- Implementing movie logging
- Implementing watchlists
- Creating profile endpoints
- Integrating TMDB
- Building the gamification service

During this stage, AI was frequently used to explain ASP.NET Core concepts, Entity Framework Core behaviour, and debugging techniques while learning unfamiliar technologies.

---

# Phase 3 – Frontend Development

Once the API was functional, frontend development began.

The interface was initially designed using v0 before being customised and integrated into the React application.

Implementation included:

- Authentication pages
- Dashboard
- Movie search
- Movie details
- Watchlist
- User profile
- Community reviews
- Responsive layouts
- Navigation
- Theme switching

The frontend was developed incrementally as backend endpoints became available.

---

# Phase 4 – Gamification

Gamification was one of the defining features of the application.

Rather than treating it as a standalone feature, it was integrated into existing user actions.

Examples include:

- Watching movies
- Writing reviews
- Rating movies
- Adding movies to a watchlist

Each activity contributes towards user progression.

The gamification system evolved over several iterations before the final implementation included:

- Experience points (XP)
- Levels
- Achievements
- Viewing streaks
- Achievement notifications
- Level-up notifications

Balancing rewards while keeping the implementation maintainable required several refinements throughout development.

---

# Phase 5 – Testing

Testing was introduced after the majority of application features had been completed.

Three levels of testing were implemented.

## Backend

xUnit and Moq were used to verify:

- Controllers
- Services
- Authentication
- Gamification
- Watchlists
- Movie logs

## Frontend

Vitest and React Testing Library were used to validate:

- Components
- Pages
- Authentication
- User interactions
- Helper functions

## End-to-End

Cypress was used to test complete user workflows including:

- Registration
- Login
- Search
- Watchlists
- Logging movies
- Ratings
- Reviews
- Profiles
- Navigation

Although testing was implemented later in development, it significantly increased confidence before deployment.

---

# Phase 6 – Deployment

Once the application was feature complete and tested, deployment began.

Deployment involved:

- Azure App Service
- Vercel
- Production PostgreSQL
- Environment variables
- CORS configuration
- Scalar API documentation

Deployment introduced several production-specific issues that differed from local development, particularly around configuration and environment variables.

Resolving these issues provided valuable experience working with cloud-hosted applications.

---

# Phase 7 – Finalisation

The final stage focused on preparing the application for submission.

Activities included:

- Completing automated tests
- Configuring GitHub Actions
- Final UI improvements
- Writing documentation
- Reviewing security
- Updating the README
- Preparing the submission video

This stage emphasised software quality, maintainability, and presentation rather than introducing additional features.

---

# Development Approach

Rather than attempting to complete the application in a single pass, Cinephile was developed through continuous iteration.

The general workflow followed throughout development was:

1. Plan the feature.
2. Research implementation options.
3. Discuss approaches using AI.
4. Implement the feature.
5. Test locally.
6. Refactor where necessary.
7. Add automated tests.
8. Deploy.
9. Review and document.

This iterative process allowed the project to evolve while maintaining a consistent architecture and reducing the risk of introducing major regressions.

---

# Key Lessons

Several important lessons emerged throughout development.

- Early planning made implementation significantly easier.
- Understanding unfamiliar frameworks before implementing features reduced debugging time.
- Incremental development simplified testing and refactoring.
- Automated testing greatly improved confidence when making changes.
- Deploying earlier would have exposed configuration issues sooner.
- AI was most valuable when used to explain concepts, review existing work, and assist with debugging rather than generating complete solutions.

Overall, the project provided practical experience across the complete software development lifecycle, from planning through deployment and documentation.