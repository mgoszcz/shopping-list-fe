import { test } from "../src/fixtures/topBar.fixture";
import { expect } from "@playwright/test";

test.beforeEach(async ({ articleGenerator, articleName, page }) => {
  await page.goto("http://localhost:3000/");
  await articleGenerator.generateArticle(articleName);
});

test("existing article can be found on dropdown", async ({
  topBarPage,
  articleName,
}) => {
  await topBarPage.articlesDropdown.typeArticleName(articleName);
  await topBarPage.articlesDropdown.verifyArticleInList(articleName);
});

test("user can add article", async ({
  topBarPage,
  articleName,
  shoppingCartPage,
}) => {
  await topBarPage.articlesDropdown.selectArticle(articleName);
  await topBarPage.addArticleButton.click();
  await shoppingCartPage.verifyArticleInShoppingCart(articleName);
});

// test("top bar is visible", async ({ page }) => {
//   await page.goto("http://localhost:3000/");

//   // Click the get started link.
//   await expect(
//     page
//       .locator("header")
//       .locator(".MuiAutocomplete-root:has-text('Search Article')")
//   ).toBeVisible();
// });

// test("search bar is visible", async ({ page }) => {
//   await page.goto("http://localhost:3000/");

//   // Click the get started link.
//   await expect(
//     page
//       .locator("header")
//       .locator(".MuiAutocomplete-root:has-text('Search Article')")
//   ).toBeVisible();
// });
