// __tests__/addShopPopup.test.js

jest.mock("../../data/api/currentShopData", () => ({
  updateCurrentShop: jest.fn(() =>
    Promise.resolve({ shop_id: 1, name: "Current Shop", logo: "🛍️" })
  ),
}));

jest.mock("../../data/api/shopsData", () => ({
  createShop: jest.fn(() =>
    Promise.resolve({
      data: { id: 123, name: "New Shop", logo: "logo" },
    })
  ),
}));

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AddShopPopup from "../addShopPopup";
import { createShop } from "../../data/api/shopsData";
import { updateCurrentShop } from "../../data/api/currentShopData";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  jest.clearAllMocks();

  createShop.mockResolvedValue({
    data: { id: 123, name: "New Shop", logo: "logo" },
  });
  updateCurrentShop.mockResolvedValue({
    shop_id: 1,
    name: "Current Shop",
    logo: "🛍️",
  });
});

const mockedShops = [
  { id: 1, name: "Current Shop", logo: "🛍️" },
  { id: 2, name: "Shop", logo: "🛍️" },
];

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
      expect(mockSetCurrentShop).toHaveBeenCalledWith({
        name: "New Shop",
        logo: "logo",
        shop_id: 123,
      });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("Displays error when trying to add shop with the same name", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
      />
    );

    const input = screen.getByLabelText(/shop name/i);
    fireEvent.change(input, { target: { value: "Shop" } });

    const error = screen.getByTestId("addShopError");
    const applyButton = screen.getByText("Apply");
    await waitFor(() => {
      expect(error).toHaveTextContent('Shop with name "Shop" already exists');
      expect(error).toBeVisible();
      expect(applyButton).toBeDisabled();
    });
  });

  test("Disables apply button when no shop name is provided and shows message when applicable", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
      />
    );

    const input = screen.getByLabelText(/shop name/i);
    const error = screen.getByTestId("addShopError");
    const applyButton = screen.getByText("Apply");

    expect(applyButton).toBeDisabled();
    fireEvent.change(input, { target: { value: "Shop" } });
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(error).toHaveTextContent("Shop name cannot be empty");
      expect(error).toBeVisible();
      expect(applyButton).toBeDisabled();
    });
  });

  test("Add Shop is displayed and remove shop button is hidden", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
      />
    );
    const header = screen.getByTestId("add-edit-shop-dialog");
    const removeShopButton = screen.getByTestId("remove-shop-button");

    await waitFor(() => {
      expect(header).toHaveTextContent("Add Shop");
      expect(removeShopButton).not.toBeVisible();
    });
  });

  test("Cancel button closes dialog", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
