import { CurrentShopApi } from "../api/currentShopApi";
import { Shop, ShopsApi } from "../api/shopsApi";
import { generateRandomName } from "../utils/random";
import { Generator } from "./generator";

export class ShopsGenerator extends Generator<Shop> {
  constructor(
    shopsApi: ShopsApi,
    private currentShopApi: CurrentShopApi
  ) {
    super({ main: shopsApi });
  }

  async setCurrentShop(item: Partial<Shop>) {
    if (!item.id) {
      throw new Error("Shop id is required");
    }
    this.currentShopApi.setCurrentShop(item.id.toString());
  }

  async registerGeneratedObjectByName(item: Partial<Shop>) {
    const shops = await this.apis.main.list();
    for (const shop of shops) {
      if (shop.name === item.name) {
        this.createdItems.push(shop);
        return;
      }
    }
    throw new Error(`Shop with name ${item.name} does not exist in DB`);
  }

  async generate(item?: Partial<Shop>): Promise<Partial<Shop>> {
    if (item && item.name) {
      return { name: item.name, logo: "logo" };
    } else {
      return { name: generateRandomName("test_e2e_shop"), logo: "logo" };
    }
  }
}
