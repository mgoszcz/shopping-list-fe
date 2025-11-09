import { test } from "../src/fixtures/test.fixture";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("Clear list button", async ({
  bottomBarPage,
  shoppingCartPage,
  shoppingCartGenerator,
}) => {
  const checkedItem = await shoppingCartGenerator.generateAndPost();
  const unCheckedItems = [
    await shoppingCartGenerator.generateAndPost(),
    await shoppingCartGenerator.generateAndPost(),
  ];
  await shoppingCartGenerator.setCheckedValue(checkedItem, true);
  await shoppingCartPage.verifyArticleInShoppingCart(checkedItem.article!.name);
  await shoppingCartPage.verifyArticleInShoppingCart(
    unCheckedItems[0].article!.name
  );
  await shoppingCartPage.verifyArticleInShoppingCart(
    unCheckedItems[1].article!.name
  );
  await bottomBarPage.clearListButton.click();
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    checkedItem.article!.name
  );
  await shoppingCartPage.verifyArticleInShoppingCart(
    unCheckedItems[0].article!.name
  );
  await shoppingCartPage.verifyArticleInShoppingCart(
    unCheckedItems[1].article!.name
  );
  await bottomBarPage.clearListButton.click();
  await bottomBarPage.confirmRemovalDialog.verifyMessage(
    "Are you sure you want to remove all shopping cart items?"
  );
  await bottomBarPage.confirmRemovalDialog.confirm();
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    unCheckedItems[0].article!.name
  );
  await shoppingCartPage.verifyArticleNotInShoppingCart(
    unCheckedItems[1].article!.name
  );
});

test("User can add shop", async ({ shopsGenerator, bottomBarPage }) => {
  const shop = await shopsGenerator.generate();
  await bottomBarPage.addNewShop(shop.name!);
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop.name!);
  await bottomBarPage.shopsDropdown.verifyShopOnTheList(shop.name!);
  await shopsGenerator.registerGeneratedObjectByName(shop);
});

test("User can change current shop", async ({
  shopsGenerator,
  bottomBarPage,
}) => {
  const shop1 = await shopsGenerator.generateAndPost();
  const shop2 = await shopsGenerator.generateAndPost();
  await shopsGenerator.setCurrentShop(shop1);
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop1.name!);
  await bottomBarPage.shopsDropdown.selectCurrentShop(shop2.name!);
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop2.name!);
});

test("User can edit shop name", async ({ shop, bottomBarPage }) => {
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop.name!);
  await bottomBarPage.editButton.click();
  await bottomBarPage.editShopDialog.verifyShopName(shop.name!);
  await bottomBarPage.editShopDialog.typeShopName(shop.name! + " EDITED");
  await bottomBarPage.editShopDialog.apply();
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop.name! + " EDITED");
  await bottomBarPage.shopsDropdown.verifyShopOnTheList(shop.name! + " EDITED");
  await bottomBarPage.shopsDropdown.verifyShopNotOnTheList(shop.name!);
});

test("User can remove shop", async ({ shop, bottomBarPage }) => {
  await bottomBarPage.shopsDropdown.verifyCurrentShop(shop.name!);
  await bottomBarPage.editButton.click();
  await bottomBarPage.editShopDialog.verifyShopName(shop.name!);
  await bottomBarPage.editShopDialog.removeShop();
  await bottomBarPage.shopsDropdown.verifyCurrentShop("");
  await bottomBarPage.shopsDropdown.verifyShopNotOnTheList(shop.name!);
});
