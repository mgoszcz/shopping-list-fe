import { Locator, Page } from "@playwright/test";
import { AddArticleDialog } from "./addArticleDialog";
import { ConfirmationDialog } from "./confirmationDialog";

export class EditArticleDialog extends AddArticleDialog {
  private removeArticleButton: Locator;
  private confirmationDialog: ConfirmationDialog;

  constructor(page: Page) {
    super(page);
    this.removeArticleButton = this._root.getByRole("button", {
      name: "Remove Article",
    });
    this.confirmationDialog = new ConfirmationDialog(this._root);
  }

  async removeArticle() {
    await this.removeArticleButton.click();
    await this.confirmationDialog.verifyTitle(
      "Are you sure you want to delete article"
    );
    await this.confirmationDialog.confirm();
  }
}
