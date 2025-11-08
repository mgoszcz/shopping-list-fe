import { test as base } from "@playwright/test";
import { TopBarPage } from "../pages/topBarPage";
import { ArticleGenerator } from "../generators/articleGenerator";
import { ShoppingCartPage } from "../pages/shoppingCartPage";
import { Article, ArticleApi } from "../api/articleApi";
import { CategoriesApi, Category } from "../api/categoriesApi";
import { baseUrl } from "../consts/urls";
import { ShoppingCartApi, ShoppingCartItem } from "../api/shoppingCartApi";
import { CategoryGenerator } from "../generators/categoryGenerator";
import { ShoppingCartGenerator } from "../generators/shoppingCartGenerator";
import { BottomBarPage } from "../pages/bottomBarPage";
import { ShopsGenerator } from "../generators/ShopsGenerator";
import { Shop, ShopsApi } from "../api/shopsApi";
import { CurrentShopApi } from "../api/currentShopApi";

type TestFixture = {
  topBarPage: TopBarPage;
  article: Partial<Article>;
  shoppingCartPage: ShoppingCartPage;
  articlesApi: ArticleApi;
  categoriesApi: CategoriesApi;
  shoppingCartApi: ShoppingCartApi;
  category: Partial<Category>;
  articleGenerator: ArticleGenerator;
  categoryGenerator: CategoryGenerator;
  shoppingCartItem: Partial<ShoppingCartItem>;
  shoppingCartGenerator: ShoppingCartGenerator;
  bottomBarPage: BottomBarPage;
  shopsApi: ShopsApi;
  shopsGenerator: ShopsGenerator;
  shop: Partial<Shop>;
  currentShopApi: CurrentShopApi;
};

export const test = base.extend<TestFixture>({
  topBarPage: async ({ page }, use) => {
    await use(new TopBarPage(page));
  },

  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },

  bottomBarPage: async ({ page }, use) => {
    await use(new BottomBarPage(page));
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

  currentShopApi: async ({}, use) => {
    await use(new CurrentShopApi(baseUrl));
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

  shoppingCartItem: async ({ shoppingCartGenerator }, use) => {
    await use(await shoppingCartGenerator.generateAndPost());
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

  shopsApi: async ({}, use) => {
    await use(new ShopsApi(baseUrl));
  },

  shopsGenerator: async ({ shopsApi, currentShopApi }, use) => {
    const generator = new ShopsGenerator(shopsApi, currentShopApi);
    await use(generator);
    await generator.cleanup();
  },

  shop: async ({ shopsGenerator }, use) => {
    const shop = await shopsGenerator.generateAndPost();
    await shopsGenerator.setCurrentShop(shop);
    await use(shop);
  },
});
