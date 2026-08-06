/// <reference types="cypress" />

describe("Movie search", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/movies/search?query=Interstellar", { fixture: "movies.json" }).as("searchMovies");
    cy.visitWithMockAuth("/search");
  });

  it("keeps the search button disabled for an empty query", () => {
    cy.contains("button", "Search").should("be.disabled");
    cy.get('input[placeholder="Search for a movie..."]').type("   ");
    cy.contains("button", "Search").should("be.disabled");
  });

  it("searches, shows the result count, and opens a movie", () => {
    cy.get('input[placeholder="Search for a movie..."]').type("Interstellar");
    cy.contains("button", "Search").click();
    cy.wait("@searchMovies").its("request.headers.authorization").should("eq", "Bearer mock-jwt-token");

    cy.contains("2 results found").should("be.visible");
    cy.contains("Interstellar").should("be.visible");
    cy.contains("Inception").should("be.visible");

    cy.intercept("GET", "**/api/watchlist", []).as("watchlist");
    cy.intercept("GET", "**/api/logs", []).as("logs");
    cy.intercept("GET", "**/api/movies/157336", { fixture: "movie-detail.json" }).as("movie");
    cy.intercept("GET", "**/api/movies/157336/reviews", []).as("reviews");
    cy.contains("a", "Interstellar").click();
    cy.url().should("include", "/movies/157336");
    cy.contains("h1", "Interstellar").should("be.visible");
  });

  it("shows an empty state", () => {
    cy.intercept("GET", "**/api/movies/search?query=Nothing", []).as("emptySearch");
    cy.get('input[placeholder="Search for a movie..."]').type("Nothing");
    cy.contains("button", "Search").click();
    cy.wait("@emptySearch");
    cy.contains("No movies matched your search.").should("be.visible");
  });

  it("shows an API error without breaking the page", () => {
    cy.intercept("GET", "**/api/movies/search?query=Broken", {
      statusCode: 502,
      body: { message: "Movie service is temporarily unavailable." },
    }).as("failedSearch");
    cy.get('input[placeholder="Search for a movie..."]').type("Broken");
    cy.contains("button", "Search").click();
    cy.wait("@failedSearch");
    cy.contains("Movie service is temporarily unavailable.").should("be.visible");
  });
});
