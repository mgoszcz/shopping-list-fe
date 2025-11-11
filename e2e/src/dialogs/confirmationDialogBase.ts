import { expect, Locator, Page } from "@playwright/test";

export class ConfirmationDialogBase {
  protected root: Locator;
  private yes: Locator;
  private no: Locator;
  private text: Locator;

  constructor(page: Page) {
    this.root = page.locator(".MuiDialog-root");
    this.yes = this.root.getByRole("button", { name: /yes/i });
    this.no = this.root.getByRole("button", { name: /no/i });
    this.text = this.root.locator(".MuiDialogContent-root");
  }

  async verifyMessage(expectedText: string) {
    await expect(this.text).toHaveText(expectedText);
  }

  async confirm() {
    await this.yes.click();
  }

  async cancel() {
    await this.no.click();
  }
}
