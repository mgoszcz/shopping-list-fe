import { Locator, Page } from "@playwright/test";
import { ArticlesDropdown } from "../components/dropdown/articlesDropdown";
import { AddArticleDialog } from "../dialogs/addArticleDialog";

export class TopBarPage {
  private _root: Locator;
  addArticleButton: Locator;
  articlesDropdown: ArticlesDropdown;
  addArticleDialog: AddArticleDialog;

  constructor(page: Page) {
    this._root = page.locator('[data-testid="top-bar"]');
    this.addArticleButton = this._root.locator(
      'button[data-testid="add-article-to-cart"]'
    );
    this.articlesDropdown = new ArticlesDropdown(page);
    this.addArticleDialog = new AddArticleDialog(page);
  }
}
