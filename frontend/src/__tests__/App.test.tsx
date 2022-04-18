import React from "react";
import {render, screen, within} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {createProduct, getProducts, updateProduct} from "../productsApiClient";

jest.mock("../productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;
const mockUpdateProduct = updateProduct as jest.MockedFunction<typeof updateProduct>;

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

      const table = await screen.findByRole("table");
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
      mockGetProducts.mockResolvedValueOnce([]);
      render(<App/>);
      mockCreateProduct.mockResolvedValueOnce({name: "shiny new product", quantity: 0});
      mockGetProducts.mockResolvedValueOnce([{name: "shiny new product", quantity: 0}]);
      addProduct("shiny new product");

      expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product");

      const table = await screen.findByRole("table")
      expect(table).toBeInTheDocument();
      expect(within(table).getByText("shiny new product")).toBeInTheDocument();
    });
  });

  describe("when I increase a product quantity", () => {
    it("should display the updated quantity", async () => {
      const startingQuantity = 0;
      const additionalQuantity = 2;
      const finalQuantity = 2;
      const productName = "shiny new product";

      mockGetProducts.mockResolvedValueOnce([{name: productName, quantity: startingQuantity}]);
      mockUpdateProduct.mockResolvedValueOnce({name: productName, quantity: finalQuantity})
      mockGetProducts.mockResolvedValueOnce([{name: productName, quantity: finalQuantity}]);

      render(<App/>);

      userEvent.selectOptions(await screen.findByRole("combobox"), productName);
      userEvent.type(screen.getByRole("textbox", {name: "Quantity to add"}), additionalQuantity.toString());
      userEvent.click(screen.getByRole("button", {name: "Add"}));

      expect(await screen.findByText(finalQuantity)).toBeInTheDocument();

    })
  })

  describe("when I try to increase the product quantity by something other than a number", () => {
    it('should not change the quantity', async () => {
      const quantity = 1;
      // mock getProducts with an existing product
      // select option for the existing product
      // type nonsense in quantity
      // click
      // expect updateProducts not to have been called
      expect(await screen.findByText(quantity)).toBeInTheDocument();
    });

  });

  // TODO "Add quantity should not render if there are no products in the inventory"
});
