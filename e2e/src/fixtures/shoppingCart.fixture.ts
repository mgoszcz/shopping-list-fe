import { test as base } from "@playwright/test";
import { ShoppingCartPage } from "../pages/shoppingCartPage";
import { ArticleApi } from "../api/articleApi";
import { baseUrl } from "../consts/urls";
import { ShoppingCartApi, ShoppingCartItem } from "../api/shoppingCartApi";
import { ShoppingCartGenerator } from "../generators/shoppingCartGenerator";
import { CategoriesApi } from "../api/categoriesApi";
import { TopBarPage } from "../pages/topBarPage";

type ShoppingCartFixture = {
  shoppingCartPage: ShoppingCartPage;
  articlesApi: ArticleApi;
  categoriesApi: CategoriesApi;
  shoppingCartApi: ShoppingCartApi;
  shoppingCartItem: Partial<ShoppingCartItem>;
  shoppingCartGenerator: ShoppingCartGenerator;
  topBarPage: TopBarPage;
};

export const test = base.extend<ShoppingCartFixture>({
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },

  articlesApi: async ({}, use) => {
    await use(new ArticleApi(baseUrl));
  },

  categoriesApi: async ({}, use) => {
    await use(new CategoriesApi(baseUrl));
  },

  shoppingCartApi: async ({}, use) => {
    await use(new ShoppingCartApi(baseUrl));
  },

  shoppingCartGenerator: async (
    { shoppingCartApi, articlesApi, categoriesApi },
    use
  ) => {
    const generator = new ShoppingCartGenerator(
      shoppingCartApi,
      articlesApi,
      categoriesApi
    );
    await use(generator);
    await generator.cleanup();
  },

  shoppingCartItem: async ({ shoppingCartGenerator }, use) => {
    await use(await shoppingCartGenerator.generateAndPost());
  },

  topBarPage: async ({ page }, use) => {
    await use(new TopBarPage(page));
  },
});
