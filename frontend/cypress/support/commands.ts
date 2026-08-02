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

export type TestUser = { username: string; email: string; password: string };

declare global {
  namespace Cypress {
    interface Chainable {
      registerViaApi(user: TestUser): Chainable<unknown>;
      visitAuthenticated(path: string, user: TestUser): Chainable<unknown>;
    }
  }
}

const apiUrl = Cypress.env("apiUrl") || "http://localhost:5045/api";

Cypress.Commands.add("registerViaApi", (user: TestUser) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/auth/register`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("visitAuthenticated", (path: string, user: TestUser) => {
  return cy
    .request("POST", `${apiUrl}/auth/login`, { email: user.email, password: user.password })
    .then((response) => {
      const { token, ...authUser } = response.body;
      cy.visit(path, {
        onBeforeLoad(win) {
          win.localStorage.setItem("cinephile_token", token);
          win.localStorage.setItem("cinephile_user", JSON.stringify(authUser));
        },
      });
    });
});

export {};
