import { expect, Locator, Page } from "@playwright/test";

const selectors = {
  applyButton: '[role="button"]',
};

export class BaseDialog {
  protected _root;
  private _applyButton: Locator;
  private _cancelButton: Locator;

  constructor(page: Page) {
    this._root = page.locator(".MuiDialog-root");
    this._applyButton = page.getByRole("button", { name: "Apply" });
    this._cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async apply() {
    await this._applyButton.click();
  }

  async cancel() {
    await this._cancelButton.click();
  }

  async verifyApplyEnabled() {
    await expect(this._applyButton).toBeEnabled();
  }

  async verifyApplyDisabled() {
    await expect(this._applyButton).toBeDisabled();
  }

  async verifyDialogDisplayed(title: string) {
    await expect(this._root.getByText(title)).toBeVisible();
  }
}
