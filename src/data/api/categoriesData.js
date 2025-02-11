import { api } from "./api";
import { categoriesEndpoint } from "../../constants/urls/categoriesEndpoint";
import logger from "../../logger/logger";

export const getCategoriesData = async () => {
  const response = await api.get(categoriesEndpoint.get);
  logger.debug(response);
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post(categoriesEndpoint.post, category);
  logger.debug(response);
  return response;
};
