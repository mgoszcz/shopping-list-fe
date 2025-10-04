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

  async getCategoryName() {
    return await this._articleNameField.textContent();
  }

  async verifyArticleName(expectedName: string) {
    await expect(this._articleNameField).toHaveText(expectedName);
  }

  async verifyCategoryName(expectedName: string) {
    await expect(this._articleNameField).toHaveText(expectedName);
  }

  async selectArticle() {
    await this._selectionArea.click();
  }

  async verifyArticleSelected() {
    await expect(this._root).toHaveCSS("background-color", "rgb(15, 15, 15)");
  }

  async verifyArticleNotSelected() {
    await expect(this._root).toHaveCSS("background-color", "rgb(106, 30, 85)");
  }
}
