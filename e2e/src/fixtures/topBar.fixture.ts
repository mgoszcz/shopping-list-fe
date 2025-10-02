import { test as base } from "@playwright/test";
import { TopBarPage } from "../pages/topBarPage";
import { ArticleGenerator } from "../generators/articleGenerator";
import { ShoppingCartPage } from "../pages/shoppingCartPage";
import { Article, ArticleApi } from "../api/articleApi";
import { CategoriesApi, Category } from "../api/categoriesApi";
import { baseUrl } from "../consts/urls";
import { ShoppingCartApi } from "../api/shoppingCartApi";
import { CategoryGenerator } from "../generators/categoryGenerator";

type TopBarFixture = {
  topBarPage: TopBarPage;
  article: Partial<Article>;
  shoppingCartPage: ShoppingCartPage;
  articlesApi: ArticleApi;
  categoriesApi: CategoriesApi;
  shoppingCartApi: ShoppingCartApi;
  category: Partial<Category>;
  articleGenerator: ArticleGenerator;
  categoryGenerator: CategoryGenerator;
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

  articleGenerator: async (
    { articlesApi, categoriesApi, shoppingCartApi },
    use
  ) => {
    const generator = new ArticleGenerator(
      articlesApi,
      categoriesApi,
      shoppingCartApi
    );
    await use(generator);
    await generator.cleanup();
  },

  article: async ({ articleGenerator }, use) => {
    await use(await articleGenerator.generateAndPost());
  },

  category: async ({ categoryGenerator }, use) => {
    await use(await categoryGenerator.generateAndPost());
  },

  categoryGenerator: async ({ categoriesApi }, use) => {
    const generator = new CategoryGenerator(categoriesApi);
    await use(generator);
  },
});
