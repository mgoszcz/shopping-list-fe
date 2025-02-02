import { api } from "./api";
import { articlesEndpoints } from "../../constants/urls/articlesEndpoints";
import logger from "../../logger/logger";

export const getArticles = async () => {
  const response = await api.get(articlesEndpoints.get);
  logger.debug(response);
  return response.data;
};
