# Deployment

This document contains representative prompts from the deployment phase of Cinephile.

Deployment introduced several challenges that were not encountered during local development. AI was primarily used to troubleshoot deployment issues, explain production configuration, and review deployment workflows.

The application was deployed using:

- Azure App Service (Backend)
- Vercel (Frontend)
- PostgreSQL
- GitHub Actions
- Scalar API Documentation

---

## Prompt 1 : Planning Deployment

### Prompt

> My application is working locally. What's the best way to deploy a React frontend and an ASP.NET Core backend separately?

### Why I asked

Before deploying, I wanted to understand a typical production architecture for a full-stack application.

### Summary of AI Response

The recommended architecture separated responsibilities across different services:

- React frontend hosted on Vercel.
- ASP.NET Core Web API hosted on Azure App Service.
- PostgreSQL database hosted separately.
- Frontend communicating with the backend through HTTPS.

This became the deployment architecture used for Cinephile.

---

## Prompt 2 : Choosing a Frontend Deployment Platform

### Prompt

> Would Vercel or Render be better for deploying my React and Vite frontend? What are the advantages and disadvantages of each for this project?

### Why I asked

I wanted to compare deployment platforms before deciding where to host the frontend rather than choosing one without understanding the trade-offs.

### Summary of AI Response

The discussion compared Vercel and Render in terms of:

- Vite and React support
- Deployment from GitHub
- Environment variable configuration
- Build and deployment workflow
- Ease of setup
- Suitability for static frontend applications

Vercel was ultimately selected for the frontend because it provided a straightforward deployment workflow for a React/Vite application and integrated easily with the GitHub repository.

---

## Prompt 3 – Deploying PostgreSQL

### Prompt

> My PostgreSQL database currently runs locally. How should I deploy it so my deployed ASP.NET Core backend can connect to it?

### Why I asked

The application originally used a local PostgreSQL database. Once the backend was deployed, it needed a remotely accessible production database because Azure App Service could not connect to the PostgreSQL instance running on my computer.

### Summary of AI Response

The discussion explained that the database should be hosted independently from the backend and connected using a production connection string.

Topics included:

- Managed PostgreSQL hosting
- Creating a production database
- Configuring the database connection string
- Storing the connection string as an Azure environment variable rather than committing it
- Applying Entity Framework Core migrations to the production database
- Testing the deployed backend against the production database

This helped establish the final deployment architecture where the frontend, backend, and database run independently but communicate through configured production connections.

---

## Prompt 4 : Azure Configuration

### Prompt

> I've deployed my backend to Azure, but I'm unsure how to configure connection strings, JWT settings, and API secrets securely.

### Why I asked

Local configuration relied on `appsettings.Development.json`, which should not be used in production.

### Summary of AI Response

The discussion covered:

- Azure App Service application settings.
- Environment variables.
- Production connection strings.
- JWT secret configuration.
- Keeping sensitive values out of source control.

This became the final production configuration.

---

## Prompt 5 : Frontend Environment Variables

### Prompt

> My frontend still seems to be calling my localhost API after deployment. How should I configure Vite so it communicates with my deployed backend instead?

### Why I asked

The frontend worked correctly during local development but continued referencing the development API after deployment.

### Summary of AI Response

The recommendation was to:

- Configure production environment variables.
- Update the Vite API URL.
- Rebuild and redeploy the frontend.
- Verify requests using browser developer tools.

This resolved communication between the deployed frontend and backend.

---

## Prompt 6 : CORS

### Prompt

> My frontend can reach the backend locally, but I'm getting CORS errors after deployment. What should I check?

### Why I asked

Production introduced browser security restrictions that were not present during local development.

### Summary of AI Response

The discussion focused on:

- Allowed origins.
- HTTPS configuration.
- Azure App Service settings.
- Production frontend URL.
- Browser network requests.

After updating the allowed origins, requests were successfully accepted.

---

## Prompt 7 : Scalar API Documentation

### Prompt

> I've configured Scalar locally. How can I make the API documentation available once my backend is deployed?

### Why I asked

I wanted the deployed API to provide accessible documentation for demonstration purposes.

### Summary of AI Response

The discussion covered:

- Enabling Scalar in production.
- Verifying OpenAPI configuration.
- Confirming the published endpoint after deployment.

The deployed backend now exposes public API documentation through Scalar.

---

## Prompt 8 : Continuous Integration

### Prompt

> My backend and frontend are now complete. Can you review my GitHub Actions workflows and make sure they're structured correctly?

### Why I asked

I wanted to ensure automated validation occurred before future deployments.

### Summary of AI Response

Separate workflows were reviewed for:

Frontend:

- Dependency installation.
- ESLint.
- Unit tests.
- Production build.

Backend:

- Package restore.
- Build.
- Unit tests.

This ensured both projects could be validated independently.

---

## Prompt 9 : Final Submission Review

### Prompt

> Before I submit my project, can you review everything that's left to complete against the assessment requirements?

### Why I asked

I wanted to confirm that every required deliverable had been completed before submission.

### Summary of AI Response

The final review included:

- Backend functionality.
- Frontend functionality.
- Theme switching.
- Security measures.
- Backend tests.
- Frontend tests.
- Cypress tests.
- Continuous Integration.
- Deployment.
- README.
- Wiki.
- `/specs` documentation.

This checklist helped ensure the project satisfied both the basic and selected advanced assessment requirements.