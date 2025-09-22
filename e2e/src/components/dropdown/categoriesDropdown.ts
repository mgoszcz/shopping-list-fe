import { expect, Locator, Page } from "@playwright/test";

const selectors = {
  input: "input#category-select",
  categoriesListbox: ".MuiPopper-root ul#category-select-listbox",
};

export class CategoriesDropdown {
  private _input: Locator;
  private _categoriesListbox: Locator;

  constructor(page: Page) {
    this._input = page.locator(selectors.input);
    this._categoriesListbox = page.locator(selectors.categoriesListbox);
  }

  private async _getCategoryFromList(name: string): Promise<Locator | null> {
    const items = await this._categoriesListbox.locator("li").all();
    for (const li of items) {
      const categoryName = await li.textContent();
      if (categoryName?.trim() === name) {
        return li;
      }
    }
    return null;
  }

  private async _awaitLoadingFinished(timeout = 10000) {
    await expect(this._categoriesListbox).not.toContainText("Loading", {
      timeout: timeout,
    });
  }

  async typeCategoryName(name: string) {
    await this._input.clear();
    await this._input.click();
    await this._input.fill(name);
  }

  async verifyCategoryInList(name: string) {
    if ((await this._categoriesListbox.isVisible()) === false) {
      await this._input.click();
    }
    await this._awaitLoadingFinished();
    await expect
      .poll(
        async () => {
          const category = await this._getCategoryFromList(name);
          return category;
        },
        {
          timeout: 10000,
        }
      )
      .toBeTruthy();
  }

  async selectCategory(name: string) {
    await this.typeCategoryName(name);
    await this.verifyCategoryInList(name);
    const categoryItem = await this._getCategoryFromList(name);
    await categoryItem?.click();
  }
}
