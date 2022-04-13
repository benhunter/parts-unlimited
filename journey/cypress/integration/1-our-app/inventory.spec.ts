const addProduct = (product: string) => {
  cy.findByLabelText("Product to add").type(product);
  cy.findByRole("button").click();
}

describe("inventory", () => {
  describe("when adding a product offering", () => {
    it("should display the new product with a default quantity of 0", () => {
      cy.visit("http://localhost:8080");
      addProduct("shiny-new-product");
      cy.findAllByText("shiny-new-product").should("have.length.at.least", 1);
      // cy.findByText("shiny-new-product").should("exist");
      cy.findAllByText("0").should("have.length.at.least", 1);
      // cy.findByText("0").should("exist");
    });
  });

  describe("when increasing inventory for a product", () => {
    it("should display the updated quantity for the product", () => {
      // Given
      cy.visit("http://localhost:8080");

      // When
      cy.findByRole("combobox").select("new-product");
      cy.findByRole("textbox", {name: /quantity/i}).type("1");
      cy.findByRole("button", {name: /add/i}).click();

      // Then
      cy.findByText("1").should("exist");
    })
  })
});
