import { expect, Locator } from "@playwright/test";

const selectors = {
  selectionArea: "button.MuiCardActionArea-root",
  quantityInput: "#amount-input",
  warningButton: "button:has([data-testid='ReportIcon'])",
};

export class ShoppingCartItem {
  private _selectionArea: Locator;
  private _articleNameField: Locator;
  private _categoryNameField: Locator;
  private _quantityField: Locator;

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
    this._quantityField = this._root.locator(selectors.quantityInput);
  }

  async getCategoryName() {
    return await this._categoryNameField.textContent();
  }

  async setQuantity(value: number) {
    this._quantityField.fill(value.toString());
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

  async deleteArticle() {
    await this._root.getByTestId("delete-article-button").click();
  }

  async verifyArticleSelected() {
    await expect(this._root).toHaveCSS("background-color", "rgb(15, 15, 15)");
  }

  async verifyArticleNotSelected() {
    await expect(this._root).toHaveCSS("background-color", "rgb(106, 30, 85)");
  }

  async verifyQuantity(expectedQuantity: number) {
    await expect(this._quantityField).toHaveValue(expectedQuantity.toString());
  }

  async verifyBorderIsDisplayed() {
    const box = this._root.getByTestId("shopping-cart-card.card-container");
    await expect(box).toHaveCSS("border", "5px dashed rgb(190, 30, 85)");
  }

  async verifyWarningIconDisplayed() {
    await expect(this._root.locator(selectors.warningButton)).toBeVisible();
  }

  async verifyWarningIconTooltip() {
    await this._root.locator(selectors.warningButton).click();
    await expect(this._root.locator(".MuiTooltip-tooltip")).toContainText(
      "Category is not ordered in current shop. To order go to the bottom bar and click on button"
    );
  }
}
