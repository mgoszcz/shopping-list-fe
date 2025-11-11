import { Api } from "./api";

export type Category = {
  id: number;
  name?: string;
  updatedAt?: string;
  createdAt?: string;
};

export class CategoriesApi extends Api<Category> {
  constructor(baseUrl: string) {
    super(baseUrl, "/categories");
  }
}
