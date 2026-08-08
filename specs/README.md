# Specifications

This directory contains supporting documentation produced throughout the development of **Cinephile**. It complements the project Wiki by documenting the engineering decisions, AI-assisted development workflow, testing approach, security considerations, deployment process, and project context used during implementation.

## Relationship to the Project Wiki

The GitHub Wiki contains the project's early planning and design documentation, including:

- Business problem
- Competitor analysis
- Functional and non-functional requirements
- User personas
- User stories
- Project scope
- Wireframes
- Entity Relationship Diagram (ERD)
- Initial UI planning

These documents were created before implementation and represent the project's planning phase.

The `/specs` folder focuses on the implementation phase and records how AI tools were used to support development, along with the engineering decisions made as the application evolved.

## AI-Assisted Development

Artificial intelligence was used as a development assistant throughout this project rather than as a replacement for software engineering.

The primary AI tools used were:

- **ChatGPT** – planning, architecture discussions, debugging, explaining concepts, reviewing implementation approaches, generating documentation, and assisting with automated testing.
- **Claude** – alternative explanations, code review, and design discussion for selected implementation challenges.
- **v0 by Vercel** – generating the initial visual design for the application's user interface, which was then customised and integrated into the React application.

Every AI-generated suggestion was reviewed, adapted where necessary, and tested before being incorporated into the final project. The application architecture, implementation decisions, and final code remain the result of my own development work.

## How the Prompt Files Were Compiled

During development, I used ChatGPT regularly for planning, debugging, reviewing code, discussing architecture, testing, deployment, and documentation.

Rather than manually searching through every previous conversation at the end of the project, I asked ChatGPT to review the development history and compile the questions I had asked into organised Markdown files grouped by development phase.

The resulting prompt files therefore act as a structured record of the AI-assisted development process. They are based on prompts and topics that were actually discussed during the project, but have been organised and summarised into a clearer format so they are easier to review than the original conversation history.

Where appropriate, each prompt is accompanied by a short explanation of why it was asked and a summary of the guidance that was provided. The purpose of this formatting is to make the development process easier to follow, not to present the prompt files as verbatim transcripts of every AI conversation.

## Folder Structure

```text
specs/
│
├── README.md
├── project-context.md
├── agent-instructions.md
├── ai-development-overview.md
├── development-workflow.md
├── architecture-decisions.md
├── testing-strategy.md
├── security-design.md
├── ai-prompts.md
│
└── prompts/
    ├── 01-planning-phase.md
    ├── 02-backend-development.md
    ├── 03-frontend-development.md
    ├── 04-gamification-development.md
    ├── 05-testing.md
    └── 06-deployment.md
```

## Document Overview

### `project-context.md`

Describes the overall project, technology stack, architecture, objectives, and constraints that were consistently provided as context when requesting AI assistance.

### `agent-instructions.md`

Documents the guidance given to AI tools to ensure responses aligned with the project's architecture, coding standards, and development practices.

### `ai-development-overview.md`

Provides an overview of how AI was incorporated into the software development lifecycle, including planning, implementation, debugging, testing, documentation, and deployment.

### `development-workflow.md`

Summarises the chronological development process from initial planning through deployment and submission.

### `architecture-decisions.md`

Explains the rationale behind key technical decisions, including framework selection, backend architecture, database design, authentication strategy, and deployment choices.

### `testing-strategy.md`

Documents the overall testing approach, including backend unit testing, frontend unit testing, end-to-end testing, and continuous integration.

### `security-design.md`

Describes the security measures implemented throughout the application, including password hashing, authentication, input validation, authorisation, and secure configuration management.

### `deployment-notes.md`

Documents the deployment architecture, cloud services used, environment configuration, and continuous integration pipelines.

### `ai-prompts.md`

Contains a chronological record of representative prompts used during development. The prompts demonstrate how AI was used to support planning, problem solving, debugging, testing, deployment, and documentation.

### `prompts/`

The `prompts` directory groups representative prompts by development phase to show how AI assistance evolved throughout the project rather than being concentrated at the end.

## Notes

This folder should be read alongside the GitHub Wiki.

Together, the Wiki and `/specs` provide evidence of:

- project planning
- software design
- implementation decisions
- AI-assisted development
- testing strategy
- security considerations
- deployment process
- project reflection

These documents are intended to demonstrate the complete software engineering process followed during the development of Cinephile.