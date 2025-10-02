import { expect, Locator, Page } from "@playwright/test";
import { ShoppingCartItem } from "../components/shoppingCartItem";

const selectors = {
  root: '[data-testid="shopping-cart-container"]',
  shoppingCartCard: ".shopping-cart-card",
  articleName: '[data-testid="shopping-cart-card.article-name"]',
};

export class ShoppingCartPage {
  private _root: Locator;

  constructor(page: Page) {
    this._root = page.locator(selectors.root);
  }

  private async _getCartItemCard(
    articleName: string
  ): Promise<ShoppingCartItem | null> {
    for (const card of await this._root
      .locator(selectors.shoppingCartCard)
      .all()) {
      const name = await card.locator(selectors.articleName).textContent();
      if (name === articleName) return new ShoppingCartItem(card, articleName);
    }
    return null;
  }

  async verifyArticleInShoppingCart(
    articleName: string,
    categoryName?: string
  ) {
    await expect
      .poll(async () => await this._getCartItemCard(articleName), {
        timeout: 10000,
      })
      .not.toBeNull();
    const shoppingCartCard = await this._getCartItemCard(articleName);
    await shoppingCartCard?.verifyArticleName(articleName);
    if (categoryName) {
      await shoppingCartCard?.verifyCategoryName(categoryName);
    }
  }
}
