import { test } from "../src/fixtures/topBar.fixture";
import { expect } from "@playwright/test";

test.beforeEach(async ({ articleGenerator, articleName }) => {
  await articleGenerator.generateArticle(articleName);
});

test("user can add article", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Shopping List");
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
