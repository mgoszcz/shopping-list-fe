import logger from "../../logger/logger";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from "../api/articlesData";

export class ShoppingArticlesProcessor {
  state;
  #setState;
  #shoppingCartProcessor;

  constructor(state, setState, shoppingCartProcessor) {
    this.state = state;
    this.#setState = setState;
    this.#shoppingCartProcessor = shoppingCartProcessor;
  }

  clearState() {
    this.#setState([]);
  }

  async getShoppingArticlesData() {
    await getArticles()
      .then((data) => {
        this.#setState(data);
        logger.debug("Fetching ShoppingArticles");
      })
      .catch((error) =>
        logger.error("Failed to get shopping articles data", error),
      );
  }

  async getArticleById(id) {
    return await getArticleById(id);
  }

  async editArticle(article, newData) {
    updateArticle(article.id, newData)
      .then(() => {
        logger.debug("Update article request accepted");
        this.#setState(
          this.state.map((item) =>
            item.id === article.id
              ? { ...item, name: item.name, category: { id: item.category.id } }
              : item,
          ),
        );
        this.#shoppingCartProcessor.getShoppingCartItems();
      })
      .catch((error) => {
        logger.error("Failed to update article: ", error);
      });
  }

  async createArticle(newArticle, addToCart = false) {
    const response = await createArticle(newArticle);
    const { updatedAt, createdAt, ...newArticleObject } = response.data;
    const newArticleId = newArticleObject.id;
    this.#setState([...this.state, newArticleObject]);
    if (!addToCart) return;
    logger.debug(newArticleId);
    await this.#shoppingCartProcessor.addCartItem(newArticleId);
  }

  async removeArticle(article) {
    try {
      const shoppingCartItems =
        await this.#shoppingCartProcessor.getCartItemByArticleId(article.id);
      if (shoppingCartItems) {
        await this.#shoppingCartProcessor.deleteCartItem(shoppingCartItems);
      }
      await deleteArticle(article.id);
      logger.debug("Delete article request accepted");
      this.#setState(this.state.filter((item) => item.id !== article.id));
    } catch (error) {
      logger.error("Failed to delete article: ", error);
    }
  }
}
