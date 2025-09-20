import { expect, Locator, Page } from "@playwright/test";
import { time } from "console";

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

  private async _getArticleFromList(name: string): Promise<Locator | null> {
    const items = await this._articleListbox.locator("li").all();
    for (const li of items) {
      const articleName = await li.locator("h5").textContent();
      if (articleName?.trim() === name) {
        return li;
      }
    }
    return null;
  }

  private async _awaitLoadingFinished(timeout = 10000) {
    await expect(this._articleListbox).not.toContainText("Loading", {
      timeout: timeout,
    });
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
    await this._awaitLoadingFinished();
    await expect
      .poll(
        async () => {
          const article = await this._getArticleFromList(name);
          return article;
        },
        {
          timeout: 10000,
        }
      )
      .toBeTruthy();
  }

  async selectArticle(name: string) {
    await this.typeArticleName(name);
    await this.verifyArticleInList(name);
    const articleItem = await this._getArticleFromList(name);
    await articleItem?.click();
  }
}
