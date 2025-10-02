import { expect, Locator } from "@playwright/test";

const selectors = {
  selectionArea: "button.MuiCardActionArea-root",
};

export class ShoppingCartItem {
  private _selectionArea: Locator;
  private _articleNameField: Locator;
  private _categoryNameField: Locator;

  constructor(
    private _root: Locator,
    private _articleName: string
  ) {
    this._selectionArea = this._root.locator(selectors.selectionArea);
    this._articleNameField = this._root.getByTestId(
      "shopping-cart-card.article-name"
    );
    this._categoryNameField = this._root.getByTestId(
      "shopping-cart-card.category-name"
    );
  }

  async verifyArticleName(expectedName: string) {
    await expect(this._articleNameField).toHaveText(expectedName);
  }

  async verifyCategoryName(expectedName: string) {
    await expect(this._categoryNameField).toHaveText(expectedName);
  }
}
