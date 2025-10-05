import { Api } from "../api/api";
import { Identifiable } from "../types/basicObject";

export abstract class Generator<T extends Identifiable> {
  protected createdItems: T[] = [];

  constructor(protected apis: Record<string, Api<any>>) {}

  abstract generate(item?: Partial<T>): Promise<Partial<T>>;

  async generateAndPost(item?: Partial<T>): Promise<Partial<T>> {
    const objectToCreate = await this.generate(item);
    const createdItem = await this.apis.main.create(objectToCreate);
    this.createdItems.push(createdItem);
    return createdItem;
  }

  async cleanup() {
    for (const item of this.createdItems) {
      try {
        await this.apis.main.delete(item.id);
      } catch (error) {
        console.log(`Cleanup error: ${error}`);
      }
    }
    this.createdItems = [];
  }
}
