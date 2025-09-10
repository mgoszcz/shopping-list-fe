import { Locator, Page } from "@playwright/test";
import { ArticlesDropdown } from "../components/dropdown/articlesDropdown";

const selectors = {
  toolbar: ".MuiToolbar-root",
  addArticleButton: 'button[data-testid="add-article-to-cart"]',
};

export class TopBarPage {
  private _root: Locator;
  addArticleButton: Locator;
  articlesDropdown: ArticlesDropdown;

  constructor(page: Page) {
    this._root = page.locator(selectors.toolbar);
    this.addArticleButton = this._root.locator(selectors.addArticleButton);
    this.articlesDropdown = new ArticlesDropdown(page);
  }
}
