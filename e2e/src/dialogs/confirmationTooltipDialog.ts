import { expect, Locator } from "@playwright/test";

export class ConfirmationTooltipDialog {
  private confirmationRoot: Locator;
  constructor(root: Locator) {
    this.confirmationRoot = root.getByRole("tooltip");
  }

  async verifyTitle(expectedTitle: string) {
    await expect(this.confirmationRoot.locator("p")).toContainText(
      expectedTitle
    );
  }

  async cancel() {
    await this.confirmationRoot.getByRole("button", { name: "Cancel" }).click();
  }

  async confirm() {
    await this.confirmationRoot.getByRole("button", { name: "Yes" }).click();
  }
}
