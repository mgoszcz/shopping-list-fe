import { timestampEndpoints } from "../../constants/urls/timestampEndpoints";
import { api } from "./api";

export const getTimestampData = async () => {
  const response = await api.get(timestampEndpoints.get);
  return response.data;
};
