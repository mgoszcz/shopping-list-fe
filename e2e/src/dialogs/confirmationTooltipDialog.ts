import { expect, Locator } from "@playwright/test";

export class ConfirmationTooltipDialog {
  private confirmationRoot: Locator;
  private cancelButton: Locator;
  private confirmButton: Locator;
  constructor(root: Locator) {
    this.confirmationRoot = root.getByRole("tooltip");
    this.cancelButton = this.confirmationRoot.getByRole("button", {
      name: /cancel/i,
    });
    this.confirmButton = this.confirmationRoot.getByRole("button", {
      name: /yes/i,
    });
  }

  async verifyTitle(expectedTitle: string) {
    await expect(this.confirmationRoot.locator("p")).toContainText(
      expectedTitle
    );
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }
}
