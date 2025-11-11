import { test } from "../src/fixtures/test.fixture";

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

test("user can set quantity", async ({
  shoppingCartItem,
  shoppingCartPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.verifyQuantity(1);
  await item!.setQuantity(3);
  await item!.verifyQuantity(3);
});

test("unsorted article is highlighted", async ({
  shoppingCartItem,
  shoppingCartPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.verifyBorderIsDisplayed();
  await item!.verifyWarningIconDisplayed();
  await item!.verifyWarningIconTooltip();
});

test("user can remove item from list", async ({
  shoppingCartItem,
  shoppingCartPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.deleteArticle();
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name
  );
});

test("user can edit article name", async ({
  shoppingCartPage,
  shoppingCartItem,
  topBarPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.editArticle();
  await shoppingCartPage.editArticleDialog.verifyArticleName(
    shoppingCartItem.article!.name
  );
  await shoppingCartPage.editArticleDialog.category.verifySelectedCategory(
    shoppingCartItem.category!.name!
  );
  await shoppingCartPage.editArticleDialog.typeArticleName(
    `${shoppingCartItem.article!.name} renamed article`
  );
  await shoppingCartPage.editArticleDialog.apply();
  await shoppingCartPage.verifyArticleInShoppingCart(
    `${shoppingCartItem.article!.name} renamed article`,
    shoppingCartItem.category!.name!
  );
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
  await topBarPage.articlesDropdown.typeArticleName(
    shoppingCartItem.article!.name
  );
  await topBarPage.articlesDropdown.verifyArticleInList(
    `${shoppingCartItem.article!.name} renamed article`,
    shoppingCartItem.category!.name!
  );
  await topBarPage.articlesDropdown.verifyArticleNotInList(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
});

test("user can remove article", async ({
  topBarPage,
  shoppingCartItem,
  shoppingCartPage,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.editArticle();
  await shoppingCartPage.editArticleDialog.removeArticle();
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
  await topBarPage.articlesDropdown.verifyArticleNotInList(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
});

test("user can edit article category - existing", async ({
  shoppingCartPage,
  shoppingCartItem,
  topBarPage,
  category,
}) => {
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.editArticle();
  await shoppingCartPage.editArticleDialog.verifyArticleName(
    shoppingCartItem.article!.name
  );
  await shoppingCartPage.editArticleDialog.category.verifySelectedCategory(
    shoppingCartItem.category!.name!
  );
  await shoppingCartPage.editArticleDialog.category.selectCategory(
    category.name!
  );
  await shoppingCartPage.editArticleDialog.apply();
  await shoppingCartPage.verifyArticleInShoppingCart(
    shoppingCartItem.article!.name,
    category.name!
  );
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
  await topBarPage.articlesDropdown.typeArticleName(
    shoppingCartItem.article!.name
  );
  await topBarPage.articlesDropdown.verifyArticleInList(
    shoppingCartItem.article!.name,
    category.name!
  );
  await topBarPage.articlesDropdown.verifyArticleNotInList(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
});

test("user can edit article category - new", async ({
  shoppingCartPage,
  shoppingCartItem,
  topBarPage,
  categoryGenerator,
}) => {
  const newCategory = await categoryGenerator.generate();
  const item = await shoppingCartPage.getCartItem(
    shoppingCartItem.article!.name
  );
  await item!.editArticle();
  await shoppingCartPage.editArticleDialog.verifyArticleName(
    shoppingCartItem.article!.name
  );
  await shoppingCartPage.editArticleDialog.category.verifySelectedCategory(
    shoppingCartItem.category!.name!
  );
  await shoppingCartPage.editArticleDialog.category.typeCategoryName(
    newCategory.name!
  );
  await shoppingCartPage.editArticleDialog.apply();
  await shoppingCartPage.verifyArticleInShoppingCart(
    shoppingCartItem.article!.name,
    newCategory.name!
  );
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
  await topBarPage.articlesDropdown.typeArticleName(
    shoppingCartItem.article!.name
  );
  await topBarPage.articlesDropdown.verifyArticleInList(
    shoppingCartItem.article!.name,
    newCategory.name!
  );
  await topBarPage.articlesDropdown.verifyArticleNotInList(
    shoppingCartItem.article!.name,
    shoppingCartItem.category!.name!
  );
});
