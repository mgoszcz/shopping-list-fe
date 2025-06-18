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
import * as currentShopApi from "../../../data/api/currentShopData";
import { APP_VERSION } from "../../../constants/version";

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
  ConfirmationPopup: ({ onConfirm }) => (
    <div data-testid="confirmation-popup">
      <button data-testid="confirm-yes" onClick={onConfirm}>
        Yes
      </button>
    </div>
  ),
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
  await act(async () => {
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
  });

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

test("clear list calls shoppingCartProcessor.deleteAllCheckedItems if items are checked", async () => {
  mockProcessor.getCheckedItems = jest.fn(() => [1, 2]);
  await act(async () => {
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
  });

  fireEvent.click(screen.getByRole("button", { name: /clear list/i }));

  await waitFor(() =>
    expect(mockProcessor.deleteAllCheckedItems).toHaveBeenCalled()
  );
});

test("clear list opens confirmation dialog if items are unchecked", async () => {
  mockProcessor.getCheckedItems = jest.fn(() => []);
  await act(async () => {
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
  });

  fireEvent.click(screen.getByRole("button", { name: /clear list/i }));

  await waitFor(() => {
    expect(screen.getByTestId("confirmation-popup")).toBeInTheDocument();
  });

  // Click "Yes" inside the mock ConfirmationPopup
  const confirmButton = await screen.findByTestId("confirm-yes");
  await userEvent.click(confirmButton);

  // Assert deleteAllUnCheckedItems was called
  expect(mockProcessor.deleteAllUnCheckedItems).toHaveBeenCalled();
});

test("selecting add shop opens add shop dialog", async () => {
  await act(async () => {
    render(
      <BottomBar
        currentShop={{ shop_id: null }}
        setCurrentShop={jest.fn()}
        shopsTimestamp={0}
        shoppingCartProcessor={mockProcessor}
        shoppingCartSyncState={0}
        articlesSyncState={0}
        __testOverrideShops={[
          { id: 1, name: "Mock Shop", logo: "🛒" },
          { id: 2, name: "Other Shop", logo: "🏪" },
        ]}
      />
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
    () => expect(screen.getByTestId("add-shop-popup")).toBeInTheDocument(),
    { timeout: 5000 }
  );
});

test("CATEGORIES and EDIT buttons are disabled when no current shop is set", () => {
  render(
    <BottomBar
      currentShop={{ shop_id: null }}
      setCurrentShop={jest.fn()}
      shopsTimestamp={0}
      shoppingCartProcessor={mockProcessor}
      shoppingCartSyncState={0}
      articlesSyncState={0}
    />
  );

  const categoriesButton = screen.getByRole("button", { name: /categories/i });
  const editButton = screen.getByRole("button", { name: /edit/i });

  expect(categoriesButton).toBeDisabled();
  expect(editButton).toBeDisabled();
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

test("clicking EDIT button opens EditShopPopup", async () => {
  render(
    <BottomBar
      currentShop={{ shop_id: 1, name: "Mock Shop", logo: "🛒" }}
      setCurrentShop={jest.fn()}
      shopsTimestamp={0}
      shoppingCartProcessor={mockProcessor}
      shoppingCartSyncState={0}
      articlesSyncState={0}
      __testOverrideShops={[
        { id: 1, name: "Mock Shop", logo: "🛒" },
        { id: 2, name: "Other Shop", logo: "🏪" },
      ]}
    />
  );

  const editButton = screen.getByRole("button", { name: /edit/i });
  await userEvent.click(editButton);

  expect(screen.getByTestId("add-shop-popup")).toBeInTheDocument();
});

test("clicking CATEGORIES button opens CategoriesPopup", async () => {
  render(
    <BottomBar
      currentShop={{ shop_id: 1, name: "Shop", logo: "🛒" }}
      setCurrentShop={jest.fn()}
      shopsTimestamp={0}
      shoppingCartProcessor={mockProcessor}
      shoppingCartSyncState={0}
      articlesSyncState={0}
    />
  );

  const categoriesButton = screen.getByRole("button", { name: /categories/i });
  await userEvent.click(categoriesButton);

  expect(screen.getByTestId("category-order-popup")).toBeInTheDocument();
});

test("Proper label and version is displayed", async () => {
  await act(async () => {
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
  });

  expect(
    screen.getByText(`Shopping List version ${APP_VERSION}`)
  ).toBeInTheDocument();
});
