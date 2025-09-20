import { test as base } from "@playwright/test";
import { TopBarPage } from "../pages/topBarPage";
import { ArticleGenerator } from "../generators/articleGenerator";
import { ShoppingCartPage } from "../pages/shoppingCartPage";
import { Article, ArticleApi } from "../api/articleApi";
import { CategoriesApi } from "../api/categoriesApi";
import { baseUrl } from "../consts/urls";
import { ShoppingCartApi } from "../api/shoppingCartApi";

type TopBarFixture = {
  topBarPage: TopBarPage;
  article: Partial<Article>;
  shoppingCartPage: ShoppingCartPage;
  articlesApi: ArticleApi;
  categoriesApi: CategoriesApi;
  shoppingCartApi: ShoppingCartApi;
};

export const test = base.extend<TopBarFixture>({
  topBarPage: async ({ page }, use) => {
    await use(new TopBarPage(page));
  },

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

  article: async ({ articlesApi, categoriesApi, shoppingCartApi }, use) => {
    const generator = new ArticleGenerator(
      articlesApi,
      categoriesApi,
      shoppingCartApi
    );
    await use(await generator.generateAndPost());
    await generator.cleanup();
  },
});
