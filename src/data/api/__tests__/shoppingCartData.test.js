// shoppingCartData.test.js
const mockApi = {
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
};

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/shoppingCartEndpoints", () => ({
  shoppingCartEndpoints: {
    get: "/cart",
    put: (id) => `/cart/${id}`,
    delete: (id) => `/cart/${id}`,
    post: "/cart",
    deleteAll: "/cart",
  },
}));

describe("shoppingCartData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../shoppingCartData");

  test("getShoppingCartData -> GET /cart returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const { getShoppingCartData } = mod();
    await expect(getShoppingCartData()).resolves.toEqual([{ id: 1 }]);
    expect(mockApi.get).toHaveBeenCalledWith("/cart");
  });

  test("updateShoppingCartItem -> PUT /cart/:id with body", async () => {
    const resp = { status: 200 };
    mockApi.put.mockResolvedValueOnce(resp);
    const { updateShoppingCartItem } = mod();
    const body = { checked: true };
    await expect(updateShoppingCartItem(5, body)).resolves.toBe(resp);
    expect(mockApi.put).toHaveBeenCalledWith("/cart/5", body);
  });

  test("deleteShoppingCartItem -> DELETE /cart/:id", async () => {
    const resp = { status: 204 };
    mockApi.delete.mockResolvedValueOnce(resp);
    const { deleteShoppingCartItem } = mod();
    await expect(deleteShoppingCartItem(7)).resolves.toBe(resp);
    expect(mockApi.delete).toHaveBeenCalledWith("/cart/7");
  });

  test("addShoppingCartItem -> POST /cart with article payload", async () => {
    const resp = { status: 201 };
    mockApi.post.mockResolvedValueOnce(resp);
    const { addShoppingCartItem } = mod();
    await expect(addShoppingCartItem(9)).resolves.toBe(resp);
    expect(mockApi.post).toHaveBeenCalledWith("/cart", { article: { id: 9 } });
  });

  test("deleteUncheckedItems -> DELETE /cart?unchecked=true", async () => {
    const resp = { status: 204 };
    mockApi.delete.mockResolvedValueOnce(resp);
    const { deleteUncheckedItems } = mod();
    await expect(deleteUncheckedItems()).resolves.toBe(resp);
    expect(mockApi.delete).toHaveBeenCalledWith("/cart", {
      params: { unchecked: true },
    });
  });

  test("deleteCheckedItems -> DELETE /cart?checked=true", async () => {
    const resp = { status: 204 };
    mockApi.delete.mockResolvedValueOnce(resp);
    const { deleteCheckedItems } = mod();
    await expect(deleteCheckedItems()).resolves.toBe(resp);
    expect(mockApi.delete).toHaveBeenCalledWith("/cart", {
      params: { checked: true },
    });
  });
});
