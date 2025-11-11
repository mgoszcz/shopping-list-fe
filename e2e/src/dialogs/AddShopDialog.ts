import { expect, Locator, Page } from "@playwright/test";
import { BaseDialog } from "./baseDialog";

export class AddShopDialog extends BaseDialog {
  private shopNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.shopNameInput = this._root.locator("input.MuiInputBase-input");
  }

  async typeShopName(name: string) {
    this.shopNameInput.clear();
    this.shopNameInput.fill(name);
  }

  async verifyShopName(name: string) {
    await expect(this.shopNameInput).toHaveValue(name);
  }
}
