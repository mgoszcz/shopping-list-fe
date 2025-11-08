import { Locator, Page } from "@playwright/test";
import { AddShopDialog } from "./AddShopDialog";
import { ConfirmationTooltipDialog } from "./confirmationTooltipDialog";

export class EditShopDialog extends AddShopDialog {
  private removeShopButton: Locator;
  private confirmationDialog: ConfirmationTooltipDialog;

  constructor(page: Page) {
    super(page);
    this.removeShopButton = this._root.getByRole("button", {
      name: /remove shop/i,
    });
    this.confirmationDialog = new ConfirmationTooltipDialog(this._root);
  }

  async removeShop() {
    await this.removeShopButton.click();
    await this.confirmationDialog.verifyTitle(
      "Are you sure you want to delete shop"
    );
    await this.confirmationDialog.confirm();
  }
}
