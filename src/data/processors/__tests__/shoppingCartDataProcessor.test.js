// __tests__/shoppingCartDataProcessor.test.js

/**
 * Test plan:
 * - getShoppingCartItems(): sets FETCHING, loads data, sets SYNCHED (or ERROR)
 * - selectors: getCartItemByArticleId/getCheckedItems/getUncheckedItems/isEmpty
 * - toggleChecked(): flips checked, calls update API, sets SYNCHED (or ERROR)
 * - deleteCartItem(): calls delete API, prunes state, sets SYNCHED (or ERROR)
 * - changeQuantity(): ignores falsy, otherwise PUT + mapped state + SYNCHED (or ERROR)
 * - addCartItem(): POST, triggers getShoppingCartItems(), returns true/false by result
 * - deleteAllCheckedItems/deleteAllUnCheckedItems(): calls respective API, refreshes list, handles errors
 */

const mockSynch = {
  FETCHING: "FETCHING",
  SENDING: "SENDING",
  SYNCHED: "SYNCHED",
  ERROR: "ERROR",
};

jest.mock("../../../constants/synchState", () => ({ synchState: mockSynch }));
jest.mock("../../../logger/logger", () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const mockGetCart = jest.fn();
const mockUpdateItem = jest.fn();
const mockDeleteItem = jest.fn();
const mockAddItem = jest.fn();
const mockDeleteChecked = jest.fn();
const mockDeleteUnchecked = jest.fn();

jest.mock("../../api/shoppingCartData", () => ({
  getShoppingCartData: (...a) => mockGetCart(...a),
  updateShoppingCartItem: (...a) => mockUpdateItem(...a),
  deleteShoppingCartItem: (...a) => mockDeleteItem(...a),
  addShoppingCartItem: (...a) => mockAddItem(...a),
  deleteCheckedItems: (...a) => mockDeleteChecked(...a),
  deleteUncheckedItems: (...a) => mockDeleteUnchecked(...a),
}));

// builder
const buildCartProcessor = (initial = []) => {
  let stateRef = initial.slice();
  const calls = { setState: [], setSync: [] };

  const mockSetState = (next) => {
    stateRef = typeof next === "function" ? next(stateRef) : next;
    calls.setState.push(stateRef);
    // we cannot assign to #state (private), so we won't try; we assert setter output instead
  };
  const mockSetSync = (val) => calls.setSync.push(val);

  const { ShoppingCartDataProcessor } = require("../shoppingCartDataProcessor");
  const instance = new ShoppingCartDataProcessor(
    stateRef,
    mockSetState,
    mockSynch,
    mockSetSync
  );
  return {
    instance,
    calls,
    get state() {
      return stateRef;
    },
  };
};

describe("ShoppingCartDataProcessor", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getShoppingCartItems: success", async () => {
    mockGetCart.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    const { instance, calls } = buildCartProcessor([{ id: 9 }]);

    await instance.getShoppingCartItems();
    await flush();

    expect(calls.setSync[0]).toBe(mockSynch.FETCHING);
    expect(calls.setState[calls.setState.length - 1]).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("getShoppingCartItems: error", async () => {
    mockGetCart.mockRejectedValueOnce(new Error("nope"));
    const { instance, calls } = buildCartProcessor();
    await instance.getShoppingCartItems();
    await flush();
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("selectors on initial state", async () => {
    const items = [
      { id: 1, article: { id: 10 }, checked: false, quantity: 1 },
      { id: 2, article: { id: 11 }, checked: true, quantity: 2 },
    ];
    const { instance } = buildCartProcessor(items);

    await expect(instance.getCartItemByArticleId(11)).resolves.toEqual(
      items[1]
    );
    expect(instance.getCheckedItems()).toEqual([items[1]]);
    expect(instance.getUncheckedItems()).toEqual([items[0]]);
    expect(instance.isEmpty()).toBe(false);
  });

  test("isEmpty true when no items", () => {
    const { instance } = buildCartProcessor([]);
    expect(instance.isEmpty()).toBe(true);
  });

  test("toggleChecked: success flips checked and sets SYNCHED", async () => {
    mockUpdateItem.mockResolvedValueOnce({ status: 200 });
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.toggleChecked(items[0]);
    await flush();

    expect(mockUpdateItem).toHaveBeenCalledWith(1, {
      quantity: 1,
      checked: true,
    });
    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([
      { id: 1, article: { id: 10 }, checked: true, quantity: 1 },
    ]);
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("toggleChecked: error -> ERROR", async () => {
    mockUpdateItem.mockRejectedValueOnce(new Error("x"));
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.toggleChecked(items[0]);
    await flush();

    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("deleteCartItem: success removes item, SYNCHED", async () => {
    mockDeleteItem.mockResolvedValueOnce({ status: 204 });
    const items = [
      { id: 1, article: { id: 10 }, checked: false, quantity: 1 },
      { id: 2, article: { id: 11 }, checked: true, quantity: 2 },
    ];
    const { instance, calls } = buildCartProcessor(items);

    await instance.deleteCartItem(items[0]);
    await flush();

    expect(mockDeleteItem).toHaveBeenCalledWith(1);
    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([items[1]]);
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("deleteCartItem: error -> ERROR", async () => {
    mockDeleteItem.mockRejectedValueOnce(new Error("no"));
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.deleteCartItem(items[0]);
    await flush();

    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("changeQuantity: ignores falsy values", async () => {
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.changeQuantity(items[0], 0);
    await instance.changeQuantity(items[0], undefined);
    await instance.changeQuantity(items[0], null);

    expect(mockUpdateItem).not.toHaveBeenCalled();
    expect(calls.setState.length).toBe(0);
  });

  test("changeQuantity: success updates quantity and sets SYNCHED", async () => {
    mockUpdateItem.mockResolvedValueOnce({ status: 200 });
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.changeQuantity(items[0], 5);
    await flush();

    expect(mockUpdateItem).toHaveBeenCalledWith(1, {
      quantity: 5,
      checked: false,
    });
    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([
      { id: 1, article: { id: 10 }, checked: false, quantity: 5 },
    ]);
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("changeQuantity: error -> ERROR", async () => {
    mockUpdateItem.mockRejectedValueOnce(new Error("nope"));
    const items = [{ id: 1, article: { id: 10 }, checked: false, quantity: 1 }];
    const { instance, calls } = buildCartProcessor(items);

    await instance.changeQuantity(items[0], 3);
    await flush();

    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("addCartItem: success returns true, refreshes items, sets SYNCHED", async () => {
    mockAddItem.mockResolvedValueOnce({ status: 201 });
    mockGetCart.mockResolvedValueOnce([{ id: 99 }]); // for the refresh call
    const { instance, calls } = buildCartProcessor([]);

    await expect(instance.addCartItem(10)).resolves.toBe(true);
    expect(mockAddItem).toHaveBeenCalledWith(10);
    // refresh called → FETCHING then SYNCHED later
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("addCartItem: error returns false, sets ERROR", async () => {
    mockAddItem.mockRejectedValueOnce(new Error("fail"));
    const { instance, calls } = buildCartProcessor([]);
    await expect(instance.addCartItem(10)).resolves.toBe(false);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("deleteAllCheckedItems: success refreshes list + SYNCHED", async () => {
    mockDeleteChecked.mockResolvedValueOnce({ status: 204 });
    mockGetCart.mockResolvedValueOnce([]); // for refresh
    const { instance, calls } = buildCartProcessor([{ id: 1 }]);

    await instance.deleteAllCheckedItems();
    expect(mockDeleteChecked).toHaveBeenCalled();
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("deleteAllCheckedItems: error -> ERROR", async () => {
    mockDeleteChecked.mockRejectedValueOnce(new Error("bad"));
    const { instance, calls } = buildCartProcessor([]);
    await instance.deleteAllCheckedItems();
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("deleteAllUnCheckedItems: success refreshes list + SYNCHED", async () => {
    mockDeleteUnchecked.mockResolvedValueOnce({ status: 204 });
    mockGetCart.mockResolvedValueOnce([]); // for refresh
    const { instance, calls } = buildCartProcessor([{ id: 1 }]);

    await instance.deleteAllUnCheckedItems();
    expect(mockDeleteUnchecked).toHaveBeenCalled();
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("deleteAllUnCheckedItems: error -> ERROR", async () => {
    mockDeleteUnchecked.mockRejectedValueOnce(new Error("bad"));
    const { instance, calls } = buildCartProcessor([]);
    await instance.deleteAllUnCheckedItems();
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });
});
