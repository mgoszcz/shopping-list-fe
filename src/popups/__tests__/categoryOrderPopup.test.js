// CategoryOrderPopup.test.jsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import CategoryOrderPopup from "../categoryOrderPopup";

// ---- Mocks for data/api ----
const mockGetCategoryOrderData = jest.fn();
const mockSetCategoryOrderData = jest.fn();

jest.mock("../../data/api/categoryOrderData", () => ({
  getCategoryOrderData: (...args) => mockGetCategoryOrderData(...args),
  setCategoryOrderData: (...args) => mockSetCategoryOrderData(...args),
}));

// ---- Simple, visible stubs for child components ----
jest.mock("../../components/progressOverlay", () => ({
  ProgressOverlay: ({ loading }) => (
    <div aria-label="progress-overlay">{loading ? "loading" : "idle"}</div>
  ),
}));

// CategorySelector exposes tiny controls to push categories & pick one
jest.mock("../../components/categorySelector", () => ({
  CategorySelector: ({
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          setCategories?.([
            { id: 10, name: "Bakery" },
            { id: 11, name: "Veggies" },
            { id: 12, name: "Drinks" },
          ])
        }
      >
        load-categories
      </button>
      <div aria-label="available-categories">
        {(categories || []).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory?.(c)}
          >
            pick-{c.name}
          </button>
        ))}
      </div>
      <div aria-label="selected-category">
        {selectedCategory?.name || "none"}
      </div>
    </div>
  ),
}));

// CategoryOrderListDnd shows the list and lets us flag changes
const mockDndUpdateSpy = jest.fn();
jest.mock("../../components/categoryOrderList/categoryOrderListDnd", () => ({
  __esModule: true,
  default: ({ orderList, setOrderList, setApplyDisabled }) => (
    <div>
      <ul aria-label="order-list">
        {orderList.map((i) => (
          <li key={i.id}>
            {i.title} (#{i.id})
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          // simulate any edit that should enable Apply
          setApplyDisabled?.(false);
          mockDndUpdateSpy();
        }}
      >
        mark-dirty
      </button>
      <button
        type="button"
        onClick={() => {
          // simulate reordering (swap first two items if possible)
          if (orderList.length > 1) {
            const clone = [...orderList];
            [clone[0], clone[1]] = [clone[1], clone[0]];
            setOrderList?.(clone);
            setApplyDisabled?.(false);
          }
        }}
      >
        swap-first-two
      </button>
    </div>
  ),
}));

// ---- Utility mock ----
jest.mock("../../utils/isObjectEmpty", () => ({
  isObjectEmpty: (obj) =>
    obj == null || (typeof obj === "object" && Object.keys(obj).length === 0),
}));

// ---- Make useMediaQuery stable in tests ----
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: () => false, // pretend "desktop"
  };
});

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

const baseShop = { shop_id: 1, name: "Local Market" };

describe("CategoryOrderPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads data on open and renders sorted order list", async () => {
    // API returns UNSORTED items; component should sort by category_order asc
    mockGetCategoryOrderData.mockResolvedValueOnce([
      {
        category: { id: 2, name: "Fruit" },
        category_order: 2,
      },
      {
        category: { id: 1, name: "Dairy" },
        category_order: 1,
      },
    ]);

    const setOpen = jest.fn();
    renderWithTheme(
      <CategoryOrderPopup
        open
        setOpen={setOpen}
        shop={baseShop}
        shoppingCartProcessor={{ getShoppingCartItems: jest.fn() }}
      />
    );

    // loading overlay is shown first
    expect(screen.getByLabelText("progress-overlay")).toHaveTextContent(
      "loading"
    );

    // wait for fetch to finish and list to appear
    const list = await screen.findByLabelText("order-list");
    const items = await within(list).findAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      "Dairy (#1)",
      "Fruit (#2)",
    ]);

    // overlay becomes idle
    expect(screen.getByLabelText("progress-overlay")).toHaveTextContent("idle");

    // dialog title contains shop name
    expect(
      screen.getByText(/Set Category Order for shop Local Market/i)
    ).toBeInTheDocument();
  });

  test("enables Add only when a category is selected, then adds it and enables Apply", async () => {
    mockGetCategoryOrderData.mockResolvedValueOnce([]); // start empty

    const setOpen = jest.fn();
    renderWithTheme(
      <CategoryOrderPopup
        open
        setOpen={setOpen}
        shop={baseShop}
        shoppingCartProcessor={{ getShoppingCartItems: jest.fn() }}
      />
    );

    // Initially, Apply is disabled (no changes yet)
    const applyBtn = await screen.findByRole("button", { name: /apply/i });
    expect(applyBtn).toBeDisabled();

    // Add button is disabled until we pick something
    const addBtn = screen.getByRole("button", { name: "" }); // the IconButton has no accessible name
    expect(addBtn).toBeDisabled();

    // Load categories in the stub and pick "Bakery"
    await userEvent.click(
      screen.getByRole("button", { name: /load-categories/i })
    );
    await userEvent.click(screen.getByRole("button", { name: /pick-Bakery/i }));

    // Now Add should enable
    expect(addBtn).toBeEnabled();

    // Add it -> list shows Bakery, Apply becomes enabled
    await userEvent.click(addBtn);
    const list = screen.getByLabelText("order-list");
    expect(within(list).getByText(/Bakery \(#10\)/)).toBeInTheDocument();
    expect(applyBtn).toBeEnabled();
  });

  test("Apply sends correct payload, refreshes cart and closes dialog", async () => {
    mockGetCategoryOrderData.mockResolvedValueOnce([
      {
        category: { id: 5, name: "Meat" },
        category_order: 2,
      },
      {
        category: { id: 3, name: "Bread" },
        category_order: 1,
      },
    ]);

    mockSetCategoryOrderData.mockResolvedValueOnce(undefined);

    const setOpen = jest.fn();
    const cartSpy = jest.fn();

    renderWithTheme(
      <CategoryOrderPopup
        open
        setOpen={setOpen}
        shop={baseShop}
        shoppingCartProcessor={{ getShoppingCartItems: cartSpy }}
      />
    );

    // Wait for initial list
    await screen.findByText(/Bread \(#3\)/);

    // Simulate any change to enable Apply (via DnD stub)
    await userEvent.click(screen.getByRole("button", { name: /mark-dirty/i }));

    // Click Apply
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    expect(applyBtn).toBeEnabled();
    await userEvent.click(applyBtn);

    // Assert API called with re-numbered order (based on *current* list in the UI)
    // After initial sort we had: Bread (#3) then Meat (#5) -> indices 1..n
    await waitFor(() => {
      expect(mockSetCategoryOrderData).toHaveBeenCalledTimes(1);
    });

    const [calledShopId, calledOrder] = mockSetCategoryOrderData.mock.calls[0];
    expect(calledShopId).toBe(1);
    expect(calledOrder).toEqual([
      { category: { id: 3, name: "Bread" }, category_order: 1 },
      { category: { id: 5, name: "Meat" }, category_order: 2 },
    ]);

    // Cart refresh and dialog close
    expect(cartSpy).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test("Cancel closes the dialog without saving", async () => {
    mockGetCategoryOrderData.mockResolvedValueOnce([]);

    const setOpen = jest.fn();
    renderWithTheme(
      <CategoryOrderPopup
        open
        setOpen={setOpen}
        shop={baseShop}
        shoppingCartProcessor={{ getShoppingCartItems: jest.fn() }}
      />
    );

    await screen.findByLabelText("order-list"); // wait rendered
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(setOpen).toHaveBeenCalledWith(false);
    expect(mockSetCategoryOrderData).not.toHaveBeenCalled();
  });

  test("Reordering via DnD stub updates UI order and enables Apply", async () => {
    mockGetCategoryOrderData.mockResolvedValueOnce([
      { category: { id: 1, name: "A" }, category_order: 1 },
      { category: { id: 2, name: "B" }, category_order: 2 },
    ]);

    renderWithTheme(
      <CategoryOrderPopup
        open
        setOpen={jest.fn()}
        shop={baseShop}
        shoppingCartProcessor={{ getShoppingCartItems: jest.fn() }}
      />
    );

    await screen.findByText(/A \(#1\)/);
    const list = screen.getByLabelText("order-list");
    const before = within(list)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(before).toEqual(["A (#1)", "B (#2)"]);

    // Use stub's "swap" to reorder
    await userEvent.click(
      screen.getByRole("button", { name: /swap-first-two/i })
    );
    const after = within(list)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(after).toEqual(["B (#2)", "A (#1)"]);

    // Apply should be enabled now
    expect(screen.getByRole("button", { name: /apply/i })).toBeEnabled();
    expect(mockDndUpdateSpy).not.toHaveBeenCalled(); // we didn't click mark-dirty in this test
  });
});
