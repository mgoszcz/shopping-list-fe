import {
  addShoppingCartItem,
  deleteCheckedItems,
  deleteShoppingCartItem,
  deleteUncheckedItems,
  getShoppingCartData,
  updateShoppingCartItem,
} from "../api/shoppingCartData";
import logger from "../../logger/logger";
import { synchState } from "../../constants/synchState";

export class ShoppingCartDataProcessor {
  #state;
  #setState;
  synchronizationState;
  #setSynchronizationState;

  constructor(state, setState, syncState, setSyncState) {
    this.#state = state;
    this.#setState = setState;
    this.synchronizationState = syncState;
    this.#setSynchronizationState = setSyncState;
  }

  async getShoppingCartItems() {
    this.#setSynchronizationState(synchState.FETCHING);
    getShoppingCartData()
      .then((data) => {
        this.#setState(data);
        logger.debug("Fetching ShoppingCart");
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to get shopping cart data", error);
        this.#setSynchronizationState(synchState.ERROR);
      });
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
    this.#setSynchronizationState(synchState.SENDING);
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        logger.debug("Toggle checked state request accepted");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id
              ? { ...item, checked: newCheckedState }
              : item
          )
        );
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to toggle checked state: ", error);
        this.#setSynchronizationState(synchState.ERROR);
      });
  }

  async deleteCartItem(cartItem) {
    try {
      this.#setSynchronizationState(synchState.SENDING);
      await deleteShoppingCartItem(cartItem.id);
      this.#setSynchronizationState(synchState.SYNCHED);
      logger.debug("Remove cart item request accepted");
      this.#setState(this.#state.filter((item) => item.id !== cartItem.id));
    } catch (error) {
      logger.error("Failed to delete item: ", error);
      this.#setSynchronizationState(synchState.ERROR);
    }
  }

  async changeQuantity(cartItem, quantity) {
    if (!quantity) return;
    const data = { quantity, checked: cartItem.checked };
    this.#setSynchronizationState(synchState.SENDING);
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        logger.debug("Update quantity request accepted");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item
          )
        );
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to change quantity: ", error);
        this.#setSynchronizationState(synchState.ERROR);
      });
  }

  async addCartItem(articleId) {
    this.#setSynchronizationState(synchState.SENDING);
    return addShoppingCartItem(articleId)
      .then(() => {
        logger.debug("Add cart item request accepted");
        this.getShoppingCartItems();
        this.#setSynchronizationState(synchState.SYNCHED);
        return true;
      })
      .catch((error) => {
        logger.error("Failed to add item: ", error);
        this.#setSynchronizationState(synchState.ERROR);
        return false;
      });
  }

  async deleteAllCheckedItems() {
    this.#setSynchronizationState(synchState.SENDING);
    return deleteCheckedItems()
      .then(() => {
        logger.debug("Delete checked items request accepted");
        this.getShoppingCartItems();
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to delete checked items: ", error);
        this.#setSynchronizationState(synchState.ERROR);
        return false;
      });
  }

  async deleteAllUnCheckedItems() {
    this.#setSynchronizationState(synchState.SENDING);
    return deleteUncheckedItems()
      .then(() => {
        logger.debug("Delete unchecked items request accepted");
        this.getShoppingCartItems();
        this.#setSynchronizationState(synchState.SYNCHED);
      })
      .catch((error) => {
        logger.error("Failed to delete unchecked items: ", error);
        this.#setSynchronizationState(synchState.ERROR);
        return false;
      });
  }
}
