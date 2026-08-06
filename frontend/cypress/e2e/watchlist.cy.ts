/// <reference types="cypress" />

const item = {
  watchlistId: 10,
  movieId: 1,
  tmdbId: 157336,
  title: "Interstellar",
  posterUrl: null,
  releaseDate: "2014-11-05",
  genres: ["Science Fiction"],
  addedAt: "2026-08-06T00:00:00Z",
};

describe("Watchlist", () => {
  it("adds a movie from its detail page and then removes it", () => {
    let watchlist: typeof item[] = [];

    cy.intercept("GET", "**/api/movies/157336", { fixture: "movie-detail.json" });
    cy.intercept("GET", "**/api/logs", []);
    cy.intercept("GET", "**/api/movies/157336/reviews", []);
    cy.intercept("GET", "**/api/watchlist", (req) => req.reply(watchlist)).as("getWatchlist");
    cy.intercept("POST", "**/api/watchlist", (req) => {
      expect(req.body).to.deep.equal({ tmdbId: 157336 });
      watchlist = [item];
      req.reply({
        statusCode: 201,
        body: {
          item,
          gamification: {
            pointsAwarded: 5,
            leveledUp: false,
            newLevelName: null,
            unlockedAchievements: [],
          },
        },
      });
    }).as("addWatchlist");
    cy.intercept("DELETE", "**/api/watchlist/157336", (req) => {
      watchlist = [];
      req.reply({ statusCode: 204 });
    }).as("removeWatchlist");

    cy.visitWithMockAuth("/movies/157336");
    cy.contains("button", "Add to Watchlist").click();
    cy.wait("@addWatchlist");
    cy.contains("button", "Remove from Watchlist").should("be.visible");
    cy.contains("+5 XP").should("be.visible");

    cy.contains("button", "Remove from Watchlist").click();
    cy.wait("@removeWatchlist");
    cy.contains("button", "Add to Watchlist").should("be.visible");
  });

  it("renders the watchlist, opens details, and removes an item", () => {
    cy.intercept("GET", "**/api/watchlist", [item]).as("getWatchlist");
    cy.intercept("DELETE", "**/api/watchlist/157336", { statusCode: 204 }).as("remove");
    cy.visitWithMockAuth("/watchlist");

    cy.contains("1 movie waiting for the perfect night.").should("be.visible");
    cy.contains("Interstellar").should("be.visible");
    cy.get('button[aria-label="Remove from watchlist"]').click();
    cy.wait("@remove");
    cy.contains("Nothing here yet!").should("be.visible");
  });

  it("shows the empty and error states", () => {
    cy.intercept("GET", "**/api/watchlist", []).as("empty");
    cy.visitWithMockAuth("/watchlist");
    cy.contains("Nothing here yet!").should("be.visible");

    cy.intercept("GET", "**/api/watchlist", { statusCode: 500, body: { message: "Failed" } });
    cy.reload();
    cy.contains("Failed").should("be.visible");
  });
});
