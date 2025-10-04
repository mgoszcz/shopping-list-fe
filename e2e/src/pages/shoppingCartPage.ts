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
    articleName: string,
    categoryName?: string
  ): Promise<ShoppingCartItem | null> {
    for (const card of await this._root
      .locator(selectors.shoppingCartCard)
      .all()) {
      let cartItem;
      const name = await card.locator(selectors.articleName).textContent();
      if (name === articleName)
        cartItem = new ShoppingCartItem(card, articleName);
      if (categoryName) {
        if (cartItem && (await cartItem.getCategoryName()) === categoryName) {
          return cartItem;
        }
      } else if (cartItem) {
        return cartItem;
      }
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

  async getCartItem(articleName: string, categoryName?: string) {
    this.verifyArticleInShoppingCart(articleName, categoryName);
    return this._getCartItemCard(articleName, categoryName);
  }
}
