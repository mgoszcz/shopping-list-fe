import { api } from "./api";
import logger from "../../logger/logger";
import { shopsEndpoints } from "../../constants/urls/shopsEndpoints";

export const getShopsData = async () => {
  const response = await api.get(shopsEndpoints.get);
  logger.debug(response);
  return response.data;
};
