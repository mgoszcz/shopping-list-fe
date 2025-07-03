// __tests__/addShopPopup.test.js

jest.mock("../../data/api/currentShopData", () => ({
  updateCurrentShop: jest.fn(() =>
    Promise.resolve({ shop_id: 1, name: "Current Shop", logo: "🛍️" })
  ),
}));

// jest.mock("axios");

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddShopPopup from "../addShopPopup";
jest.mock("../../data/api/shopsData", () => ({
  createShop: jest.fn(() =>
    Promise.resolve({
      data: { shop_id: 123, name: "New Shop", logo: "logo" },
    })
  ),
}));

import { createShop } from "../../data/api/shopsData";
import { updateCurrentShop } from "../../data/api/currentShopData";

const mockedShops = [
  { id: 1, name: "Current Shop", logo: "🛍️" },
  { id: 2, name: "Shop", logo: "🛍️" },
];

console.log("🧪 mock createShop:", createShop.mock);
describe("AddShopPopup", () => {
  const mockSetOpen = jest.fn();
  const mockSetShops = jest.fn();
  const mockSetCurrentShop = jest.fn();

  test("renders input and saves shop", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
      />
    );

    console.log("✅ mock response:", await createShop());

    await act(async () => {
      const response = await createShop({ name: "Test", logo: "logo" });
      console.log("✅ mock response:", response);
    });

    await act(async () => {
      const response = await updateCurrentShop({ name: "Test", logo: "logo" });
      console.log("✅ mock response update:", response);
    });

    const input = screen.getByLabelText(/shop name/i);
    fireEvent.change(input, { target: { value: "New Shop" } });

    const saveButton = screen.getByText("Apply");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(createShop).toHaveBeenCalledWith({
        name: "New Shop",
        logo: "logo",
      });
      console.log(mockSetCurrentShop.mock.calls);
      expect(mockSetCurrentShop).toHaveBeenCalledWith({
        name: "New Shop",
        logo: "logo",
        shop_id: 123,
      });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
