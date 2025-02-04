import {
  addShoppingCartItem,
  deleteShoppingCartItem,
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
    deleteShoppingCartItem(cartItem.id)
      .then(() => {
        logger.debug("Remove cart item request accepted");
        this.#setState(this.#state.filter((item) => item.id !== cartItem.id));
      })
      .catch((error) => {
        logger.error("Failed to delete item: ", error);
      });
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
}
