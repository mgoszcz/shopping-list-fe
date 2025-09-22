import { Locator, Page } from "@playwright/test";
import { ArticlesDropdown } from "../components/dropdown/articlesDropdown";
import { AddArticleDialog } from "../dialogs/addArticleDialog";

const selectors = {
  toolbar: ".MuiToolbar-root",
  addArticleButton: 'button[data-testid="add-article-to-cart"]',
};

export class TopBarPage {
  private _root: Locator;
  addArticleButton: Locator;
  articlesDropdown: ArticlesDropdown;
  addArticleDialog: AddArticleDialog;

  constructor(page: Page) {
    this._root = page.locator(selectors.toolbar);
    this.addArticleButton = this._root.locator(selectors.addArticleButton);
    this.articlesDropdown = new ArticlesDropdown(page);
    this.addArticleDialog = new AddArticleDialog(page);
  }
}
