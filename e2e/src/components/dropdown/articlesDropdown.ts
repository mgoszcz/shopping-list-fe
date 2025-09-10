import { expect, Locator, Page } from "@playwright/test";

const selectors = {
  root: '[data-testid="search-article-input"]',
  label: "label.MuiFormLabel-root",
  input: "input#search-article",
  articleListbox: ".MuiPopper-root ul#search-article-listbox",
};

export class ArticlesDropdown {
  private _root: Locator;
  private _label: Locator;
  private _input: Locator;
  private _articleListbox: Locator;

  constructor(page: Page) {
    this._root = page.locator(selectors.root);
    this._label = this._root.locator(selectors.label);
    this._input = this._root.locator(selectors.input);
    this._articleListbox = page.locator(selectors.articleListbox);
  }

  private async _getArticleFromList(name: string) {
    for (const li of await this._articleListbox.locator("li").all()) {
      const articleName = await li.locator("h5").textContent();
      if (articleName === name) return li;
    }
    return null;
  }

  async typeArticleName(name: string) {
    await this._input.clear();
    await this._input.click();
    await this._input.fill(name);
  }

  async verifyArticleInList(name: string) {
    if ((await this._articleListbox.isVisible()) === false) {
      await this._input.click();
    }
    await expect
      .poll(async () => await this._getArticleFromList(name), { timeout: 1000 })
      .not.toBeNull();
  }

  async selectArticle(name: string) {
    await this.typeArticleName(name);
    const articleItem = await this._getArticleFromList(name);
    await articleItem?.click();
  }
}
