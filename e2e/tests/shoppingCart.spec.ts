import { test } from "../src/fixtures/shoppingCart.fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("user can toggle article selection", async ({
  shoppingCartItem,
  shoppingCartPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.verifyArticleNotSelected();
  await item!.selectArticle();
  await item!.verifyArticleSelected();
  await item!.selectArticle();
  await item!.verifyArticleNotSelected();
});
