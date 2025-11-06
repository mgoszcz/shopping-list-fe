import { Locator, Page } from "@playwright/test";
import { ShopsDropdown } from "../components/dropdown/shopsDropdown";
import { AddShopDialog } from "../dialogs/AddShopDialog";
import { ConfirmationDialogBase } from "../dialogs/confirmationDialogBase";

export class BottomBarPage {
  private bottomBarRoot: Locator;
  shopsDropdown: ShopsDropdown;
  clearListButton: Locator;
  categoriesButton: Locator;
  editButton: Locator;
  addShopDialog: AddShopDialog;
  confirmRemovalDialog: ConfirmationDialogBase;

  constructor(page: Page) {
    this.bottomBarRoot = page.locator('[data-testid="bottom-bar"]');
    this.shopsDropdown = new ShopsDropdown(
      page,
      this.bottomBarRoot.locator(".MuiAutocomplete-root")
    );
    this.clearListButton = this.bottomBarRoot.getByRole("button", {
      name: /clear list/i,
    });
    this.categoriesButton = this.bottomBarRoot.getByRole("button", {
      name: /categories/i,
    });
    this.editButton = this.bottomBarRoot.getByRole("button", { name: /edit/i });
    this.addShopDialog = new AddShopDialog(page);
    this.confirmRemovalDialog = new ConfirmationDialogBase(page);
  }

  async addNewShop(shopName: string) {
    await this.shopsDropdown.clickAddShop();
    await this.addShopDialog.typeShopName(shopName);
    await this.addShopDialog.apply();
  }
}
