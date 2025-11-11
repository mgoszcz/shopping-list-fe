import { CategoriesApi, Category } from "../api/categoriesApi";
import { generateRandomName } from "../utils/random";
import { Generator } from "./generator";

export class CategoryGenerator extends Generator<Category> {
  constructor(categoriesApi: CategoriesApi) {
    super({ main: categoriesApi });
  }

  async generate(item?: Partial<Category>): Promise<Partial<Category>> {
    if (item && item.name) {
      return { name: item.name };
    } else {
      return { name: generateRandomName("test_e2e_category") };
    }
  }
}
