import { test as base } from "@playwright/test";
import { ShoppingCartPage } from "../pages/shoppingCartPage";
import { ArticleApi } from "../api/articleApi";
import { baseUrl } from "../consts/urls";
import { ShoppingCartApi, ShoppingCartItem } from "../api/shoppingCartApi";
import { ShoppingCartGenerator } from "../generators/shoppingCartGenerator";
import { CategoriesApi, Category } from "../api/categoriesApi";
import { TopBarPage } from "../pages/topBarPage";
import { CategoryGenerator } from "../generators/categoryGenerator";

type ShoppingCartFixture = {
  shoppingCartPage: ShoppingCartPage;
  articlesApi: ArticleApi;
  categoriesApi: CategoriesApi;
  shoppingCartApi: ShoppingCartApi;
  shoppingCartItem: Partial<ShoppingCartItem>;
  shoppingCartGenerator: ShoppingCartGenerator;
  topBarPage: TopBarPage;
  category: Partial<Category>;
  categoryGenerator: CategoryGenerator;
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

  category: async ({ categoryGenerator }, use) => {
    const category = await categoryGenerator.generateAndPost();
    await use(category);
  },

  categoryGenerator: async ({ categoriesApi }, use) => {
    await use(new CategoryGenerator(categoriesApi));
  },
});
