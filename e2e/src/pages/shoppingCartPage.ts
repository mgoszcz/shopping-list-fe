import { expect, Locator, Page } from "@playwright/test";
import { ShoppingCartItem } from "../components/shoppingCartItem";

const selectors = {
  root: '[data-testid="shopping-cart-container"]',
  shoppingCartCard: ".shopping-cart-card",
  articleName: '[data-testid="article-name"]',
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
      console.log(name);
      if (name === articleName) return new ShoppingCartItem(card, articleName);
    }
    return null;
  }

  async verifyArticleInShoppingCart(name: string) {
    await expect
      .poll(async () => await this._getCartItemCard(name), { timeout: 1000 })
      .not.toBeNull();
  }
}
