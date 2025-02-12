import { shoppingCartEndpoints } from "../../constants/urls/shoppingCartEndpoints";
import { api } from "./api";
import logger from "../../logger/logger";

export const getShoppingCartData = async () => {
  const response = await api.get(shoppingCartEndpoints.get);
  logger.debug(response);
  return response.data;
};

export const updateShoppingCartItem = async (itemId, itemData) => {
  const response = await api.put(shoppingCartEndpoints.put(itemId), itemData);
  logger.debug(response);
  return response;
};

export const deleteShoppingCartItem = async (itemId) => {
  const response = await api.delete(shoppingCartEndpoints.delete(itemId));
  logger.debug(response);
  return response;
};

export const addShoppingCartItem = async (articleId) => {
  const response = await api.post(shoppingCartEndpoints.post, {
    article: { id: articleId },
  });
  logger.debug(response);
  return response;
};

export const deleteUncheckedItems = async () => {
  const response = await api.delete(shoppingCartEndpoints.deleteAll, {
    params: {
      unchecked: true,
    },
  });
  logger.debug(response);
  return response;
};

export const deleteCheckedItems = async () => {
  const response = await api.delete(shoppingCartEndpoints.deleteAll, {
    params: {
      checked: true,
    },
  });
  logger.debug(response);
  return response;
};
