import { expect, Locator, Page } from "@playwright/test";
import { BaseDialog } from "./baseDialog";
import { CategoriesDropdown } from "../components/dropdown/categoriesDropdown";

const selectors = {
  articleNameRoot: 'div.MuiFormControl-root:has-text("Article Name")',
};

export class AddArticleDialog extends BaseDialog {
  private _articleName: Locator;
  private _category: CategoriesDropdown;

  constructor(page: Page) {
    super(page);
    this._articleName = page
      .locator(selectors.articleNameRoot)
      .locator("input");
    this._category = new CategoriesDropdown(page);
  }

  async typeArticleName(name: string) {
    this._articleName.clear();
    this._articleName.fill(name);
  }

  async verifyArticleName(name: string) {
    await expect(this._articleName).toHaveValue(name);
  }

  get category() {
    return this._category;
  }
}
