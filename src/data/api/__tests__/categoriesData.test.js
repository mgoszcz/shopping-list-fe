// categoriesData.test.js
const mockApi = { get: jest.fn(), post: jest.fn() };

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/categoriesEndpoint", () => ({
  categoriesEndpoint: { get: "/categories", post: "/categories" },
}));

describe("categoriesData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../categoriesData");

  test("getCategoriesData -> GET /categories returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: [{ id: 1, name: "Dairy" }] });
    const { getCategoriesData } = mod();
    await expect(getCategoriesData()).resolves.toEqual([
      { id: 1, name: "Dairy" },
    ]);
    expect(mockApi.get).toHaveBeenCalledWith("/categories");
  });

  test("createCategory -> POST /categories sends body, returns response", async () => {
    const payload = { name: "New Cat" };
    const resp = { status: 201 };
    mockApi.post.mockResolvedValueOnce(resp);
    const { createCategory } = mod();
    await expect(createCategory(payload)).resolves.toBe(resp);
    expect(mockApi.post).toHaveBeenCalledWith("/categories", payload);
  });
});
