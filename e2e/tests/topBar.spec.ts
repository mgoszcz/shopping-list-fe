import { test } from "../src/fixtures/test.fixture";
import { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("add article button is disabled when no article selected", async ({
  topBarPage,
}) => {
  await expect(topBarPage.addArticleButton).toBeDisabled();
});

test("existing article can be found on dropdown", async ({
  topBarPage,
  article,
}) => {
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.articlesDropdown.verifyArticleInList(
    article.name!,
    article.category!.name!
  );
});

test("user can add existing article", async ({
  topBarPage,
  article,
  shoppingCartPage,
}) => {
  await topBarPage.articlesDropdown.selectArticle(article.name!);
  await topBarPage.addArticleButton.click();
  await shoppingCartPage.verifyArticleInShoppingCart(
    article.name!,
    article.category!.name!
  );
  await topBarPage.articlesDropdown.verifyArticleIsGrayedOut(article.name!);
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
  await shoppingCartPage.verifyArticleInShoppingCart(
    article.name!,
    category.name!
  );
  await articleGenerator.registerGeneratedObjectByName(article);
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.articlesDropdown.verifyArticleInList(
    article.name!,
    category.name!
  );
});

test("user can add new article with new category", async ({
  topBarPage,
  articleGenerator,
  categoryGenerator,
  shoppingCartPage,
  page,
}) => {
  const category = await categoryGenerator.generate();
  const article = await articleGenerator.generate({
    category: { name: category.name },
  });
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.addArticleButton.click();
  await topBarPage.addArticleDialog.verifyDialogDisplayed("Add article");
  await topBarPage.addArticleDialog.verifyApplyDisabled();
  await topBarPage.addArticleDialog.verifyArticleName(article.name!);
  await topBarPage.addArticleDialog.category.typeCategoryName(category.name!);
  await topBarPage.addArticleDialog.verifyApplyEnabled();
  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes("/shoppingCart") && resp.status() === 201
    ),
    await topBarPage.addArticleDialog.apply(),
  ]);
  await shoppingCartPage.verifyArticleInShoppingCart(
    article.name!,
    category.name!
  );
  await articleGenerator.registerGeneratedObjectByName(article);
  await topBarPage.articlesDropdown.typeArticleName(article.name!);
  await topBarPage.articlesDropdown.verifyArticleInList(
    article.name!,
    category.name!
  );
});
