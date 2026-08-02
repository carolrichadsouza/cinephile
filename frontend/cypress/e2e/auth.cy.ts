/// <reference types="cypress" />
import type { TestUser } from "../support/commands";

function uniqueUser(prefix: string): TestUser {
  const id = Date.now() + Math.floor(Math.random() * 1000);
  return {
    username: `${prefix}${id}`,
    email: `${prefix}${id}@example.com`,
    password: "TestPass123!",
  };
}

describe("Registration", () => {
  it("Creates a new account and lands on the main dashboard", () => {
    const user = uniqueUser("e2ereg");

    cy.visit("/register");
    cy.get('input[placeholder="username"]').type(user.username);
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('form button[type="submit"]').click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.contains(user.username).should("be.visible");
  });

  it("Shows a conflict error if the email is already registered", () => {
    const existing = uniqueUser("e2edupe");
    cy.registerViaApi(existing);

    cy.visit("/register");
    cy.get('input[placeholder="username"]').type(`${existing.username}2`);
    cy.get('input[type="email"]').type(existing.email);
    cy.get('input[type="password"]').type(existing.password);
    cy.get('form button[type="submit"]').click();

    cy.contains(/already registered/i).should("be.visible");
    cy.url().should("include", "/register");
  });

  it("Shows a conflict error if the username is already taken", () => {
    const existing = uniqueUser("e2edupe");
    cy.registerViaApi(existing);

    cy.visit("/register");
    cy.get('input[placeholder="username"]').type(`${existing.username}2`);
    cy.get('input[type="email"]').type(`${existing.email}2`);
    cy.get('input[type="password"]').type(existing.password);
    cy.get('form button[type="submit"]').click();

    cy.contains(/username already taken/i).should("be.visible");
    cy.url().should("include", "/register");
  });
});

describe("Login", () => {
  const user = uniqueUser("e2elogin");

  before(() => {
    cy.registerViaApi(user);
  });

  it("Logs in with valid credentials", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('form button[type="submit"]').click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.contains(user.username).should("be.visible");
  });

  it("Shows an error for the wrong password", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type("WrongPassword123!");
    cy.get('form button[type="submit"]').click();

    cy.contains(/invalid email or password/i).should("be.visible");
    cy.url().should("include", "/login");
  });
});

describe("Protected routes", () => {
  it("Redirects unauthenticated visitors to the login page", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
  });
});

describe("Logout", () => {
  it("Logs the user out and redirects to the login page", () => {
    const user = uniqueUser("e2elogout");
    cy.registerViaApi(user);
    cy.visitAuthenticated("/profile", user);

    cy.contains("button", "Log out").click();

    cy.url().should("include", "/login");
  });
});