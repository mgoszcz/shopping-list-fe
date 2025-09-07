// __tests__/shoppingArticlesProcessor.test.js

/**
 * Test plan:
 * - getShoppingArticlesData(): sets [], sets FETCHING, calls getArticles(), on success sets data + SYNCHED, on fail sets ERROR
 * - getArticleById(): delegates to API
 * - editArticle(): sets SENDING, calls updateArticle, maps state, refreshes cart, sets SYNCHED (or ERROR)
 * - createArticle(): sets SENDING, posts, appends to state, optionally calls addCartItem(), sets SYNCHED
 * - removeArticle(): if cart item exists -> delete it; then deleteArticle(); prunes state; sets SYNCHED (or ERROR)
 */

const mockSynch = {
  FETCHING: "FETCHING",
  SENDING: "SENDING",
  SYNCHED: "SYNCHED",
  ERROR: "ERROR",
};

// ---- Mocks
jest.mock("../../../constants/synchState", () => ({ synchState: mockSynch }));
jest.mock("../../../logger/logger", () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const mockGetArticles = jest.fn();
const mockGetArticleById = jest.fn();
const mockCreateArticle = jest.fn();
const mockUpdateArticle = jest.fn();
const mockDeleteArticle = jest.fn();

jest.mock("../../api/articlesData", () => ({
  getArticles: (...a) => mockGetArticles(...a),
  getArticleById: (...a) => mockGetArticleById(...a),
  createArticle: (...a) => mockCreateArticle(...a),
  updateArticle: (...a) => mockUpdateArticle(...a),
  deleteArticle: (...a) => mockDeleteArticle(...a),
}));

// Helper to build the processor with controlled state/setters
const buildArticlesProcessor = (initial = [], cartProcessorOverrides = {}) => {
  let stateRef = initial.slice();
  const calls = { setState: [], setSync: [] };

  const mockSetState = (next) => {
    stateRef = typeof next === "function" ? next(stateRef) : next;
    calls.setState.push(stateRef);
    // mirror into instance.state so methods that read it see latest
    if (instance) instance.state = stateRef;
  };
  const mockSetSync = (val) => calls.setSync.push(val);

  const mockCartProc = {
    getShoppingCartItems: jest.fn(),
    addCartItem: jest.fn().mockResolvedValue(true),
    getCartItemByArticleId: jest.fn(),
    deleteCartItem: jest.fn(),
    ...cartProcessorOverrides,
  };

  // require after mocks
  const { ShoppingArticlesProcessor } = require("../shoppingArticlesProcessor");

  const instance = new ShoppingArticlesProcessor(
    stateRef,
    mockSetState,
    mockCartProc,
    mockSynch,
    mockSetSync
  );
  // link back the initial state mirror
  instance.state = stateRef;

  return {
    instance,
    calls,
    mockCartProc,
    get state() {
      return stateRef;
    },
  };
};

describe("ShoppingArticlesProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getShoppingArticlesData: success flow", async () => {
    mockGetArticles.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    const { instance, calls } = buildArticlesProcessor([{ id: 9 }]);

    await instance.getShoppingArticlesData();

    // First clears list + sets FETCHING
    expect(calls.setState[0]).toEqual([]); // cleared
    expect(calls.setSync[0]).toBe(mockSynch.FETCHING);

    // After API resolves, sets data + SYNCHED
    expect(calls.setState[calls.setState.length - 1]).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("getShoppingArticlesData: error flow", async () => {
    mockGetArticles.mockRejectedValueOnce(new Error("boom"));
    const { instance, calls } = buildArticlesProcessor();

    await instance.getShoppingArticlesData();
    await flush();

    expect(calls.setSync[0]).toBe(mockSynch.FETCHING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("getArticleById delegates to API", async () => {
    mockGetArticleById.mockResolvedValueOnce({ id: 7 });
    const { instance } = buildArticlesProcessor();
    await expect(instance.getArticleById(7)).resolves.toEqual({ id: 7 });
    expect(mockGetArticleById).toHaveBeenCalledWith(7);
  });

  test("editArticle: success updates state, refreshes cart, sets SYNCHED", async () => {
    mockUpdateArticle.mockResolvedValueOnce({ status: 200 });
    const initial = [
      { id: 1, name: "Milk", category: { id: 10, name: "Dairy" } },
      { id: 2, name: "Bread", category: { id: 11, name: "Bakery" } },
    ];
    const { instance, calls, mockCartProc } = buildArticlesProcessor(initial);

    await instance.editArticle(initial[0], {
      name: "New Milk",
      category: { id: 10 },
    });

    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    // mapping outcome from the component code
    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([
      { id: 1, name: "Milk", category: { id: 10 } }, // note: code keeps item.name as-is
      { id: 2, name: "Bread", category: { id: 11, name: "Bakery" } },
    ]);
    expect(mockCartProc.getShoppingCartItems).toHaveBeenCalled();
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("editArticle: error sets ERROR", async () => {
    mockUpdateArticle.mockRejectedValueOnce(new Error("nope"));
    const { instance, calls } = buildArticlesProcessor([
      { id: 1, name: "X", category: { id: 1 } },
    ]);

    await instance.editArticle({ id: 1, name: "X", category: { id: 1 } }, {});
    await flush(); // wait for .catch(...)

    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });

  test("createArticle: appends to state and (optionally) adds to cart", async () => {
    const apiResp = {
      data: { id: 99, name: "New", createdAt: "x", updatedAt: "y" },
    };
    mockCreateArticle.mockResolvedValueOnce(apiResp);
    const { instance, calls, mockCartProc } = buildArticlesProcessor([
      { id: 1 },
    ]);

    // with addToCart = true
    await instance.createArticle({ name: "New" }, true);

    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);

    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([{ id: 1 }, { id: 99, name: "New" }]); // stripped createdAt/updatedAt
    expect(mockCartProc.addCartItem).toHaveBeenCalledWith(99);
  });

  test("createArticle: when addToCart=false it does not touch cart", async () => {
    mockCreateArticle.mockResolvedValueOnce({ data: { id: 42, name: "N" } });
    const { instance, mockCartProc } = buildArticlesProcessor([]);

    await instance.createArticle({ name: "N" }, false);

    expect(mockCartProc.addCartItem).not.toHaveBeenCalled();
  });

  test("removeArticle: deletes cart item if present, then removes article", async () => {
    const initial = [{ id: 1 }, { id: 2 }];
    mockDeleteArticle.mockResolvedValueOnce({ status: 204 });

    const { instance, calls, mockCartProc } = buildArticlesProcessor(initial, {
      getCartItemByArticleId: jest
        .fn()
        .mockResolvedValue({ id: 333, article: { id: 2 } }),
    });

    await instance.removeArticle({ id: 2 });

    expect(mockCartProc.getCartItemByArticleId).toHaveBeenCalledWith(2);
    expect(mockCartProc.deleteCartItem).toHaveBeenCalledWith({
      id: 333,
      article: { id: 2 },
    });
    expect(mockDeleteArticle).toHaveBeenCalledWith(2);

    const last = calls.setState[calls.setState.length - 1];
    expect(last).toEqual([{ id: 1 }]); // pruned
    expect(calls.setSync[0]).toBe(mockSynch.SENDING);
    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.SYNCHED);
  });

  test("removeArticle: error path sets ERROR", async () => {
    const initial = [{ id: 1 }, { id: 2 }];
    mockDeleteArticle.mockRejectedValueOnce(new Error("fail"));
    const { instance, calls } = buildArticlesProcessor(initial, {
      getCartItemByArticleId: jest.fn().mockResolvedValue(null),
    });

    await instance.removeArticle({ id: 2 });

    expect(calls.setSync[calls.setSync.length - 1]).toBe(mockSynch.ERROR);
  });
});
