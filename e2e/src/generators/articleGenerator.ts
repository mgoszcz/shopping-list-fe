import { Article, ArticleApi } from "../api/articleApi";
import { CategoriesApi } from "../api/categoriesApi";
import { generateRandomName } from "../utils/random";
import { CategoryGenerator } from "./categoryGenerator";
import { Generator } from "./generator";

export class ArticleGenerator extends Generator<Article> {
  private categoryGenerator: CategoryGenerator;

  constructor(articlesApi: ArticleApi, categoriesApi: CategoriesApi) {
    super({ main: articlesApi, categories: categoriesApi });
    this.categoryGenerator = new CategoryGenerator(categoriesApi);
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
}
