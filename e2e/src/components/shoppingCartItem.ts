import { Locator } from "@playwright/test";

const selectors = {
  selectionArea: "button.MuiCardActionArea-root",
};

export class ShoppingCartItem {
  private _selectionArea: Locator;

  constructor(
    private _root: Locator,
    private _articleName: string
  ) {
    this._selectionArea = this._root.locator(selectors.selectionArea);
  }
}
