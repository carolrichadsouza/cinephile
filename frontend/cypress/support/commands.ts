/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/// <reference types="cypress" />

export type TestUser = {
  username: string;
  email: string;
  password: string;
};

export type StoredUser = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  points: number;
  levelId: number;
  levelName: string;
};

declare global {
  namespace Cypress {
    interface Chainable {
      uniqueUser(prefix?: string): Chainable<TestUser>;
      registerViaApi(user: TestUser): Chainable<Cypress.Response<unknown>>;
      loginViaApi(user: Pick<TestUser, "email" | "password">): Chainable<Cypress.Response<unknown>>;
      visitAuthenticated(path: string, user: TestUser): Chainable<void>;
      visitWithMockAuth(path: string, overrides?: Partial<StoredUser>): Chainable<void>;
      mockDashboardApi(): Chainable<void>;
    }
  }
}

const apiUrl = Cypress.env("apiUrl") || "http://localhost:5045/api";

Cypress.Commands.add("uniqueUser", (prefix = "e2e") => {
  const id = `${Date.now()}${Cypress._.random(1000, 9999)}`;
  return cy.wrap({
    username: `${prefix}${id}`,
    email: `${prefix}${id}@example.com`,
    password: "TestPass123!",
  });
});

Cypress.Commands.add("registerViaApi", (user: TestUser) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/auth/register`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("loginViaApi", (user) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/auth/login`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("visitAuthenticated", (path: string, user: TestUser) => {
  cy.loginViaApi(user).then((response) => {
    expect(response.status).to.eq(200);
    const { token, ...authUser } = response.body as Record<string, unknown>;

    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("cinephile_token", String(token));
        win.localStorage.setItem("cinephile_user", JSON.stringify(authUser));
      },
    });
  });
});

Cypress.Commands.add("visitWithMockAuth", (path, overrides = {}) => {
  const user: StoredUser = {
    userId: 1,
    username: "cypressuser",
    email: "cypress@example.com",
    displayName: "Cypress User",
    points: 40,
    levelId: 1,
    levelName: "Newcomer",
    ...overrides,
  };

  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("cinephile_token", "mock-jwt-token");
      win.localStorage.setItem("cinephile_user", JSON.stringify(user));
    },
  });
});

Cypress.Commands.add("mockDashboardApi", () => {
  cy.intercept("GET", "**/api/users/me", { fixture: "profile.json" }).as("getProfile");
  cy.intercept("GET", "**/api/users/me/stats", { fixture: "stats.json" }).as("getStats");
  cy.intercept("GET", "**/api/achievements", { fixture: "achievements.json" }).as("getAchievements");
  cy.intercept("GET", "**/api/movies/trending", { fixture: "movies.json" }).as("getTrending");
  cy.intercept("GET", "**/api/movies/recommended", { fixture: "movies.json" }).as("getRecommended");
});

export {};
