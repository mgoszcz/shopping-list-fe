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

test("user can add existing article", async ({
  topBarPage,
  article,
  shoppingCartPage,
}) => {
  await topBarPage.articlesDropdown.selectArticle(article.name!);
  await topBarPage.addArticleButton.click();
  await shoppingCartPage.verifyArticleInShoppingCart(article.name!);
});

test("user can add new article with existing category", async ({
  topBarPage,
  articleGenerator,
  category,
  shoppingCartPage,
  page,
}) => {
  const article = await articleGenerator.generate({
    category: { id: category.id!, name: category.name },
  });
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.addArticleButton.click();
  await topBarPage.addArticleDialog.verifyDialogDisplayed("Add article");
  await topBarPage.addArticleDialog.verifyApplyDisabled();
  await topBarPage.addArticleDialog.verifyArticleName(article.name!);
  await topBarPage.addArticleDialog.category.selectCategory(category.name!);
  await topBarPage.addArticleDialog.verifyApplyEnabled();
  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes("/shoppingCart") && resp.status() === 201
    ),
    await topBarPage.addArticleDialog.apply(),
  ]);
  await shoppingCartPage.verifyArticleInShoppingCart(article.name!);
  await articleGenerator.registerGeneratedObjectByName(article);
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.articlesDropdown.verifyArticleInList(article.name!);
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
