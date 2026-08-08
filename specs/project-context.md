# Project Context

## Project Overview

Cinephile is a full-stack web application developed as part of the Microsoft Student Accelerator (MSA) Phase 2 assessment.

The application allows users to search for movies, build a personal watchlist, log watched movies, write reviews, rate films, and interact with a gamification system consisting of experience points (XP), achievements, levels, and viewing streaks.

The primary objective of the project is to demonstrate modern full-stack software engineering practices while building an engaging application centred around the assessment theme of **gamification**.

---

# Objectives

The project was designed with the following objectives:

- Build a complete full-stack web application using modern technologies.
- Design a secure RESTful API.
- Implement authentication and user management.
- Integrate an external API (TMDB).
- Store application data using PostgreSQL.
- Apply gamification mechanics to increase user engagement.
- Deploy both frontend and backend to the cloud.
- Implement automated testing across multiple layers.
- Demonstrate the effective use of AI as a software development assistant.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Shadcn UI
- React Router
- Lucide React
- Sonner

---

## Backend

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- JWT Authentication
- BCrypt Password Hashing
- Scalar API Documentation

---

## Database

- PostgreSQL

---

## Testing

### Backend

- xUnit
- Moq

### Frontend

- Vitest
- React Testing Library

### End-to-End

- Cypress

---

## Deployment

- Azure App Service
- Vercel
- GitHub Actions

---

# External Services

The application integrates with **The Movie Database (TMDB)** to provide movie information including:

- Movie search
- Movie details
- Posters
- Genres
- Release information
- Recommendations

Only application-specific information such as user logs, ratings, reviews, watchlists, achievements, and progression is stored in the local database.

---

# Architecture

The project follows a client-server architecture.

```text
React Frontend
        │
 REST API (HTTPS)
        │
ASP.NET Core Web API
        │
Entity Framework Core
        │
PostgreSQL Database
        │
TMDB API
```

The frontend communicates exclusively with the backend through REST endpoints. The backend contains the business logic, authentication, gamification calculations, database access, and integration with TMDB.

---

# Project Constraints

Several constraints influenced the project's design.

- The application was developed within the Microsoft Student Accelerator assessment timeframe.
- Movie information was sourced from TMDB rather than being stored locally.
- Authentication uses JWT rather than external OAuth providers.
- The project was developed by a single developer.
- Advanced requirements were limited to three assessment selections.

---

# Coding Principles

Throughout development the following principles were followed:

- Separation of concerns
- Reusable React components
- RESTful API design
- Clear DTO usage
- Entity Framework migrations for database changes
- Strong typing using TypeScript
- Responsive user interface
- Incremental feature development
- Testable architecture

---

# Advanced Requirements

The project implements the following assessment advanced requirements:

1. Theme Switching
2. End-to-End Testing using Cypress
3. Security Measures
   - BCrypt password hashing
   - Data validation and sanitisation

---

# AI Context

Whenever AI assistance was requested, the following assumptions remained consistent throughout development.

- Existing project architecture should be preserved.
- Solutions should integrate with the current codebase rather than replacing it.
- Code should follow React and ASP.NET Core best practices.
- AI should explain implementation decisions instead of only generating code.
- Suggestions should be incremental and maintainable.
- Security considerations should always be taken into account.
- Generated solutions should be reviewed and tested before adoption.

This consistent context helped ensure that AI-assisted suggestions remained aligned with the overall design and implementation goals of the project.