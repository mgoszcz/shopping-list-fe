import { api } from "./api";
import { articlesEndpoints } from "../../constants/urls/articlesEndpoints";
import logger from "../../logger/logger";

export const getArticles = async () => {
  const response = await api.get(articlesEndpoints.get);
  logger.debug(response);
  return response.data;
};

export const getArticleById = async (id) => {
  const response = await api.get(articlesEndpoints.getByID(id));
  logger.debug(response);
  return response.data;
};

export const updateArticle = async (id, article) => {
  const response = await api.put(articlesEndpoints.put(id), article);
  logger.debug(response);
  return response;
};

export const createArticle = async (article) => {
  const response = await api.post(articlesEndpoints.post, article);
  logger.debug(response);
  return response;
};

export const deleteArticle = async (id) => {
  const response = await api.delete(articlesEndpoints.delete(id));
  logger.debug(response);
  return response;
};
