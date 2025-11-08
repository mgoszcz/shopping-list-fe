import { expect, Locator, Page } from "@playwright/test";
import { AddShopDialog } from "../../dialogs/AddShopDialog";

export class ShopsDropdown {
  private label: Locator;
  private input: Locator;
  private shopsListBox: Locator;

  constructor(
    private page: Page,
    private root: Locator
  ) {
    this.shopsListBox = this.page.locator(".MuiPopper-root ul");
    this.input = this.root.locator("input.MuiInputBase-input");
    this.label = this.root.locator("label.MuiInputLabel-root");
  }

  async verifyCurrentShop(expectedName: string) {
    await expect(this.input).toHaveValue(expectedName, { timeout: 10000 });
  }

  async verifyShopOnTheList(shopName: string) {
    if ((await this.shopsListBox.isVisible()) === false) {
      await this.input.click();
    }
    await expect
      .poll(
        async () => {
          const shop = await this.getShopFromList(shopName);
          return shop;
        },
        {
          timeout: 10000,
        }
      )
      .toBeTruthy();
  }

  async verifyShopNotOnTheList(shopName: string) {
    if ((await this.shopsListBox.isVisible()) === false) {
      await this.input.click();
    }
    await expect
      .poll(
        async () => {
          const shop = await this.getShopFromList(shopName);
          return shop;
        },
        {
          timeout: 10000,
        }
      )
      .toBeNull();
  }

  async selectCurrentShop(shopName: string) {
    if ((await this.shopsListBox.isVisible()) === false) {
      await this.input.click();
    }
    await this.verifyShopOnTheList(shopName);
    const shop = await this.getShopFromList(shopName);
    await shop!.click();
  }

  async clickAddShop() {
    if ((await this.shopsListBox.isVisible()) === false) {
      await this.input.click();
    }
    const item = await this.getShopFromList("Add Shop...");
    await item!.click();
  }

  private async getShopFromList(shopName: string): Promise<Locator | null> {
    const items = await this.shopsListBox.locator("li").all();
    for (const item of items) {
      const itemName = await item.locator("h6").textContent();
      if (itemName === shopName) {
        return item;
      }
    }
    return null;
  }
}
