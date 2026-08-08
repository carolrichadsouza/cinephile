# Backend Development

This document contains representative prompts from the backend development phase of Cinephile.

During this stage, AI was primarily used to explain unfamiliar ASP.NET Core concepts, review implementation approaches, troubleshoot issues, and validate backend design decisions.

The backend implementation itself was completed by the developer, with AI acting as a technical assistant throughout the process.

---

## Prompt 1 : Learning ASP.NET Core

### Prompt

> I'm familiar with React but new to ASP.NET Core. Can you explain how a typical ASP.NET Core Web API project is structured and how controllers, services, and Entity Framework work together?

### Why I asked

This project was my first substantial ASP.NET Core application. Before implementing features, I wanted to understand how the framework was typically organised.

### Summary of AI Response

The response explained:

- Controllers
- Dependency Injection
- Services
- DbContext
- Entity Framework Core
- DTOs
- Middleware

This helped me understand the overall backend architecture before beginning implementation.

---

## Prompt 2 : Designing the API

### Prompt

> I've started creating my API endpoints. Can you review the structure and suggest whether my controllers and routes follow RESTful conventions?

### Why I asked

I wanted the API to be consistent and easy for the React frontend to consume.

### Summary of AI Response

Suggestions included:

- keeping controllers focused on one responsibility
- using HTTP verbs consistently
- separating request DTOs from database models
- returning appropriate HTTP status codes

These recommendations were incorporated as development continued.

---

## Prompt 3 : JWT Authentication

### Prompt

> I'm implementing JWT authentication. Can you explain the overall login flow and how authentication should work between a React frontend and an ASP.NET Core backend?

### Why I asked

Authentication was one of the first major backend features and needed to be implemented securely.

### Summary of AI Response

The discussion covered:

- login flow
- token generation
- authentication middleware
- Authorize attributes
- bearer tokens
- protected endpoints

This provided a better understanding of how authentication worked before implementation.

---

## Prompt 4 : Entity Framework Core

### Prompt

> I'm using Entity Framework Core for the first time. Can you explain how migrations work and when I should create new migrations?

### Why I asked

As the database model evolved during development, I wanted to understand the correct migration workflow.

### Summary of AI Response

The explanation covered:

- creating migrations
- updating the database
- tracking schema changes
- when to generate additional migrations

This became the standard workflow used throughout development.

---

## Prompt 5 : Integrating TMDB

### Prompt

> I don't want to store movie information permanently because TMDB already provides it. What's the best way to combine TMDB data with my own database?

### Why I asked

This was one of the biggest architectural decisions in the project.

### Summary of AI Response

The recommendation was to:

- retrieve movie metadata from TMDB
- store only TMDB IDs locally
- keep user-generated information in PostgreSQL
- avoid duplicating external movie data

This approach became the final architecture for movie data.

---

## Prompt 6 : Caching TMDB Responses

### Prompt

> My application frequently requests movie information from TMDB. Should I cache responses, and if so, where should that logic live?

### Why I asked

I wanted to improve performance without complicating the API design.

### Summary of AI Response

The discussion focused on introducing a dedicated movie cache service rather than embedding caching inside controllers.

This separation kept controllers simpler while reducing repeated requests to TMDB.

---

## Prompt 7 : Gamification Service

### Prompt

> I'm adding XP, achievements, levels, and viewing streaks. Should this logic stay inside my controllers or be moved into a separate service?

### Why I asked

As more gamification features were added, I wanted to avoid duplicating business logic across multiple endpoints.

### Summary of AI Response

A dedicated `GamificationService` was recommended.

This service became responsible for:

- awarding XP
- unlocking achievements
- calculating levels
- updating viewing streaks

Controllers simply notified the service when a relevant action occurred.

---

## Prompt 8 : Backend Debugging

### Prompt

> My endpoint isn't returning the expected data. Can you help me debug whether the problem is coming from Entity Framework, my controller, or the React frontend?

### Why I asked

Throughout development, some issues required identifying whether the problem originated in the backend or frontend.

### Summary of AI Response

Rather than immediately suggesting code changes, AI helped narrow the source of the issue by checking:

- database queries
- DTO mapping
- controller responses
- API requests
- frontend network calls

This debugging approach made it easier to isolate and fix issues.

---

## Prompt 9 : Reviewing Backend Code

### Prompt

> Can you review this controller and suggest improvements without changing how it currently works?

### Why I asked

I wanted feedback on code quality while preserving the existing implementation.

### Summary of AI Response

Suggestions typically focused on:

- readability
- reducing duplication
- clearer naming
- simplifying LINQ queries
- improving error handling

Useful suggestions were incorporated where appropriate.

