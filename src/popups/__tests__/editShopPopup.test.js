// __tests__/addShopPopup.test.js

jest.mock("../../data/api/currentShopData", () => ({
  updateCurrentShop: jest.fn(() =>
    Promise.resolve({ shop_id: 1, name: "edited shop", logo: "logo" })
  ),
}));

jest.mock("../../data/api/shopsData", () => ({
  createShop: jest.fn(() =>
    Promise.resolve({
      data: { id: 123, name: "New Shop", logo: "logo" },
    })
  ),
  updateShop: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: "edited shop", logo: "logo" },
    })
  ),
  deleteShop: jest.fn(() => Promise.resolve()),
}));

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AddShopPopup from "../addShopPopup";
import { createShop, deleteShop, updateShop } from "../../data/api/shopsData";
import { updateCurrentShop } from "../../data/api/currentShopData";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  jest.clearAllMocks();

  createShop.mockResolvedValue({
    data: { id: 123, name: "New Shop", logo: "logo" },
  });
  updateCurrentShop.mockResolvedValue({
    shop_id: 1,
    name: "edited shop",
    logo: "logo",
  });
});

const mockedShops = [
  { id: 1, name: "Current Shop", logo: "logo" },
  { id: 2, name: "Shop", logo: "logo" },
];

describe("EditShopPopup", () => {
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
        editingShop={mockedShops[0]}
      />
    );

    const input = screen.getByLabelText(/shop name/i);

    await waitFor(() => {
      expect(input).toHaveValue(mockedShops[0].name);
    });

    await userEvent.clear(input);
    await userEvent.type(input, "edited shop");

    const saveButton = screen.getByText("Apply");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(updateShop).toHaveBeenCalledWith(1, {
        name: "edited shop",
        logo: "logo",
      });
      expect(mockSetCurrentShop).toHaveBeenCalledWith({
        name: "edited shop",
        logo: "logo",
        shop_id: 1,
      });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("Displays error when trying to change name to already existing shop", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
        editingShop={mockedShops[0]}
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

  test("Disables apply button when no shop name is provided or name is the same as editing shop and shows message when applicable", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
        editingShop={mockedShops[0]}
      />
    );

    const input = screen.getByLabelText(/shop name/i);
    const error = screen.getByTestId("addShopError");
    const applyButton = screen.getByText("Apply");

    expect(applyButton).toBeDisabled();
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(error).toHaveTextContent("Shop name cannot be empty");
      expect(error).toBeVisible();
      expect(applyButton).toBeDisabled();
    });

    fireEvent.change(input, { target: { value: mockedShops[0].name } });

    await waitFor(() => {
      expect(applyButton).toBeDisabled();
    });
  });

  test("Edit Shop is displayed and remove shop button is visible and enabled", async () => {
    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
        editingShop={mockedShops[0]}
      />
    );
    const header = screen.getByTestId("add-edit-shop-dialog");
    const removeShopButton = screen.getByTestId("remove-shop-button");

    await waitFor(() => {
      expect(header).toHaveTextContent("Edit Shop " + mockedShops[0].name);
      expect(removeShopButton).toBeVisible();
      expect(removeShopButton).toBeEnabled();
    });
  });

  test("remove shop button removes shop", async () => {
    deleteShop.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();

    render(
      <AddShopPopup
        open={true}
        setOpen={mockSetOpen}
        setShops={mockSetShops}
        setCurrentShop={mockSetCurrentShop}
        shops={mockedShops}
        editingShop={mockedShops[0]}
      />
    );

    const removeShopButton = screen.getByTestId("remove-shop-button");
    await user.click(removeShopButton);

    await waitFor(() => {
      expect(screen.getByTestId("confirm-remove-shop")).toBeVisible();
    });

    const confirmButton = screen.getByTestId("confirm-remove-shop");
    await user.click(confirmButton);

    await waitFor(() => {
      expect(deleteShop).toHaveBeenCalledWith(1);
      expect(mockSetCurrentShop).toHaveBeenCalledWith({
        name: null,
        logo: null,
        shop_id: null,
      });
      expect(mockSetOpen).toHaveBeenCalledWith(false);
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
        editingShop={mockedShops[0]}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
