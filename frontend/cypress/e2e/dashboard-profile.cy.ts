/// <reference types="cypress" />

describe("Dashboard and profile", () => {
  beforeEach(() => {
    cy.mockDashboardApi();
  });

  it("renders dashboard progression, statistics, recommendations, and trending films", () => {
    cy.visitWithMockAuth("/");
    cy.wait(["@getProfile", "@getStats", "@getAchievements", "@getTrending", "@getRecommended"]);

    cy.contains("h1", "Cypress User").should("be.visible");
    cy.contains("40").should("be.visible");
    cy.contains("Films watched").should("be.visible");
    cy.contains("Recommended for you").should("be.visible");
    cy.contains("Trending this week").should("be.visible");
    cy.contains("Interstellar").should("be.visible");
    cy.contains("First Watch").should("be.visible");
  });

  it("renders profile stats, achievements, activity, and genre breakdown", () => {
    cy.visitWithMockAuth("/profile");
    cy.wait(["@getProfile", "@getStats", "@getAchievements"]);

    cy.contains("h1", "Cypress User").should("be.visible");
    cy.contains("Level Progression").should("be.visible");
    cy.contains("Your Stats").should("be.visible");
    cy.contains("Achievements").should("be.visible");
    cy.contains("Recent Activity").should("be.visible");
    cy.contains("Genre Breakdown").should("be.visible");
    cy.contains("Science Fiction").should("be.visible");
    cy.contains("2 XP to", { matchCase: false }).should("not.exist");
    cy.contains("60 XP to Film Fan").should("be.visible");
  });

  it("renders a safe empty dashboard when recommendations and trending fail", () => {
    cy.intercept("GET", "**/api/users/me", { fixture: "profile.json" });
    cy.intercept("GET", "**/api/users/me/stats", { fixture: "stats.json" });
    cy.intercept("GET", "**/api/achievements", []);
    cy.intercept("GET", "**/api/movies/trending", []);
    cy.intercept("GET", "**/api/movies/recommended", []);

    cy.visitWithMockAuth("/");
    cy.contains("Log a few movies and we'll start tailoring picks to you.").should("be.visible");
    cy.contains("Couldn't load trending movies right now.").should("be.visible");
  });
});
