import { Locator, Page } from "@playwright/test";

const selectors = {
  toolbar: ".MuiToolbar-root",
  addArticleButton: 'button[data-testid="add-article-to-cart"]',
};

export class TopBarPage {
  private _root: Locator;
  addArticleButton: Locator;

  constructor(page: Page) {
    this._root = page.locator(selectors.toolbar);
    this.addArticleButton = this._root.locator(selectors.addArticleButton);
  }
}
