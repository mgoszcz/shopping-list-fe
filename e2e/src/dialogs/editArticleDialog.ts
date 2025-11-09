import { Locator, Page } from "@playwright/test";
import { AddArticleDialog } from "./addArticleDialog";
import { ConfirmationTooltipDialog } from "./confirmationTooltipDialog";

export class EditArticleDialog extends AddArticleDialog {
  private removeArticleButton: Locator;
  private confirmationDialog: ConfirmationTooltipDialog;

  constructor(page: Page) {
    super(page);
    this.removeArticleButton = this._root.getByRole("button", {
      name: /remove article/i,
    });
    this.confirmationDialog = new ConfirmationTooltipDialog(this._root);
  }

  async removeArticle() {
    await this.removeArticleButton.click();
    await this.confirmationDialog.verifyTitle(
      "Are you sure you want to delete article"
    );
    await this.confirmationDialog.confirm();
  }
}
