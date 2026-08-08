# Planning Phase

This document contains representative prompts from the planning phase of Cinephile. During this stage, AI was primarily used to validate ideas, review planning artefacts, and discuss implementation approaches before development began.

The overall concept for Cinephile, including using a movie tracking application centred around gamification, originated from the developer. AI was used to refine and evaluate these ideas rather than generate the project concept.

---

## Prompt 1 : Exploring Project Ideas

### Prompt

> I need to build a full-stack application for the Microsoft Student Accelerator Phase 2 assessment. The project must relate to the theme of gamification. Can you suggest some project ideas?

### Why I asked

Before deciding on a final project, I wanted to explore different applications that could naturally incorporate gamification and satisfy the assessment requirements.

### Summary of AI Response

Several ideas were suggested, including:

- Habit tracker
- Fitness tracker
- Reading tracker
- Budgeting application
- Language learning application

After considering these ideas, I proposed building a **movie tracking application** with gamification elements instead, as it aligned more closely with my interests.

---

## Prompt 2 : Validating the Project Idea

### Prompt

> I was thinking of building a movie tracking application where users earn points and level up based on the movies they watch. Do you think this would fit the assessment theme, and are there other gamification mechanics I could add?

### Why I asked

Although I already had the core project idea, I wanted to confirm that it related strongly to the assessment theme and identify additional mechanics that would make the gamification system more engaging.

### Summary of AI Response

The project idea was considered a strong fit for the gamification theme.

Additional mechanics discussed included:

- Experience Points (XP)
- Achievement badges
- User levels
- Viewing streaks
- Rewards for ratings and reviews
- Progression through regular activity

These discussions influenced the final gamification system implemented in Cinephile.

---

## Prompt 3 : Reviewing the Planned Features

### Prompt

> These are the features I want to include in Cinephile. Do they make sense together, and are they achievable within the project timeframe?

### Why I asked

Before beginning development, I wanted feedback on whether the planned functionality was realistic and appropriately scoped.

### Summary of AI Response

The proposed feature set was considered achievable while covering the core requirements of a full-stack application.

Suggestions included prioritising:

- Authentication
- Movie search
- Watchlists
- Ratings
- Reviews
- User profiles

More advanced features could be deferred if required.

---

## Prompt 4 : Reviewing the Wireframes

### Prompt

> I've created my wireframes for the application. Do the layouts make sense from a user experience perspective, and are there any screens or flows I should reconsider?

### Why I asked

I wanted feedback on the usability of the application before starting frontend development.

### Summary of AI Response

The wireframes provided a logical user flow.

Suggestions focused on improving navigation, reducing unnecessary steps between pages, and ensuring consistent actions across the application.

The overall structure remained unchanged and became the basis for the implemented interface.

---

## Prompt 5 : Reviewing the ERD

### Prompt

> I've designed my Entity Relationship Diagram for Cinephile. Can you review it and let me know if there are any relationships, entities, or constraints that should be changed before I begin implementing the database?

### Why I asked

Before creating the database and Entity Framework models, I wanted to validate the design and identify any potential issues early.

### Summary of AI Response

The ERD was reviewed for completeness and consistency.

Discussion focused on:

- entity relationships
- foreign keys
- normalisation
- user ownership of records
- modelling achievements and levels
- separating TMDB movie data from user-generated data

Minor refinements were made before implementation, but the overall database structure remained the same.

---

## Prompt 6 : Choosing the Technology Stack

### Prompt

> I have experience with React but very little experience with ASP.NET Core. Is React with an ASP.NET Core Web API and PostgreSQL a suitable technology stack for this project?

### Why I asked

Although React was already familiar, ASP.NET Core and Entity Framework Core were new technologies.

### Summary of AI Response

The stack was considered suitable because it demonstrated both frontend and backend development while aligning well with the assessment requirements.

It was recommended that business logic remain in the backend and that React communicate exclusively through REST API endpoints.

---

## Prompt 7 : Database Design

### Prompt

> How should I design the database for a movie tracking application when the movie information already exists in TMDB?

### Why I asked

I wanted to avoid storing unnecessary movie metadata while still supporting user-specific features.

### Summary of AI Response

Rather than duplicating TMDB data, only application-specific information should be stored locally.

Examples included:

- TMDB movie ID
- ratings
- reviews
- watch dates
- watchlist entries
- user progression

Movie titles, posters, genres, and descriptions would continue to be retrieved from TMDB.

---

## Prompt 8 : Planning Gamification

### Prompt

> What would be a good way to incorporate gamification into a movie tracking application without making it feel forced?

### Why I asked

Gamification was the project's central theme, so it needed to feel like a natural extension of the application.

### Summary of AI Response

The suggestion was to reward actions users would already perform rather than introducing unrelated game mechanics.

Ideas included:

- XP for logging movies
- Additional XP for reviews
- Achievement badges
- Viewing streaks
- User levels

These concepts became the foundation of the final gamification system.

---

## Prompt 9 : API Design

### Prompt

> How should I structure my ASP.NET Core API so that the frontend remains independent of the database?

### Why I asked

I wanted the frontend to communicate only with well-defined API endpoints rather than depending on database models.

### Summary of AI Response

The recommendation was to:

- use controllers for endpoints
- use DTOs for requests and responses
- separate business logic into services
- avoid exposing Entity Framework models directly

This approach was adopted throughout the project.

---

## Prompt 10 : Authentication Strategy

### Prompt

> Should I use JWT authentication or ASP.NET Identity for this project?

### Why I asked

I wanted an authentication solution that integrated well with a React single-page application while remaining appropriate for the assessment.

### Summary of AI Response

JWT authentication was recommended because it provides stateless authentication and integrates naturally with React applications.

Passwords should be securely hashed using BCrypt before being stored.

---

## Prompt 11 : UI Planning

### Prompt

> I have created low-fidelity wireframes. How should I transition these into a modern responsive interface?

### Why I asked

The wireframes established the application's layout, but I wanted guidance on implementing a polished user interface.

### Summary of AI Response

The recommendation was to use a component-based design system with reusable React components.

Later in development, v0 was used to generate an initial visual design which was then customised and integrated into the application.

---

## Prompt 12 : Advanced Requirements

### Prompt

> Which advanced requirements would best complement my project rather than feeling like separate additions?

### Why I asked

I wanted the advanced requirements to strengthen the application rather than simply satisfy assessment criteria.

### Summary of AI Response

Several options were discussed before selecting:

- Theme switching
- Cypress end-to-end testing
- Security measures

These choices naturally aligned with the project's architecture and user experience.

---

## Prompt 13 : Development Strategy

### Prompt

> I have 6 weeks to complete this entire project. What would be a sensible order for implementing the project?

### Why I asked

Before writing code, I wanted a development roadmap that would minimise rework.

### Summary of AI Response

The suggested order was:

1. Database design
2. Backend API
3. Authentication
4. TMDB integration
5. Frontend
6. Gamification
7. Testing
8. Deployment

Although some adjustments were made during development, this overall sequence closely matched the final workflow.