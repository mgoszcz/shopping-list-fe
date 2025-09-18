import { test } from "../src/fixtures/topBar.fixture";
import { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("existing article can be found on dropdown", async ({
  topBarPage,
  article,
}) => {
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.articlesDropdown.verifyArticleInList(article.name!);
});

test("user can add article", async ({
  topBarPage,
  article,
  shoppingCartPage,
}) => {
  await topBarPage.articlesDropdown.selectArticle(article.name!);
  await topBarPage.addArticleButton.click();
  await shoppingCartPage.verifyArticleInShoppingCart(article.name!);
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
