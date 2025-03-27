import { api } from "./api";
import logger from "../../logger/logger";
import { categoryOrderEndpoint } from "../../constants/urls/categoryOrderEndpoint";

export const getCategoryOrderData = async (shopId) => {
  const response = await api.get(categoryOrderEndpoint.get(shopId));
  logger.debug(response);
  return response.data;
};
