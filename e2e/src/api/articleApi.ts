import { Api } from "./api";
import { Category } from "./categoriesApi";

export type Article = {
  id: number;
  name: string;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
};

export class ArticleApi extends Api<Article> {
  constructor(baseUrl: string) {
    super(baseUrl, "/shoppingArticles");
  }
}
