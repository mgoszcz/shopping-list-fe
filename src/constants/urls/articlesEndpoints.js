export const articlesEndpoints = {
  get: "/shoppingArticles",
  getByID: (id) => `/shoppingArticles/${id}`,
  put: (id) => `/shoppingArticles/${id}`,
  post: "/shoppingArticles",
  delete: (id) => `/shoppingArticles/${id}`,
};
