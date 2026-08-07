# 🎬 Cinephile

> A full-stack gamified movie tracking platform built with React, TypeScript, ASP.NET Core, and PostgreSQL.

![Status](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![License](https://img.shields.io/badge/license-Educational-blue)

Cinephile is a full-stack web application that helps users discover, track, and review movies while encouraging consistent engagement through **gamification**. Users can search for films, maintain a personalised watchlist, record watched movies, write reviews, rate films, unlock achievements, gain experience points (XP), and level up as they continue their movie journey.

This project was developed as part of the **Microsoft Student Accelerator (MSA) Phase 2 Assessment** and demonstrates modern full-stack development practices using React, ASP.NET Core Web API, Entity Framework Core, PostgreSQL, Azure, Vercel, automated testing, CI/CD, and AI-assisted software development.

---

# 🌐 Live Application

## Frontend

**https://cinephile-mu.vercel.app/**

## API Documentation (Scalar)

**https://cinephile-api-dub2aababvacgng5.newzealandnorth-01.azurewebsites.net/scalar**

## Project Wiki

Planning, wireframes, architecture decisions and early project documentation can be found here:

**https://github.com/carolrichadsouza/cinephile/wiki**

---

# 📖 Project Overview

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

# ✨ Features

## 🔐 Authentication

- Secure user registration
- Secure login using JWT authentication
- Password hashing using BCrypt
- Protected routes
- Persistent user sessions

---

## 🎥 Movie Discovery

- Search movies using TMDB
- Movie details page
- Posters
- Genres
- Release dates
- Movie overview

---

## 📝 Personal Movie Journal

Users can:

- Add movies to their watchlist
- Remove movies from their watchlist
- Mark movies as watched
- Add ratings
- Write reviews
- Edit existing logs
- Delete movie logs

---

## 👥 Community Features

- View reviews written by other users
- Browse community ratings
- Read detailed reviews for each movie

---

## 🎮 Gamification

Cinephile rewards users for engaging with the platform.

Current gamification features include:

- XP system
- User levels
- Achievement badges
- Viewing streaks
- Level-up notifications
- Achievement unlock notifications
- XP notifications

---

## 👤 User Profile

Each user has a personalised profile containing:

- Username
- Current level
- XP progress
- Achievement collection
- Movie statistics
- Recently watched movies
- Personal activity

---

## 🎨 Modern User Experience

- Responsive design
- Light mode
- Dark mode
- Mobile-friendly layout
- Accessible UI components
- Clean modern interface built using Shadcn UI

---

# 📷 Application Screenshots

> **Replace these placeholders with screenshots before submission.**

## Login

![Login Screenshot](docs/screenshots/login.png)

---

## Dashboard

![Dashboard Screenshot](docs/screenshots/dashboard.png)

---

## Search

![Search Screenshot](docs/screenshots/search.png)

---

## Movie Details

![Movie Details Screenshot](docs/screenshots/movie-details.png)

---

## Watchlist

![Watchlist Screenshot](docs/screenshots/watchlist.png)

---

## Profile

![Profile Screenshot](docs/screenshots/profile.png)

---

## Achievements

![Achievements Screenshot](docs/screenshots/achievements.png)

---

## Dark Mode

![Dark Mode Screenshot](docs/screenshots/dark-mode.png)

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Shadcn UI
- React Router
- Lucide Icons
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

## External APIs

- The Movie Database (TMDB)

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

## DevOps

- GitHub Actions
- Azure App Service
- Vercel

---

# 📂 Project Structure

```text
cinephile/
│
├── backend/                 ASP.NET Core Web API
├── backend.Tests/           xUnit backend tests
├── frontend/                React + TypeScript application
├── .github/workflows/       CI pipelines
├── specs/                   Planning and AI documentation
└── README.md
```

# 🏗 System Architecture

Cinephile follows a modern three-tier architecture consisting of a React frontend, an ASP.NET Core Web API backend, and a PostgreSQL database.

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │  React + TypeScript  │
                    └──────────┬───────────┘
                               │
                        REST API Requests
                               │
                    ┌──────────▼───────────┐
                    │ ASP.NET Core Web API │
                    │ Authentication       │
                    │ Business Logic       │
                    │ Gamification         │
                    └──────────┬───────────┘
                               │
                   Entity Framework Core
                               │
                    ┌──────────▼───────────┐
                    │     PostgreSQL       │
                    │  Users, Logs, XP,    │
                    │ Achievements, Movies │
                    └──────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │       TMDB API       │
                    │ Movie Metadata       │
                    └──────────────────────┘
```

---

# 🗄 Database Design

The backend uses **PostgreSQL** with **Entity Framework Core** as the ORM.

The primary entities include:

- User
- MovieLog
- WatchlistItem
- Achievement
- UserAchievement
- Level

Relationships include:

- One user can have many movie logs.
- One user can have many watchlist items.
- One user can unlock many achievements.
- Each user belongs to a level.
- Movie logs store ratings and reviews linked to TMDB movie IDs.

Database schema changes are managed using **Entity Framework Core Migrations**.

---

# 🔑 Environment Variables

The application requires different environment variables for local development and production deployment.

## Frontend

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_URL=http://localhost:5045
```

For the deployed application, this value should point to the deployed backend API.

Example:

```env
VITE_API_URL=https://your-backend.azurewebsites.net
```

---

## Backend

Create an `appsettings.Development.json` file inside the `backend` project.

Example structure:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "<YOUR_POSTGRES_CONNECTION_STRING>"
  },
  "Jwt": {
    "Issuer": "Cinephile",
    "Audience": "CinephileUsers",
    "Key": "<YOUR_SECRET_KEY>"
  },
  "Tmdb": {
    "ReadAccessToken": "<YOUR_TMDB_ACCESS_TOKEN>"
  }
}
```

> **Important:** Sensitive configuration files are intentionally excluded from version control.

---

# 🚀 Running Locally

## Prerequisites

- .NET SDK 10
- Node.js 24+
- PostgreSQL
- Git

---

## Clone the Repository

```bash
git clone https://github.com/carolrichadsouza/cinephile.git

cd cinephile
```

---

## Backend Setup

Navigate to the backend project.

```bash
cd backend
```

Restore dependencies.

```bash
dotnet restore
```

Apply database migrations.

```bash
dotnet ef database update
```

Run the API.

```bash
dotnet run
```

The backend will start on:

```
http://localhost:5045
```

---

## Frontend Setup

Navigate to the frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

# 🌍 Deployment

## Frontend

Hosted using **Vercel**.

**Live Application**

https://cinephile-mu.vercel.app/

---

## Backend

Hosted using **Microsoft Azure App Service**.

The backend connects to an Azure-hosted PostgreSQL database and serves the REST API consumed by the frontend.

---

## API Documentation

Interactive API documentation is provided using **Scalar**.

https://cinephile-api-dub2aababvacgng5.newzealandnorth-01.azurewebsites.net/scalar

Scalar documents all available endpoints, request models, response models, and authentication requirements.

---

# 🔄 Continuous Integration

GitHub Actions are used to automatically validate every push and pull request.

## Backend Pipeline

The backend workflow automatically:

- Restores NuGet packages
- Builds the solution
- Runs all backend unit tests

---

## Frontend Pipeline

The frontend workflow automatically:

- Installs dependencies
- Runs ESLint
- Executes all frontend unit tests
- Builds the React application

These automated pipelines help ensure code quality and prevent regressions before deployment.

# 🧪 Testing

Testing was implemented across multiple layers of the application to improve reliability and ensure that both frontend and backend functionality behave as expected.

---

## Backend Unit Testing

The backend is tested using **xUnit** together with **Moq** for dependency mocking.

Tests cover:

### Authentication

- User registration
- Duplicate username validation
- Duplicate email validation
- Password hashing
- Login authentication
- Invalid credential handling

---

### Movie Logs

- Creating movie logs
- Updating movie logs
- Deleting movie logs
- Retrieving watched movies
- Ownership validation
- Invalid request handling

---

### Watchlist

- Add movie to watchlist
- Remove movie from watchlist
- Prevent duplicate watchlist entries
- Retrieve user watchlist

---

### User Profile

- Retrieve current user
- Profile statistics
- Achievement retrieval
- Level progression

---

### Movie API

- Search movies
- Retrieve movie details
- Invalid movie handling

---

### Services

- JWT Token Service
- TMDB Movie Cache Service
- Gamification Service

The backend includes a comprehensive suite of unit tests covering controllers and services.

Run backend tests:

```bash
dotnet test Cinephile.slnx
```

---

# ⚛ Frontend Unit Testing

Frontend unit tests were written using:

- Vitest
- React Testing Library

The frontend test suite covers both UI behaviour and application logic.

Components tested include:

- Authentication page
- Protected routes
- Theme provider
- Rating component
- Community reviews
- Dashboard
- Search page
- Movie details
- Watchlist
- User profile
- Authentication context
- API helper functions
- Gamification toast notifications

Run frontend tests:

```bash
cd frontend

npm test
```

Coverage can be generated using:

```bash
npm run test:coverage
```

---

# 🌐 End-to-End Testing

End-to-end testing was implemented using **Cypress**.

These tests simulate real user interactions within the browser.

Covered workflows include:

- User registration
- User login
- Protected routes
- Movie searching
- Watchlist management
- Rating movies
- Reviewing movies
- Updating movie logs
- Deleting movie logs
- Profile access
- Logout flow

Run Cypress locally:

```bash
npm run cy:open
```

Run headlessly:

```bash
npm run cy:run
```

---

# 🤖 AI Usage

Artificial Intelligence was used throughout the software development lifecycle to improve productivity while maintaining ownership of all design and implementation decisions.

AI assisted with:

- Brainstorming feature ideas
- API design discussions
- Debugging
- Explaining framework behaviour
- Refactoring suggestions
- Documentation
- Test generation
- CI/CD workflow creation

All generated content was reviewed, modified where necessary, and tested before being incorporated into the final project.

Planning documents, prompt history, and AI-assisted development notes are available inside the **/specs** directory.

---

# ⭐ Advanced Requirements

This project implements the following advanced requirements from the Microsoft Student Accelerator (MSA) Phase 2 assessment.

---

## 1. Theme Switching

The application supports both **light** and **dark** themes to provide a more personalised user experience.

Features include:

- System-wide light and dark mode
- Theme persistence across browser sessions
- Consistent styling across all pages and components
- Responsive design in both themes
- Implemented using React, Tailwind CSS and Shadcn UI

This improves accessibility, usability, and user experience while maintaining a consistent visual design throughout the application.

---

## 2. End-to-End Testing with Cypress

Comprehensive end-to-end testing was implemented using **Cypress** to validate complete user workflows from the perspective of an end user.

The Cypress test suite covers critical application functionality including:

- User registration
- User login
- Protected routes
- Movie searching
- Watchlist management
- Adding watched movies
- Updating movie logs
- Deleting movie logs
- Rating movies
- Writing reviews
- Viewing user profiles
- Logout functionality

These tests simulate real browser interactions and verify that the frontend and backend work together correctly, providing confidence that key user journeys function as expected.

---

## 3. Security Measures

Security was considered throughout the development of the application to protect user data and ensure secure access to resources.

### Password Hashing

User passwords are securely hashed using **BCrypt** before being stored in the database. Plain-text passwords are never stored.

### Data Validation

Both frontend and backend validate incoming user input.

Examples include:

- Email validation
- Password strength requirements
- Username length validation
- Rating value validation
- Required field validation

### Data Sanitisation

Incoming requests are validated using DTOs and model validation before being processed by the API.

Invalid or malformed requests are rejected before reaching the application's business logic.

### Protected Resources

JWT authentication is used to secure authenticated endpoints, ensuring that users can only access and modify their own data.

These security measures help protect user accounts and improve the overall reliability of the application.

---

# 📚 Additional Documentation

Additional project documentation is available in the following locations.

## GitHub Wiki

Project planning, early design work, and development milestones:

https://github.com/carolrichadsouza/cinephile/wiki

---

## Specs Folder

The `/specs` directory contains:

- Planning documentation
- User stories
- Design decisions
- Database planning
- API planning
- Testing strategy
- Security considerations
- AI prompt history
- Project reflections

This documentation demonstrates the project's evolution throughout development.

# 🔮 Future Improvements

Although Cinephile meets the current project requirements, there are several enhancements that could be implemented in future versions.

## Planned Features

- Friend system and social movie sharing
- Follow other users and view their activity
- Movie recommendations based on user preferences
- Advanced filtering and sorting
- Personalised recommendation engine
- Email verification and password reset
- Push notifications
- Public user profiles
- Leaderboards
- Monthly viewing challenges
- Import watch history from Letterboxd or IMDb
- Movie collections and custom lists
- Offline support using Progressive Web App (PWA) technologies
- AI-powered movie recommendations based on viewing history

---

# 💡 Challenges and Lessons Learned

Developing Cinephile provided valuable experience across the full software development lifecycle.

Some of the key challenges included:

- Designing a scalable backend architecture using ASP.NET Core and Entity Framework Core.
- Implementing JWT authentication securely while protecting user-specific resources.
- Integrating the TMDB API with efficient caching and error handling.
- Designing a gamification system that remained engaging without becoming overly complex.
- Maintaining consistency between frontend and backend models.
- Creating automated tests across multiple layers of the application.
- Configuring CI pipelines for both frontend and backend projects.
- Deploying a full-stack application across multiple cloud services.

Through this project, I gained practical experience with full-stack architecture, testing strategies, deployment, DevOps workflows, and secure web application development.

---

# 🤝 Acknowledgements

This project was developed as part of the **Microsoft Student Accelerator (MSA) Phase 2 Assessment**.

The following technologies and services were used:

- Microsoft Student Accelerator
- React
- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Azure App Service
- Vercel
- TMDB API
- Tailwind CSS
- Shadcn UI
- Vitest
- React Testing Library
- Cypress
- xUnit
- GitHub Actions

Special thanks to the maintainers of these open-source technologies and services that made this project possible.

---

# 👩‍💻 Author

**Carol Richa Dsouza**

Master of Information Technology (First Class Honours)

University of Auckland

GitHub:

https://github.com/carolrichadsouza

LinkedIn:

https://www.linkedin.com/in/carolrichadsouza/

---

# 📄 License

This repository was developed for educational purposes as part of the Microsoft Student Accelerator (MSA) programme.

---

# 📌 Repository

GitHub Repository

https://github.com/carolrichadsouza/cinephile

---

# 📬 Contact

If you have any questions regarding this project, feel free to reach out via GitHub or LinkedIn.

---

# ✅ Submission Checklist

- ✔ Full-stack web application
- ✔ React frontend
- ✔ ASP.NET Core Web API backend
- ✔ PostgreSQL database
- ✔ JWT authentication
- ✔ Gamification system
- ✔ Responsive user interface
- ✔ Light and dark theme support
- ✔ Backend unit testing (xUnit)
- ✔ Frontend unit testing (Vitest & React Testing Library)
- ✔ Cypress end-to-end testing
- ✔ Continuous Integration using GitHub Actions
- ✔ Scalar API documentation
- ✔ Azure deployment
- ✔ Vercel deployment
- ✔ GitHub Wiki documentation
- ✔ `/specs` documentation
- ✔ AI-assisted software development documentation

---

## Final Reflection

Cinephile demonstrates the design and implementation of a modern full-stack web application using contemporary software engineering practices. Throughout the project, I applied principles of secure application development, RESTful API design, responsive frontend development, automated testing, continuous integration, cloud deployment, and gamification.

One of the most rewarding aspects of the project was integrating multiple technologies into a cohesive application while ensuring maintainability through testing and CI pipelines. Implementing gamification transformed a traditional movie tracking application into a more engaging experience, encouraging continued user interaction through achievements, levels, XP, and streaks.

The project also provided practical experience working with AI-assisted development. Rather than relying on AI-generated code directly, I used AI as a collaborative development tool for planning, debugging, documentation, explaining concepts, and reviewing implementation ideas. Every AI-assisted solution was reviewed, tested, and adapted before being incorporated into the final application.

Overall, Cinephile has strengthened my understanding of full-stack application development and provided valuable experience across planning, implementation, testing, deployment, and documentation.