# Cinephile

Cinephile is a full-stack web application that helps users discover, track, and review movies while encouraging consistent engagement through **gamification**. Users can search for films, maintain a personalised watchlist, record watched movies, write reviews, rate films, unlock achievements, gain experience points (XP), and level up as they continue their movie journey.

This project was developed as part of the **Microsoft Student Accelerator (MSA) Phase 2 Assessment** and demonstrates modern full-stack development practices using React, ASP.NET Core Web API, Entity Framework Core, PostgreSQL, Azure, Vercel, automated testing, CI/CD, and AI-assisted software development.

---

## Live Application

### Frontend

**https://cinephile-mu.vercel.app/**

### API Documentation (Scalar)

**https://cinephile-api-dub2aababvacgng5.newzealandnorth-01.azurewebsites.net/scalar/v1**

### Project Wiki

Planning, wireframes, architecture decisions and early project documentation can be found here:

**https://github.com/carolrichadsouza/cinephile/wiki**

---

## Project Overview

Movie tracking applications often focus only on storing lists of watched films. Cinephile expands on this concept by introducing **game mechanics** that motivate users to continue logging their viewing habits.

The application transforms movie tracking into an engaging experience by rewarding users with XP, achievements, and progression levels whenever they interact with the platform.

Users can:

- Search thousands of movies using TMDB
- Build and manage a personal watchlist
- Record watched movies
- Rate movies
- Write reviews
- View community reviews
- Track viewing history
- Earn XP
- Unlock achievements
- Level up through continued activity
- Maintain viewing streaks

---

### Tech Stack

#### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Shadcn UI
- React Router
- Lucide React
- Sonner

#### Backend

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- JWT Authentication
- BCrypt Password Hashing
- Scalar API Documentation

#### Database

- PostgreSQL

#### External APIs

- The Movie Database (TMDB)

#### Testing

- **Backend:** xUnit, Moq
- **Frontend:** Vitest, React Testing Library
- **End-to-End:** Cypress

#### DevOps & Deployment

- GitHub Actions (CI)
- Azure App Service (Backend)
- Vercel (Frontend)

#### Development Tools

- Visual Studio Code
- Visual Studio
- Git & GitHub
- Postman

--- 

### Features

#### Authentication

- Secure user registration
- Secure login using JWT authentication
- Password hashing using BCrypt
- Protected routes
- Persistent user sessions

#### Movie Discovery

- Search movies using TMDB
- Movie details page
- Posters
- Genres
- Release dates
- Movie overview

#### Personal Movie Journal

Users can:

- Add movies to their watchlist
- Remove movies from their watchlist
- Mark movies as watched
- Add ratings
- Write reviews
- Edit existing logs
- Delete movie logs

#### Community Features

- View reviews written by other users
- Browse community ratings
- Read detailed reviews for each movie

#### Gamification

Cinephile rewards users for engaging with the platform.

Current gamification features include:

- XP system
- User levels
- Achievement badges
- Viewing streaks
- Level-up notifications
- Achievement unlock notifications
- XP notifications

#### User Profile

Each user has a personalised profile containing:

- Username
- Current level
- XP progress
- Achievement collection
- Movie statistics
- Recently watched movies
- Personal activity

---

## Screenshots

### Login

<img width="1917" height="906" alt="Login Screenshot" src="https://github.com/user-attachments/assets/913fbbf7-a1c2-4503-842b-7d79173a23c1" />

### Dashboard

<img width="1901" height="907" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/c005085c-2769-4d84-9b07-5a769d9ad373" />

### Search

<img width="1896" height="912" alt="Search Screenshot" src="https://github.com/user-attachments/assets/fbdfa0e5-be91-4c2b-a07b-322d5262020c" />

### Movie Details

<img width="1901" height="907" alt="Movie Details Screenshot" src="https://github.com/user-attachments/assets/21775a53-0860-4fa7-8450-9a7b86fc0d26" />

### Watchlist

<img width="1917" height="912" alt="Watchlist Screenshot" src="https://github.com/user-attachments/assets/bd32776e-d2f3-4f29-ae3c-63bbd9811873" />

### Profile

<img width="1897" height="906" alt="Profile Screenshot" src="https://github.com/user-attachments/assets/0794a56f-c1f4-47bf-bae4-9c34eb0bf9e1" />

### Achievements Popup Screenshot

<img width="1900" height="910" alt="Achievements Popup Screenshot" src="https://github.com/user-attachments/assets/df7c7c97-d4c8-42c5-be8d-9e52c5cc39a2" />

### Dark Mode

<img width="1900" height="907" alt="Dark Mode Screenshot" src="https://github.com/user-attachments/assets/27583ead-827e-4354-a79d-e37051b6a442" />

---

## How Cinephile relates to the theme?

The theme of this project is gamification. Movie tracking applications traditionally allow users to record the films they have watched, but they often provide little incentive for continued engagement. Cinephile addresses this by incorporating game-inspired mechanics such as XP, levels, achievements, and viewing streaks.

- **Points & levels** 
    <br> Every logged film earns points (more if you write a review), which accumulate across 20 named levels (Rookie Critic → True Cinephile), each with its own point threshold.
- **Achievements** 
    <br> 8 badges (e.g. *First Reel* for your first log, *Marathoner* for 5 films in a week, *Devoted* for a 30-day streak) unlock automatically as you use the app, each shown with live progress toward the next unlock.
- **Streaks**
    <br> A running "current streak" is calculated from your watch dates and surfaced on the dashboard.
- **Progress tracking**
    <br> The dashboard and profile page visualise XP-to-next-level, genre breakdown, and recent activity, turning ordinary logging into visible progress.

All the points, levels, and achievements are computed server-side (`GamificationService`) and drive real unlocks and feedback (level-up and achievement toasts) the moment a user logs a film, rates it, or adds it to their watchlist.

---

## What makes Cinephile worth a closer look?

- **Personalised recommendations** 
    <br>The "Recommended for you" rail isn't static; the backend looks at the genre that the user log the most, then queries TMDB's discover endpoint for that genre, excluding anything you've already logged or watchlisted. New users with no history fall back to TMDB's popular list, so the section is never empty.
- **Community reviews, not just personal ones** 
    <br>Every movie page shows other users' ratings and reviews for that film (excluding the current user's), pulled live from everyone's logs, so the app builds a shared sense of what the community thinks rather than being a purely solo journal.
- **Real progress feedback, not just a database update**
    <br> A user logging a film, adding a review, or completing their watchlist threshold triggers live toast notifications for points earned, level-ups, and achievement unlocks, so gamification is felt in the moment rather than only visible after the fact on a stats page.
- **Achievements track progress, not just pass/fail**
    <br>Every achievement shows live progress toward the next unlock (e.g. "42/100" logs toward Centurion), even before the user has earned it so the badges feel like something that they are working towards, not a surprise that appears out of nowhere.
- **Watchlist and logging talk to each other**
    <br>Log a film you'd previously added to your watchlist and it's automatically removed which means that the two lists stay in sync without the user having to manually clean up after themselves.

---

## Advanced features implemented

- [x] **Theme switching (light/dark mode)** 
    <br> A persistent theme toggle (`ThemeProvider` + `ModeToggle`) available from the nav bar on every page, backed by `localStorage` so the choice survives a reload.
- [x] **End-to-end testing using Cypress** 
    <br> 8 spec files covering auth, search, watchlist, logging & gamification feedback, community reviews, dashboard/profile, navigation/theme/responsiveness, and API authorisation.
- [x] **Security measures** 
    <br> *(2, as required - see [Security](#security) below for the full write-up)*:
  - Password hashing with BCrypt
  - Server-side data validation via ASP.NET Core DataAnnotations

## Security

Two security measures were implemented, both directly protecting the data this app handles: user credentials and everything tied to a user's account (points, logs, watchlist).

### 1. Password hashing (BCrypt)

**Why it matters:** Cinephile stores an email/password for every account. If the database were ever exposed, storing passwords in plaintext (or with a fast, reversible hash) would mean every user's password, and likely their reused passwords on other sites would also leak with it. Password hashing is the baseline expectation for any app that manages its own auth.

**How it's implemented:**
- On registration, `BCrypt.Net.BCrypt.HashPassword(request.Password)` hashes the password before it's ever written to `Users.PasswordHash` (see `AuthController.Register`). The plaintext password is never persisted.
- On login, `BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)` checks the supplied password against the stored hash — the app never has a reason to decrypt or compare plaintext.
- BCrypt is deliberately slow (adaptive cost factor), which makes brute-forcing leaked hashes impractical compared to fast hashes like unsalted SHA-256.
- Login failures return one generic `"Invalid email or password."` message regardless of whether the email didn't exist or the password was wrong, so the endpoint can't be used to enumerate registered emails.

### 2. Data validation & sanitisation (DataAnnotations)

**Why it matters:** Every write endpoint (register, log a film, write a review, add to watchlist) accepts user-supplied input. Without server-side validation, malformed or oversized input can corrupt data, break assumptions the app relies on elsewhere (e.g. a rating outside 0–5 skewing the community average), or just cause unhandled exceptions. Validation has to live on the server — the frontend's own checks are trivially bypassable by anyone calling the API directly.

**How it's implemented:**
- Request DTOs use DataAnnotations directly on their fields, e.g. `RegisterRequest` requires a username between 3-30 characters, a valid email format, and a password of at least 8 characters (`AuthDtos.cs`); `CreateLogRequest`/`UpdateLogRequest` constrain `Rating` to 0.5–5 and cap `Review` at 4000 characters (`LogDtos.cs`).
- Every controller is marked `[ApiController]`, which makes ASP.NET Core automatically validate the model and return a `400 Bad Request` before the action method body even runs if any attribute fails, the invalid input never reaches business logic.
- Review text is trimmed and empty/whitespace-only reviews are normalised to `null` server-side (`LogsController`), so the review count and "has this user reviewed a film" checks can't be gamed with blank strings.

---

## Testing

**Backend** (xUnit and Moq, run from root directory):
```
dotnet test
```
50 unit tests covering `GamificationService` (points, levels, streaks, achievement unlocks), `TokenService`, `MovieCacheService`, and the Auth/Logs/Watchlist/Movies/Users/Achievements controllers.

**Frontend unit tests** (Vitest + Testing Library, run from `/frontend`):
```
npm test
```
35 tests across components, lib helpers, and pages.

**End-to-end tests** (Cypress, run from `/frontend`, requires the backend running locally):
```
npx cypress open
```
8 specs covering auth, search, watchlist, logging & gamification feedback, community reviews, dashboard/profile, navigation/theme/responsiveness, and API authorisation.

All three suites run in CI on every push/PR via `backend-ci.yml` and `frontend-ci.yml`.

---

## Self-reflection

Looking back on this project, one of the biggest things I would do differently is deploy the application much earlier. I left deploying the frontend and backend to when it became necessary to implement it, which meant I had to deal with deployment-specific issues such as CORS configuration, environment variables, and build differences all at once. Setting up deployment earlier would have helped me identify and fix these issues incrementally instead of at the end.

I would also introduce automated testing much earlier in the development process. While I implemented backend unit tests, frontend unit tests, and Cypress end-to-end tests, these were added after most of the application's features had already been built. Writing tests alongside new functionality would have made debugging easier, given me more confidence when making changes, and reduced the amount of work needed to build the final test suites.

Another thing I would have liked to explore is some of the other advanced requirements. I was interested in using a state management library such as Zustand and experimenting with Storybook for documenting and testing UI components. Although I decided not to include these due to time constraints, I think they would have been valuable additions and would have strengthened the project's architecture.

Finally, there are a few features that I would like to continue developing beyond the scope of this assessment. One feature I originally planned was a "Browse by Genre" section on the dashboard to help users discover movies more easily. I removed it to focus on completing the core functionality, but it's something I'd like to revisit in a future version of Cinephile.

--- 

## AI Usage
See the /specs folder for AI prompts, agent instructions, and planning artifacts used during development, and the submission video for a walkthrough of how AI was used.
