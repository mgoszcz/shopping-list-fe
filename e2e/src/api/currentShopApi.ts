import axios, { AxiosInstance } from "axios";

export type CurrentShop = {
  shop_id: string;
  logo: string;
  name: string;
};

export class CurrentShopApi {
  private readonly basePath: string = "/currentShop";
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async setCurrentShop(shop_id: string) {
    await this.client.put(this.basePath, { shop_id });
  }
}
