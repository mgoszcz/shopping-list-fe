import { Article, ArticleApi } from "../api/articleApi";
import { CategoriesApi } from "../api/categoriesApi";
import { ShoppingCartApi } from "../api/shoppingCartApi";
import { generateRandomName } from "../utils/random";
import { CategoryGenerator } from "./categoryGenerator";
import { Generator } from "./generator";

export class ArticleGenerator extends Generator<Article> {
  private categoryGenerator: CategoryGenerator;

  constructor(
    articlesApi: ArticleApi,
    categoriesApi: CategoriesApi,
    shoppingCartApi: ShoppingCartApi
  ) {
    super({
      main: articlesApi,
      categories: categoriesApi,
      shoppingCart: shoppingCartApi,
    });
    this.categoryGenerator = new CategoryGenerator(categoriesApi);
  }

  async registerGeneratedObjectByName(item: Partial<Article>) {
    const articles = await this.apis.main.list();
    for (const article of articles) {
      if (article.name === item.name) {
        this.createdItems.push(article);
        return;
      }
    }
    throw new Error(`Article with name ${item.name} does not exist in DB`);
  }

  private async _isArticleInShoppingCart(articleId: number) {
    const shoppingCartItems = await this.apis.shoppingCart.list();
    for (const item of shoppingCartItems) {
      if (item.article.id === articleId) {
        await this.apis.shoppingCart.delete(item.id);
      }
    }
  }

  async generate(item?: Partial<Article>): Promise<Partial<Article>> {
    const generatedArticle: Partial<Article> = {};
    if (item && item.category) {
      generatedArticle.category = {
        id: item.category.id,
        name: item.category.name,
      };
    } else {
      const category = await this.categoryGenerator.generateAndPost();
      generatedArticle.category = { id: category.id! };
    }
    if (item && item.name) {
      generatedArticle.name = item.name;
    } else {
      generatedArticle.name = generateRandomName("test_e2e_article");
    }
    return generatedArticle;
  }

  async cleanup(): Promise<void> {
    for (const item of this.createdItems) {
      await this._isArticleInShoppingCart(item.id);
      await this.apis.main.delete(item.id);
    }
    this.createdItems = [];
  }
}
