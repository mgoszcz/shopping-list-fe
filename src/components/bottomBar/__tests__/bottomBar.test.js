// components/__tests__/BottomBar.test.jsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  logDOM,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomBar } from "../bottomBar";
import { act } from "react";

jest.mock("../../../data/api/shopsData", () => ({
  getShopsData: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Mock Shop" },
      { id: 2, name: "Another Shop" },
    ])
  ),
}));

jest.mock("../../../data/api/currentShopData", () => ({
  updateCurrentShop: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../../logger/logger", () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../../popups/confirmationPopup", () => ({
  ConfirmationPopup: () => <div data-testid="confirmation-popup" />,
}));

jest.mock("../../../popups/addShopPopup", () => () => (
  <div data-testid="add-shop-popup" />
));

jest.mock("../../../popups/categoryOrderPopup", () => () => (
  <div data-testid="category-order-popup" />
));

jest.mock("@mui/material/Autocomplete", () => {
  const Actual = jest.requireActual("@mui/material/Autocomplete");
  return function MockAutocomplete(props) {
    return (
      <Actual.default
        {...props}
        open={true} // force open
        onOpen={() => {}} // do nothing
        onClose={() => {}} // do nothing
      />
    );
  };
});

const mockProcessor = {
  getCheckedItems: jest.fn(() => []),
  getUncheckedItems: jest.fn(() => []),
  deleteAllCheckedItems: jest.fn(),
  deleteAllUnCheckedItems: jest.fn(),
  isEmpty: jest.fn(() => false),
};

beforeEach(() => {
  jest
    .spyOn(currentShopApi, "updateCurrentShop")
    .mockImplementation(() => Promise.resolve());
});

test("renders clear, edit, and category buttons", async () => {
  render(
    <BottomBar
      currentShop={{ shop_id: 1 }}
      setCurrentShop={jest.fn()}
      shopsTimestamp={0}
      shoppingCartProcessor={mockProcessor}
      shoppingCartSyncState={0}
      articlesSyncState={0}
    />
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /clear list/i })
    ).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /categories/i })
  ).toBeInTheDocument();
});

test("calls shoppingCartProcessor.deleteAllCheckedItems if items are checked", async () => {
  mockProcessor.getCheckedItems = jest.fn(() => [1, 2]);
  render(
    <BottomBar
      currentShop={{ shop_id: 1 }}
      setCurrentShop={jest.fn()}
      shopsTimestamp={0}
      shoppingCartProcessor={mockProcessor}
      shoppingCartSyncState={0}
      articlesSyncState={0}
    />
  );

  fireEvent.click(screen.getByRole("button", { name: /clear list/i }));

  await waitFor(() =>
    expect(mockProcessor.deleteAllCheckedItems).toHaveBeenCalled()
  );
});

test("selecting an autocomplete option updates current shop", async () => {
  const setCurrentShop = jest.fn();

  await act(async () => {
    render(
      <div>
        <BottomBar
          currentShop={{ shop_id: null }}
          setCurrentShop={setCurrentShop}
          shopsTimestamp={0}
          shoppingCartProcessor={{
            isEmpty: () => true,
            getCheckedItems: () => [],
            getUncheckedItems: () => [],
          }}
          shoppingCartSyncState={0}
          articlesSyncState={0}
          __testOverrideShops={[
            { id: 1, name: "Mock Shop", logo: "🛒" },
            { id: 2, name: "Other Shop", logo: "🏪" },
          ]}
        />
      </div>
    );
  });

  // Wait for shops to load and Autocomplete to render
  await waitFor(
    () => {
      expect(
        screen.getByRole("combobox", { name: /shop name/i })
      ).toBeInTheDocument();
    },
    { timeout: 5000 }
  );

  const input = screen.getByRole("combobox", { name: /shop name/i });

  // Simulate opening dropdown
  userEvent.click(input);

  // Wait for options to appear
  const listbox = await screen.findByRole("listbox");

  const option = await screen.findByTestId("option-1");
  expect(option).toBeInTheDocument();

  // Select the option
  userEvent.click(option);

  await waitFor(
    () => {
      expect(setCurrentShop).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Mock Shop",
          shop_id: 1,
        })
      );
    },
    { timeout: 5000 }
  );
}, 10000);
