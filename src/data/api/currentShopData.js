import { currentShopEndpoints } from "../../constants/urls/currentShopEndpoints";
import { api } from "./api";

export const getCurrentShop = async () => {
  const response = await api.get(currentShopEndpoints.get);
  return response.data;
};
