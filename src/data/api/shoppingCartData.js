import { shoppingCartEndpoints } from "../../constants/urls/shoppingCartEndpoints";
import { api } from "./api";

export const getShoppingCartData = async () => {
  const response = await api.get(shoppingCartEndpoints.get);
  return response.data;
};

export const updateShoppingCartItem = async (itemId, itemData) => {
  const response = await api.put(shoppingCartEndpoints.put(itemId), itemData);
  return response;
};

export const deleteShoppingCartItem = async (itemId) => {
  const response = await api.delete(shoppingCartEndpoints.delete(itemId));
  return response;
};
