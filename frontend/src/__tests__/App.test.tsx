import React from "react";
import {render, screen, within} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {createProduct, getProducts} from "../productsApiClient";

jest.mock("../productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

const addProduct = (product: string) => {
  userEvent.type(screen.getByLabelText("Product to add"), product);
  userEvent.click(screen.getByRole("button", {name: /submit/i}));
}

describe("inventory", () => {
  describe("when I view the inventory", () => {
    it("should display the products", async () => {
      mockGetProducts.mockResolvedValue([{name: "a product", quantity: 0}]);

      render(<App/>);

      expect(screen.getByText("Parts Unlimited Inventory")).toBeInTheDocument();
      expect(screen.getByText("Product")).toBeInTheDocument();

      const table = await screen.findByRole("table", {});
      expect(table).toBeInTheDocument();
      expect(within(table).getByText("a product")).toBeInTheDocument();
    });

    it("should display the products' quantities", async () => {
      mockGetProducts.mockResolvedValue([{name: "a product", quantity: 0}]);

      render(<App/>);

      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(await screen.findByText("0")).toBeInTheDocument();
    });
  });

  describe("when I add a new product", () => {
    it("should display the new product", async () => {
      mockCreateProduct.mockResolvedValueOnce({name: "shiny new product", quantity: 0});
      mockGetProducts.mockResolvedValueOnce([]);
      mockGetProducts.mockResolvedValueOnce([{name: "shiny new product", quantity: 0}]);

      render(<App/>);
      addProduct("shiny new product");

      expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product");

      const table = await screen.findByRole("table")
      expect(table).toBeInTheDocument();
      expect(within(table).getByText("shiny new product")).toBeInTheDocument();
    });
  });

  describe("when I increase a product quantity", () => {
    it("should display the updated quantity", async () => {
      let newQuantity = 1;
      const productName = "shiny new product";

      // Make a product
      mockGetProducts.mockResolvedValueOnce([{name: productName, quantity: 0}]);

      render(<App/>);

      // Update the quantity
      userEvent.selectOptions(await screen.findByRole("combobox"), productName);
      userEvent.type(screen.getByRole("textbox"), newQuantity.toString());
      userEvent.click(screen.getByRole("button", {name: "Add"}));

      // Assert the update
      expect(await screen.findByText(newQuantity)).toBeInTheDocument();

    })
  })
});
