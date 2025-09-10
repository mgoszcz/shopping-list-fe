import { test as base } from "@playwright/test";
import { TopBarPage } from "../pages/topBarPage";
import { ArticleGenerator } from "../generators/articleGenerator";
import { generateRandomName } from "../utils/random";
import { ShoppingCartPage } from "../pages/shoppingCartPage";

type TopBarFixture = {
  topBarPage: TopBarPage;
  articleGenerator: ArticleGenerator;
  articleName: string;
  shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<TopBarFixture>({
  articleName: async ({}, use) => {
    const name = generateRandomName("topBar_test_e2e");
    await use(name);
  },

  topBarPage: async ({ page }, use) => {
    await use(new TopBarPage(page));
  },

  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },

  articleGenerator: async ({}, use) => {
    const articleGenerator = new ArticleGenerator();
    await use(articleGenerator);
    await articleGenerator.cleanup();
  },
});
