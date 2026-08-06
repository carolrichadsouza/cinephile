/// <reference types="cypress" />

describe("Community reviews", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/movies/157336", { fixture: "movie-detail.json" });
    cy.intercept("GET", "**/api/watchlist", []);
    cy.intercept("GET", "**/api/logs", []);
  });

  it("shows two preview reviews and all reviews in a dialog", () => {
    cy.intercept("GET", "**/api/movies/157336/reviews", { fixture: "reviews.json" }).as("reviews");
    cy.visitWithMockAuth("/movies/157336");
    cy.wait("@reviews");

    cy.contains("3 reviews").should("be.visible");
    cy.contains("A beautiful and emotional science-fiction film.").should("be.visible");
    cy.contains("Excellent visuals and soundtrack.").should("be.visible");
    cy.contains("Long, but worth watching.").should("not.exist");

    cy.contains("button", "See all").click();
    cy.contains("All 3 reviews for this movie.").should("be.visible");
    cy.contains("Long, but worth watching.").should("be.visible");
  });

  it("shows the no-reviews state", () => {
    cy.intercept("GET", "**/api/movies/157336/reviews", []);
    cy.visitWithMockAuth("/movies/157336");
    cy.contains("No reviews yet.").should("be.visible");
  });

  it("falls back to no reviews when the request fails", () => {
    cy.intercept("GET", "**/api/movies/157336/reviews", { statusCode: 500 });
    cy.visitWithMockAuth("/movies/157336");
    cy.contains("No reviews yet.").should("be.visible");
  });
});
