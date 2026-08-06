/// <reference types="cypress" />

describe("API authentication and authorisation", () => {
  const apiUrl = Cypress.env("apiUrl") || "http://localhost:5045/api";

  it("rejects protected endpoints without a bearer token", () => {
    ["/users/me", "/users/me/stats", "/logs", "/watchlist", "/achievements"].forEach((path) => {
      cy.request({ url: `${apiUrl}${path}`, failOnStatusCode: false }).its("status").should("eq", 401);
    });
  });

  it("allows an authenticated user to access only their own profile data", () => {
    cy.uniqueUser("security").then((user) => {
      cy.registerViaApi(user);
      cy.loginViaApi(user).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        const token = loginResponse.body.token as string;

        cy.request({
          url: `${apiUrl}/users/me`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.email).to.eq(user.email);
          expect(response.body.username).to.eq(user.username);
        });
      });
    });
  });

  it("rejects an invalid bearer token", () => {
    cy.request({
      url: `${apiUrl}/users/me`,
      headers: { Authorization: "Bearer invalid-token" },
      failOnStatusCode: false,
    }).its("status").should("eq", 401);
  });
});
