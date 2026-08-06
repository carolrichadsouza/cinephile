/// <reference types="cypress" />

const today = new Date();

const isoDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const createdLog = {
  logId: 25,
  movieId: 1,
  tmdbId: 157336,
  title: "Interstellar",
  posterUrl: null,
  watchedDate: `${isoDate}T00:00:00Z`,
  rating: 4,
  review: "A brilliant journey through space and time.",
  createdAt: "2026-08-06T00:00:00Z",
};

function mockMoviePage(initialLogs: unknown[] = []) {
  cy.intercept("GET", "**/api/movies/157336", {
    fixture: "movie-detail.json",
  });

  cy.intercept("GET", "**/api/watchlist", []);

  cy.intercept("GET", "**/api/logs", initialLogs).as("getLogs");

  cy.intercept("GET", "**/api/movies/157336/reviews", []);
}

function clickRatingStar(starIndex: number) {
  cy.get('[role="dialog"]')
    .find('[data-slot="rating-star-empty"]')
    .eq(starIndex)
    .closest("div.relative")
    .click("right");
}

describe("Journal entries and gamification", () => {
  it("creates a journal entry with rating and review", () => {
    mockMoviePage();

    cy.intercept("POST", "**/api/logs", (req) => {
      expect(req.body.tmdbId).to.eq(157336);
      expect(req.body.rating).to.eq(4);
      expect(req.body.review).to.eq(
        "A brilliant journey through space and time.",
      );

      req.reply({
        statusCode: 201,
        body: {
          log: createdLog,
          gamification: {
            pointsAwarded: 30,
            leveledUp: true,
            newLevelName: "Film Fan",
            unlockedAchievements: [
              {
                code: "FIRST_WATCH",
                name: "First Watch",
                details: "Log your first movie",
                points: 10,
              },
            ],
          },
        },
      });
    }).as("createLog");

    cy.visitWithMockAuth("/movies/157336");

    cy.contains("button", "Journal Entry")
      .should("be.visible")
      .click();

    cy.contains("Create journal entry")
      .should("be.visible");

    clickRatingStar(3);

    cy.contains("4 out of 5 stars")
      .should("be.visible");

    cy.get('textarea[placeholder="What did you think?"]')
      .type(createdLog.review);

    cy.contains("button", "Save entry")
      .should("be.visible")
      .click();

    cy.wait("@createLog");

cy.get("body", { timeout: 10000 }).should(($body) => {
  expect($body.text()).to.include(
    "Achievement unlocked: First Watch",
  );

  expect($body.text()).to.include(
    "Level up! You're now Film Fan",
  );

  expect($body.text()).to.include(
    "+30 XP",
  );
});


    cy.contains("button", "Edit Log")
      .should("be.visible");

    cy.contains(createdLog.review)
      .should("be.visible");
  });


  it("quick-logs a movie as watched", () => {
    mockMoviePage();

    cy.intercept("POST", "**/api/logs", {
      statusCode: 201,
      body: {
        log: {
          ...createdLog,
          rating: null,
          review: null,
        },
        gamification: {
          pointsAwarded: 10,
          leveledUp: false,
          newLevelName: null,
          unlockedAchievements: [],
        },
      },
    }).as("quickLog");

    cy.visitWithMockAuth("/movies/157336");

    cy.contains("button", "Mark as Watched")
      .should("be.visible")
      .click();

    cy.wait("@quickLog")
      .its("request.body")
      .should("deep.include", {
        tmdbId: 157336,
        rating: null,
        review: null,
      });

    cy.contains("button", "Watched")
      .should("be.disabled");

    cy.contains("+10 XP")
      .should("be.visible");
  });


  it("edits an existing log", () => {
    mockMoviePage([createdLog]);

    cy.intercept("PUT", "**/api/logs/25", (req) => {
      expect(req.body.rating).to.eq(5);
      expect(req.body.review).to.eq("Updated review");

      req.reply({
        ...createdLog,
        rating: 5,
        review: "Updated review",
      });
    }).as("updateLog");

    cy.visitWithMockAuth("/movies/157336");

    cy.contains("button", "Edit Log")
      .should("be.visible")
      .click();

    cy.get('textarea[placeholder="What did you think?"]')
      .clear()
      .type("Updated review");

    clickRatingStar(4);

    cy.contains("5 out of 5 stars")
      .should("be.visible");

    cy.contains("button", "Save entry")
      .click();

    cy.wait("@updateLog");

    cy.contains("Updated review")
      .should("be.visible");
  });


  it("deletes an existing log", () => {
    mockMoviePage([createdLog]);

    cy.intercept("DELETE", "**/api/logs/25", {
      statusCode: 204,
    }).as("deleteLog");

    cy.visitWithMockAuth("/movies/157336");

    cy.contains("button", "Edit Log")
      .click();

    cy.contains("button", "Delete log")
      .click();

    cy.wait("@deleteLog");

    cy.contains("button", "Journal Entry")
      .should("be.visible");

    cy.contains(createdLog.review)
      .should("not.exist");
  });


  it("shows a save error and leaves the dialog open", () => {
    mockMoviePage();

    cy.intercept("POST", "**/api/logs", {
      statusCode: 400,
      body: {
        message: "The log could not be saved.",
      },
    }).as("failedLog");

    cy.visitWithMockAuth("/movies/157336");

    cy.contains("button", "Journal Entry")
      .click();

    cy.contains("button", "Save entry")
      .click();

    cy.wait("@failedLog");

    cy.get('[role="dialog"]')
      .contains("The log could not be saved.")
      .should("be.visible");

    cy.contains("Create journal entry")
      .should("be.visible");
  });
});
