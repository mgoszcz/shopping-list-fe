import { createArticle, deleteArticle } from "../api/articleApi";
import { createCategory } from "../api/categoriesApi";
import { generateRandomName } from "../utils/random";

export class ArticleGenerator {
  private _createdObjectsIds: number[] = [];

  private async _createCategory() {
    const name = generateRandomName("category_e2e_test");
    const categoryId = await createCategory(name);
    return categoryId;
  }

  async generateArticle(articleName?: string, categoryId?: number) {
    const name = articleName || generateRandomName("article_e2e_test");
    const category = categoryId || (await this._createCategory());
    const articleId = await createArticle(name, category);

    this._createdObjectsIds.push(articleId);
  }

  async cleanup() {
    for (const id of this._createdObjectsIds) {
      await deleteArticle(id);
    }
  }
}
