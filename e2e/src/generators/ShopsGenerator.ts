import { Shop, ShopsApi } from "../api/shopsApi";
import { generateRandomName } from "../utils/random";
import { Generator } from "./generator";

export class ShopsGenerator extends Generator<Shop> {
  constructor(shopsApi: ShopsApi) {
    super({ main: shopsApi });
  }

  async generate(item?: Partial<Shop>): Promise<Partial<Shop>> {
    if (item && item.name) {
      return { name: item.name, logo: "logo" };
    } else {
      return { name: generateRandomName("test_e2e_shop"), logo: "logo" };
    }
  }
}
