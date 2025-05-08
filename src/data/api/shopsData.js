import { api } from "./api";
import logger from "../../logger/logger";
import { shopsEndpoints } from "../../constants/urls/shopsEndpoints";

export const getShopsData = async () => {
  const response = await api.get(shopsEndpoints.get);
  logger.debug(response);
  return response.data;
};

export const createShop = async (shopData) => {
  const response = await api.post(shopsEndpoints.post, shopData);
  logger.debug(response);
  return response;
};
