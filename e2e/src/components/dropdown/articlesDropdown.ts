import { expect, Locator, Page } from "@playwright/test";

export class ArticlesDropdown {
  private _root: Locator;
  private _input: Locator;
  private _articleListbox: Locator;

  constructor(page: Page) {
    this._root = page.locator('[data-testid="search-article-input"]');
    this._input = this._root.locator("input#search-article");
    this._articleListbox = page.locator(
      ".MuiPopper-root ul#search-article-listbox"
    );
  }

  private async _getArticleFromList(
    name: string,
    category?: string
  ): Promise<Locator | null> {
    const items = await this._articleListbox.locator("li").all();
    for (const li of items) {
      const articleName = await li.locator("h5").textContent();
      const categoryName = await li.locator("h6").textContent();
      if (articleName?.trim() === name) {
        if (category && categoryName?.trim() === category) {
          return li;
        } else if (!category) {
          return li;
        } else {
          // do nothing
        }
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

  async verifyArticleInList(articleName: string, categoryName?: string) {
    if ((await this._articleListbox.isVisible()) === false) {
      await this._input.click();
    }
    await this._awaitLoadingFinished();
    await expect
      .poll(
        async () => {
          const article = await this._getArticleFromList(
            articleName,
            categoryName
          );
          return article;
        },
        {
          timeout: 20000,
        }
      )
      .toBeTruthy();
    const article = await this._getArticleFromList(articleName, categoryName);
    await expect(
      article!.getByTestId("article-list-item.article-name")
    ).toHaveText(articleName);
    if (categoryName) {
      await expect(
        article!.getByTestId("article-list-item.category-name")
      ).toHaveText(categoryName);
    }
  }

  async selectArticle(name: string, categoryName?: string) {
    await this.typeArticleName(name);
    await this.verifyArticleInList(name);
    const articleItem = await this._getArticleFromList(name, categoryName);
    await articleItem?.click();
  }

  async verifyArticleIsGrayedOut(articleName: string, categoryName?: string) {
    if ((await this._articleListbox.isVisible()) === false) {
      await this._input.click();
    }
    await this._awaitLoadingFinished();
    const article = await this._getArticleFromList(articleName, categoryName);
    expect(article).toBeDefined();
    await expect(article!).toBeDisabled();
  }

  async verifyArticleNotInList(articleName: string, categoryName?: string) {
    if ((await this._articleListbox.isVisible()) === false) {
      await this._input.click();
    }
    await expect
      .poll(
        async () => {
          await this.typeArticleName(articleName);
          return await this._getArticleFromList(articleName, categoryName);
        },
        {
          timeout: 20000,
        }
      )
      .toBeNull();
  }
}
