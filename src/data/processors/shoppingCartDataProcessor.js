import {
  addShoppingCartItem,
  deleteCheckedItems,
  deleteShoppingCartItem,
  deleteUncheckedItems,
  getShoppingCartData,
  updateShoppingCartItem,
} from "../api/shoppingCartData";
import logger from "../../logger/logger";

export class ShoppingCartDataProcessor {
  #state;
  #setState;

  constructor(state, setState) {
    this.#state = state;
    this.#setState = setState;
  }

  async getShoppingCartItems() {
    getShoppingCartData()
      .then((data) => {
        this.#setState(data);
        logger.debug("Fetching ShoppingCart");
      })
      .catch((error) =>
        logger.error("Failed to get shopping cart data", error),
      );
  }

  async getCartItemByArticleId(articleId) {
    return this.#state.find((item) => item.article.id === articleId);
  }

  getCheckedItems() {
    return this.#state.filter((item) => item.checked);
  }

  getUncheckedItems() {
    return this.#state.filter((item) => !item.checked);
  }

  isEmpty() {
    return this.#state.length === 0;
  }

  async toggleChecked(cartItem) {
    const newCheckedState = !cartItem.checked;
    const data = { quantity: cartItem.quantity, checked: newCheckedState };
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        logger.debug("Toggle checked state request accepted");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id
              ? { ...item, checked: newCheckedState }
              : item,
          ),
        );
      })
      .catch((error) => {
        logger.error("Failed to toggle checked state: ", error);
      });
  }

  async deleteCartItem(cartItem) {
    try {
      await deleteShoppingCartItem(cartItem.id);
      logger.debug("Remove cart item request accepted");
      this.#setState(this.#state.filter((item) => item.id !== cartItem.id));
    } catch (error) {
      logger.error("Failed to delete item: ", error);
    }
  }

  async changeQuantity(cartItem, quantity) {
    if (!quantity) return;
    const data = { quantity, checked: cartItem.checked };
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        logger.debug("Update quantity request accepted");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item,
          ),
        );
      })
      .catch((error) => {
        logger.error("Failed to change quantity: ", error);
      });
  }

  async addCartItem(articleId) {
    return addShoppingCartItem(articleId)
      .then(() => {
        logger.debug("Add cart item request accepted");
        this.getShoppingCartItems();
        return true;
      })
      .catch((error) => {
        logger.error("Failed to add item: ", error);
        return false;
      });
  }

  async deleteAllCheckedItems() {
    return deleteCheckedItems()
      .then(() => {
        logger.debug("Delete checked items request accepted");
        this.getShoppingCartItems();
      })
      .catch((error) => {
        logger.error("Failed to delete checked items: ", error);
        return false;
      });
  }

  async deleteAllUnCheckedItems() {
    return deleteUncheckedItems()
      .then(() => {
        logger.debug("Delete unchecked items request accepted");
        this.getShoppingCartItems();
      })
      .catch((error) => {
        logger.error("Failed to delete unchecked items: ", error);
        return false;
      });
  }
}
