/// <reference types="cypress" />

describe("Navigation, theme, and responsive layout", () => {
  beforeEach(() => {
    cy.mockDashboardApi();
    cy.intercept("GET", "**/api/watchlist", []);
  });

  it("navigates through desktop links", () => {
    cy.visitWithMockAuth("/");
    cy.contains("nav a", "Search").click();
    cy.url().should("include", "/search");
    cy.contains("h1", "Discover Films").should("be.visible");

    cy.contains("nav a", "Watchlist").click();
    cy.url().should("include", "/watchlist");
    cy.contains("h1", "Your Watchlist").should("be.visible");
  });

  it("toggles theme and persists it after reload", () => {
    cy.visitWithMockAuth("/");
    cy.get("html").invoke("attr", "class").then((initialClass) => {
      cy.get('button:has(.sr-only)').filter(":visible").first().click();
      cy.get("html").should(($html) => {
        expect($html.attr("class")).not.to.eq(initialClass);
      });
    });
    cy.window()
      .its("localStorage")
      .invoke("getItem", "vite-ui-theme")
      .then((savedTheme) => {
        expect(savedTheme).to.match(/light|dark/);

        cy.get("html")
          .should("have.class", savedTheme!);
    });
  });

  it("uses the mobile navigation menu", () => {
    cy.viewport("iphone-x");
    cy.visitWithMockAuth("/");
    cy.get("header button").filter(":visible").first().click();
    cy.get('[role="dialog"]')
      .contains("a", "Search")
      .click();
    cy.url().should("include", "/search");
    cy.contains("h1", "Discover Films").should("be.visible");
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1);
    });
  });
});
