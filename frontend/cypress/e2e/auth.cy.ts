/// <reference types="cypress" />
import type { TestUser } from "../support/commands";

function makeUser(prefix: string): TestUser {
  const id = `${Date.now()}${Cypress._.random(1000, 9999)}`;
  return {
    username: `${prefix}${id}`,
    email: `${prefix}${id}@example.com`,
    password: "TestPass123!",
  };
}

describe("Authentication", () => {
  it("registers a new user and lands on the dashboard", () => {
    const user = makeUser("register");

    cy.visit("/register");
    cy.get('input[placeholder="username"]').type(user.username);
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('form button[type="submit"]').click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.contains(user.username).should("be.visible");
    cy.window().its("localStorage.cinephile_token").should("be.a", "string");
  });

  it("rejects a weak password before sending registration", () => {
    cy.intercept("POST", "**/api/auth/register").as("registerRequest");
    cy.visit("/register");
    cy.get('input[placeholder="username"]').type("weakpassworduser");
    cy.get('input[type="email"]').type("weak@example.com");
    cy.get('input[type="password"]').type("password");
    cy.get('form button[type="submit"]').click();

    cy.get('input[type="password"]')
    .then(($input) => {
      expect(($input[0] as HTMLInputElement).validity.valid).to.eq(false);
    });

    cy.get("@registerRequest.all").should("have.length", 0);
  });

  it("shows duplicate-email and duplicate-username errors", () => {
    const existing = makeUser("duplicate");
    cy.registerViaApi(existing).its("status").should("be.oneOf", [200, 201]);

    cy.visit("/register");
    cy.get('input[placeholder="username"]').type(`${existing.username}x`);
    cy.get('input[type="email"]').type(existing.email);
    cy.get('input[type="password"]').type(existing.password);
    cy.get('form button[type="submit"]').click();
    cy.contains(/already registered/i).should("be.visible");

    cy.get('input[placeholder="username"]').clear().type(existing.username);
    cy.get('input[type="email"]').clear().type(`x${existing.email}`);
    cy.get('form button[type="submit"]').click();
    cy.contains(/username is already taken/i).should("be.visible");
  });

  it("logs in with valid credentials and rejects a wrong password", () => {
    const user = makeUser("login");
    cy.registerViaApi(user);

    cy.visit("/login");
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type("WrongPassword123!");
    cy.get('form button[type="submit"]').click();
    cy.contains(/invalid email or password/i).should("be.visible");

    cy.get('input[type="password"]').clear().type(user.password);
    cy.get('form button[type="submit"]').click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });

  it("redirects unauthenticated users away from every protected route", () => {
    ["/", "/search", "/watchlist", "/profile", "/movies/157336"].forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/login");
    });
  });

  it("logs out and clears stored authentication", () => {
    const user = makeUser("logout");
    cy.registerViaApi(user);
    cy.visitAuthenticated("/profile", user);
    cy.contains("button", "Log out").click();

    cy.url().should("include", "/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("cinephile_token")).to.equal(null);
      expect(win.localStorage.getItem("cinephile_user")).to.equal(null);
    });
  });
});
