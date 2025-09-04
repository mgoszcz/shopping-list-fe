// articlesData.test.js
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/articlesEndpoints", () => ({
  articlesEndpoints: {
    get: "/articles",
    getByID: (id) => `/articles/${id}`,
    post: "/articles",
    put: (id) => `/articles/${id}`,
    delete: (id) => `/articles/${id}`,
  },
}));

describe("articlesData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../articlesData");

  test("getArticles -> GET /articles returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const { getArticles } = mod();
    await expect(getArticles()).resolves.toEqual([{ id: 1 }]);
    expect(mockApi.get).toHaveBeenCalledWith("/articles");
  });

  test("getArticleById -> GET /articles/:id returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { id: 5 } });
    const { getArticleById } = mod();
    await expect(getArticleById(5)).resolves.toEqual({ id: 5 });
    expect(mockApi.get).toHaveBeenCalledWith("/articles/5");
  });

  test("updateArticle -> PUT /articles/:id sends body, returns response", async () => {
    const payload = { name: "Milk" };
    const resp = { status: 200 };
    mockApi.put.mockResolvedValueOnce(resp);
    const { updateArticle } = mod();
    await expect(updateArticle(7, payload)).resolves.toBe(resp);
    expect(mockApi.put).toHaveBeenCalledWith("/articles/7", payload);
  });

  test("createArticle -> POST /articles sends body, returns response", async () => {
    const payload = { name: "Bread" };
    const resp = { status: 201 };
    mockApi.post.mockResolvedValueOnce(resp);
    const { createArticle } = mod();
    await expect(createArticle(payload)).resolves.toBe(resp);
    expect(mockApi.post).toHaveBeenCalledWith("/articles", payload);
  });

  test("deleteArticle -> DELETE /articles/:id returns response", async () => {
    const resp = { status: 204 };
    mockApi.delete.mockResolvedValueOnce(resp);
    const { deleteArticle } = mod();
    await expect(deleteArticle(9)).resolves.toBe(resp);
    expect(mockApi.delete).toHaveBeenCalledWith("/articles/9");
  });
});
