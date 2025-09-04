// categoryOrderData.test.js
const mockApi = { get: jest.fn(), put: jest.fn() };

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/categoryOrderEndpoint", () => ({
  categoryOrderEndpoint: {
    get: (id) => `/shops/${id}/category-order`,
    put: (id) => `/shops/${id}/category-order`,
  },
}));

describe("categoryOrderData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../categoryOrderData");

  test("getCategoryOrderData -> GET /shops/:id/category-order returns data", async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [{ category: { id: 1 }, category_order: 1 }],
    });
    const { getCategoryOrderData } = mod();
    await expect(getCategoryOrderData(3)).resolves.toEqual([
      { category: { id: 1 }, category_order: 1 },
    ]);
    expect(mockApi.get).toHaveBeenCalledWith("/shops/3/category-order");
  });

  test("setCategoryOrderData -> PUT /shops/:id/category-order sends body, returns response", async () => {
    const body = [{ category: { id: 1 }, category_order: 1 }];
    const resp = { status: 200 };
    mockApi.put.mockResolvedValueOnce(resp);
    const { setCategoryOrderData } = mod();
    await expect(setCategoryOrderData(4, body)).resolves.toBe(resp);
    expect(mockApi.put).toHaveBeenCalledWith("/shops/4/category-order", body);
  });
});
