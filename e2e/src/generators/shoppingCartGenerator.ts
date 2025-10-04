import { ArticleApi } from "../api/articleApi";
import { CategoriesApi } from "../api/categoriesApi";
import { ShoppingCartApi, ShoppingCartItem } from "../api/shoppingCartApi";
import { ArticleGenerator } from "./articleGenerator";
import { Generator } from "./generator";

export class ShoppingCartGenerator extends Generator<ShoppingCartItem> {
  private articleGenerator: ArticleGenerator;

  constructor(
    shoppingCartApi: ShoppingCartApi,
    articlesApi: ArticleApi,
    categoriesApi: CategoriesApi
  ) {
    super({
      main: shoppingCartApi,
      articles: articlesApi,
      categories: categoriesApi,
    });
    this.articleGenerator = new ArticleGenerator(
      articlesApi,
      categoriesApi,
      shoppingCartApi
    );
  }

  async generate(
    item?: Partial<ShoppingCartItem>
  ): Promise<Partial<ShoppingCartItem>> {
    const generatedItem: Partial<ShoppingCartItem> = {};
    if (item && item.article) {
      generatedItem.article = item.article;
      if (item.category) {
        generatedItem.category = item.category;
      } else {
        const article = await this.apis.articlesApi.get(
          item.article.id!.toString()
        );
        generatedItem.category = {
          id: article.category?.id!,
          name: article.category?.name!,
        };
      }
    } else {
      let article;
      if (item && item.category) {
        article = await this.articleGenerator.generateAndPost({
          category: item.category,
        });
      } else {
        article = await this.articleGenerator.generateAndPost();
      }

      generatedItem.article = { id: article.id!, name: article.name! };
      generatedItem.category = {
        id: article.category?.id!,
        name: article.category?.name!,
      };
    }
    return generatedItem;
  }

  async cleanup(): Promise<void> {
    for (const item of this.createdItems) {
      await this.apis.main.delete(item.id);
    }
    this.createdItems = [];
    await this.articleGenerator.cleanup();
  }
}
