import { ArticleApi } from "../api/articleApi.ts";
import { ShoppingCartApi } from "../api/shoppingCartApi.ts";
import { baseUrl } from "../consts/urls.ts";

const cleanup = async () => {
  const shoppingCartApi = new ShoppingCartApi(baseUrl);
  const shoppingArticlesApi = new ArticleApi(baseUrl);

  const shoppingCartItems = await shoppingCartApi.list();
  for (const item of shoppingCartItems) {
    if (item.article.name.includes("test_e2e_article")) {
      await shoppingCartApi.delete(item.id);
    }
  }

  const articles = await shoppingArticlesApi.list();
  for (const item of articles) {
    if (item.name.includes("test_e2e_article")) {
      await shoppingArticlesApi.delete(item.id);
    }
  }
};

cleanup();
