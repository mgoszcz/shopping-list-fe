// shopsData.test.js
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/shopsEndpoints", () => ({
  shopsEndpoints: {
    get: "/shops",
    post: "/shops",
    put: (id) => `/shops/${id}`,
    delete: (id) => `/shops/${id}`,
  },
}));

describe("shopsData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../shopsData");

  test("getShopsData -> GET /shops returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const { getShopsData } = mod();
    await expect(getShopsData()).resolves.toEqual([{ id: 1 }]);
    expect(mockApi.get).toHaveBeenCalledWith("/shops");
  });

  test("createShop -> POST /shops", async () => {
    const payload = { name: "Local" };
    const resp = { status: 201 };
    mockApi.post.mockResolvedValueOnce(resp);
    const { createShop } = mod();
    await expect(createShop(payload)).resolves.toBe(resp);
    expect(mockApi.post).toHaveBeenCalledWith("/shops", payload);
  });

  test("updateShop -> PUT /shops/:id", async () => {
    const payload = { name: "Renamed" };
    const resp = { status: 200 };
    mockApi.put.mockResolvedValueOnce(resp);
    const { updateShop } = mod();
    await expect(updateShop(3, payload)).resolves.toBe(resp);
    expect(mockApi.put).toHaveBeenCalledWith("/shops/3", payload);
  });

  test("deleteShop -> DELETE /shops/:id", async () => {
    const resp = { status: 204 };
    mockApi.delete.mockResolvedValueOnce(resp);
    const { deleteShop } = mod();
    await expect(deleteShop(8)).resolves.toBe(resp);
    expect(mockApi.delete).toHaveBeenCalledWith("/shops/8");
  });
});
