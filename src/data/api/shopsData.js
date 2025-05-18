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

export const updateShop = async (id, shopData) => {
  const response = await api.put(shopsEndpoints.put(id), shopData);
  logger.debug(response);
  return response;
};

export const deleteShop = async (id) => {
  const response = await api.delete(shopsEndpoints.delete(id));
  logger.debug(response);
  return response;
};
