import { Api } from "./api";
import { Category } from "./categoriesApi";

export type ShoppingCartItem = {
  id: number;
  article: {
    id: number;
    name: string;
  };
  category: Category;
  quantity: number;
  checked: boolean;
  sorted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export class ShoppingCartApi extends Api<ShoppingCartItem> {
  constructor(baseUrl: string) {
    super(baseUrl, "/shoppingCart");
  }
}
