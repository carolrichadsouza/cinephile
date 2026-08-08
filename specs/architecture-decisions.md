# Architecture Decisions

## Purpose

This document records the major architectural decisions made during the development of Cinephile and explains the reasoning behind those choices.

The goal was to build a maintainable, scalable, and secure full-stack application while remaining appropriate for the Microsoft Student Accelerator Phase 2 assessment.

---

# Overall Architecture

Cinephile follows a traditional client-server architecture consisting of three primary layers:

```text
React Frontend
        │
 REST API
        │
ASP.NET Core Web API
        │
Entity Framework Core
        │
PostgreSQL Database
        │
TMDB API
```

Separating the frontend and backend allowed each layer to focus on a specific responsibility.

The frontend is responsible for presenting data and handling user interactions, while the backend manages authentication, business logic, database operations, gamification, and communication with external services.

---

# Frontend

## Why React?

React was selected because it provides a component-based architecture that encourages reusable UI components and predictable application structure.

React also integrates well with TypeScript and modern tooling such as Vite and React Router.

Using React made it easier to divide the application into reusable components such as:

- Navigation
- Movie cards
- Rating component
- Review components
- Dashboard widgets
- Profile statistics

---

## Why TypeScript?

TypeScript provides compile-time type checking, reducing runtime errors and making the codebase easier to maintain.

Strong typing was particularly valuable because the frontend communicates extensively with the backend using DTOs.

Using shared interfaces helped ensure API responses were handled consistently throughout the application.

---

## Why Vite?

Vite provides a fast development experience with instant hot module replacement and a simplified build process.

This significantly reduced development time compared to older tooling.

---

## Why Tailwind CSS?

Tailwind CSS was chosen because it allows consistent styling directly within components while avoiding large custom stylesheet files.

Its utility-first approach made it straightforward to create responsive layouts and maintain consistent spacing, colours, and typography throughout the application.

---

## Why Shadcn UI?

Shadcn UI provides accessible, reusable components without forcing a predefined design system.

It allowed the application to maintain a consistent appearance while remaining highly customisable.

---

# Backend

## Why ASP.NET Core Web API?

ASP.NET Core Web API was selected because it provides a robust framework for building RESTful APIs.

Key advantages included:

- Dependency Injection
- Built-in authentication support
- Model validation
- Middleware pipeline
- Strong Entity Framework integration

Although ASP.NET Core was initially unfamiliar, it provided an excellent opportunity to learn enterprise backend development practices.

---

## Why Entity Framework Core?

Entity Framework Core simplified database access by allowing database tables to be represented as strongly typed models.

Benefits included:

- LINQ queries
- Migrations
- Change tracking
- Relationship management
- Strong integration with ASP.NET Core

Using EF Core significantly reduced the amount of manual SQL required during development.

---

## Why PostgreSQL?

PostgreSQL was selected because it is an open-source relational database with excellent support for Entity Framework Core.

It provides reliable relational data modelling while remaining well suited for cloud deployment.

Only application-specific information is stored locally, including:

- Users
- Movie logs
- Reviews
- Ratings
- Watchlists
- Achievements
- Levels

Movie metadata remains external through TMDB.

---

# External API Integration

## Why TMDB?

Rather than maintaining a local catalogue of movie information, Cinephile integrates directly with The Movie Database (TMDB).

This approach provides:

- Up-to-date movie information
- High-quality posters
- Genres
- Release dates
- Search functionality

without requiring the application to manage a large movie dataset.

Only user-generated content is stored locally.

---

# Authentication

JWT authentication was selected instead of session-based authentication.

Benefits include:

- Stateless authentication
- Better compatibility with SPAs
- Simpler deployment
- Secure API access
- Standard bearer token workflow

JWTs are stored on the client after login and included in authenticated API requests.

---

# Gamification

Rather than embedding gamification logic directly inside controllers, a dedicated `GamificationService` was created.

This separation provides several benefits:

- reusable logic
- easier testing
- simplified controllers
- easier future expansion

Controllers simply notify the service when a relevant user action occurs.

The service determines:

- XP awarded
- achievement unlocks
- level progression
- streak updates

This keeps business logic isolated from API endpoints.

---

# Database Design Decisions

Movie information is intentionally **not** stored permanently.

Instead:

TMDB provides movie metadata.

The database stores only:

- TMDB movie ID
- user rating
- review
- watch date
- watchlist status

This avoids data duplication while ensuring user-generated information remains persistent.

---

# Deployment Architecture

The application is deployed across multiple services.

Frontend:

- Vercel

Backend:

- Azure App Service

Database:

- PostgreSQL

Separating these services provides flexibility while reflecting a typical production deployment.

---

# Key Design Principles

Several principles guided architectural decisions throughout development.

## Separation of Concerns

Frontend, backend, database, and external integrations each have clearly defined responsibilities.

---

## Reusability

React components, backend services, and DTOs were designed for reuse wherever possible.

---

## Maintainability

Business logic is isolated from presentation logic.

Database operations are isolated from controllers.

Shared functionality is encapsulated inside services.

---

## Scalability

Although developed for an assessment, the architecture supports future expansion through:

- additional achievements
- new gamification mechanics
- more API endpoints
- additional frontend features

without requiring major structural changes.
