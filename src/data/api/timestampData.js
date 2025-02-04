import { timestampEndpoints } from "../../constants/urls/timestampEndpoints";
import { api } from "./api";
import logger from "../../logger/logger";

export const getTimestampData = async () => {
  const response = await api.get(timestampEndpoints.get);
  logger.debug(response);
  return response.data;
};
