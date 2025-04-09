import { api } from "./api";
import logger from "../../logger/logger";
import { categoryOrderEndpoint } from "../../constants/urls/categoryOrderEndpoint";

export const getCategoryOrderData = async (shopId) => {
  const response = await api.get(categoryOrderEndpoint.get(shopId));
  logger.debug(response);
  return response.data;
};

export const setCategoryOrderData = async (shopId, orderData) => {
  const response = await api.put(categoryOrderEndpoint.put(shopId), orderData);
  logger.debug(response);
  return response;
};
