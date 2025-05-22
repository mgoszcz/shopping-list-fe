import { test, expect } from "@playwright/test";

test("web opens", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Shopping List");
});

test("search bar is visible", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Click the get started link.
  await expect(
    page
      .locator("header")
      .locator(".MuiAutocomplete-root:has-text('Search Article')")
  ).toBeVisible();
});
