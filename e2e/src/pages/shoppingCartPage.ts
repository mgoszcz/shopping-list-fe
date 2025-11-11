import { expect, Locator, Page } from "@playwright/test";
import { ShoppingCartItem } from "../components/shoppingCartItem";
import { EditArticleDialog } from "../dialogs/editArticleDialog";

export class ShoppingCartPage {
  private _root: Locator;
  editArticleDialog: EditArticleDialog;
  private shoppingCartCardSelector = ".shopping-cart-card";
  private articleNameSelector =
    '[data-testid="shopping-cart-card.article-name"]';

  constructor(page: Page) {
    this._root = page.locator('[data-testid="shopping-cart-container"]');
    this.editArticleDialog = new EditArticleDialog(page);
  }

  private async _getCartItemCard(
    articleName: string,
    categoryName?: string
  ): Promise<ShoppingCartItem | null> {
    for (const card of await this._root
      .locator(this.shoppingCartCardSelector)
      .all()) {
      let cartItem;
      const name = await card.locator(this.articleNameSelector).textContent();
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
      .poll(
        async () => await this._getCartItemCard(articleName, categoryName),
        {
          timeout: 10000,
        }
      )
      .not.toBeNull();
    const shoppingCartCard = await this._getCartItemCard(
      articleName,
      categoryName
    );
    await shoppingCartCard?.verifyArticleName(articleName);
    if (categoryName) {
      await shoppingCartCard?.verifyCategoryName(categoryName);
    }
  }

  async verifyArticleNotInShoppingCart(
    articleName: string,
    categoryName?: string
  ) {
    await expect
      .poll(
        async () => await this._getCartItemCard(articleName, categoryName),
        {
          timeout: 10000,
        }
      )
      .toBeNull();
  }

  async getCartItem(articleName: string, categoryName?: string) {
    await this.verifyArticleInShoppingCart(articleName, categoryName);
    return this._getCartItemCard(articleName, categoryName);
  }
}
