// currentShopData.test.js
const mockApi = { get: jest.fn(), put: jest.fn() };

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/currentShopEndpoints", () => ({
  currentShopEndpoints: { get: "/current-shop", put: "/current-shop" },
}));

describe("currentShopData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../currentShopData");

  test("getCurrentShop -> GET /current-shop returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { shop_id: 10 } });
    const { getCurrentShop } = mod();
    await expect(getCurrentShop()).resolves.toEqual({ shop_id: 10 });
    expect(mockApi.get).toHaveBeenCalledWith("/current-shop");
  });

  test("updateCurrentShop -> PUT /current-shop sends {shop_id}, returns response", async () => {
    const resp = { status: 200 };
    mockApi.put.mockResolvedValueOnce(resp);
    const { updateCurrentShop } = mod();
    await expect(updateCurrentShop(12)).resolves.toBe(resp);
    expect(mockApi.put).toHaveBeenCalledWith("/current-shop", { shop_id: 12 });
  });
});
