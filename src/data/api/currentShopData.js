import { currentShopEndpoints } from "../../constants/urls/currentShopEndpoints";
import { api } from "./api";
import logger from "../../logger/logger";

export const getCurrentShop = async () => {
  const response = await api.get(currentShopEndpoints.get);
  logger.debug(response);
  return response.data;
};

export const updateCurrentShop = async (shopId) => {
  const response = await api.put(currentShopEndpoints.put, { shop_id: shopId });
  logger.debug(response);
  return response;
};
