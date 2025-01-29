import {
  deleteShoppingCartItem,
  updateShoppingCartItem,
} from "../api/shoppingCartData";

export class ShoppingCartDataProcessor {
  #state;
  #setState;

  constructor(state, setState) {
    this.#state = state;
    this.#setState = setState;
  }

  async toggleChecked(cartItem) {
    const newCheckedState = !cartItem.checked;
    const data = { quantity: cartItem.quantity, checked: newCheckedState };
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        console.log("Item edited successfully!");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id
              ? { ...item, checked: newCheckedState }
              : item,
          ),
        );
      })
      .catch((error) => {
        console.error("Failed to toggle checked state: ", error);
      });
  }

  async deleteCartItem(cartItem) {
    deleteShoppingCartItem(cartItem.id)
      .then(() => {
        console.log("Item removed successfully");
        this.#setState(this.#state.filter((item) => item.id !== cartItem.id));
      })
      .catch((error) => {
        console.error("Failed to delete item: ", error);
      });
  }

  async changeQuantity(cartItem, quantity) {
    if (!quantity) return;
    const data = { quantity, checked: cartItem.checked };
    updateShoppingCartItem(cartItem.id, data)
      .then(() => {
        console.log("Item edited successfully!");
        this.#setState(
          this.#state.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item,
          ),
        );
      })
      .catch((error) => {
        console.error("Failed to change quantity: ", error);
      });
  }
}
