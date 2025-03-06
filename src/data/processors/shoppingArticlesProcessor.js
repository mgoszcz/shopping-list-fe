import { synchState } from "../../constants/synchState";
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
  synchronizationState;
  #setSynchronizationState;

  constructor(
    state,
    setState,
    shoppingCartProcessor,
    synchState,
    setSynchState
  ) {
    this.state = state;
    this.#setState = setState;
    this.#shoppingCartProcessor = shoppingCartProcessor;
    this.synchronizationState = synchState;
    this.#setSynchronizationState = setSynchState;
  }

  async getShoppingArticlesData() {
    this.#setState([]);
    this.#setSynchronizationState(synchState.FETCHING);
    getArticles()
      .then((data) => {
        this.#setState(data);
        logger.debug("Fetching ShoppingArticles");
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to get shopping articles data", error);
        this.#setSynchronizationState(synchState.ERROR);
      });
  }

  async getArticleById(id) {
    return await getArticleById(id);
  }

  async editArticle(article, newData) {
    this.#setSynchronizationState(synchState.SENDING);
    updateArticle(article.id, newData)
      .then(() => {
        logger.debug("Update article request accepted");
        this.#setState(
          this.state.map((item) =>
            item.id === article.id
              ? { ...item, name: item.name, category: { id: item.category.id } }
              : item
          )
        );
        this.#shoppingCartProcessor.getShoppingCartItems();
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to update article: ", error);
        this.#setSynchronizationState(synchState.ERROR);
      });
  }

  async createArticle(newArticle, addToCart = false) {
    this.#setSynchronizationState(synchState.SENDING);
    const response = await createArticle(newArticle);
    this.#setSynchronizationState(synchState.SYNCHED);
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
      this.#setSynchronizationState(synchState.SENDING);
      await deleteArticle(article.id);
      logger.debug("Delete article request accepted");
      this.#setState(this.state.filter((item) => item.id !== article.id));
      this.#setSynchronizationState(synchState.SYNCHED);
    } catch (error) {
      logger.error("Failed to delete article: ", error);
      this.#setSynchronizationState(synchState.ERROR);
    }
  }
}
