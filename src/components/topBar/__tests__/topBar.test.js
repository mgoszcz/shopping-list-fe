// __tests__/topBar.test.js
import TopBar from "../topBar";
import { render, screen, waitFor } from "@testing-library/react";

const mockProcessor = {
  addCartItem: jest.fn(() => Promise.resolve()),
};

const mockSetEditingArticle = jest.fn();
const mockSetArticlePopupOpen = jest.fn();
const mockSetSearchItem = jest.fn();
const mockSetAddButtonDisabled = jest.fn();

const searchItem = { id: null, name: "Custom" };

test("add button is disabled initially", () => {
  render(
    <TopBar
      searchItem={searchItem}
      setSearchItem={mockSetSearchItem}
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      addButtonDisabled={true}
    />
  );
  expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
});

test("clicking add with custom article opens popup", async () => {
  render(
    <TopBar
      searchItem={searchItem}
      setSearchItem={mockSetSearchItem}
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      addButtonDisabled={false}
    />
  );
  const addButton = screen.getByRole("button", { name: /add/i });
  await userEvent.click(addButton);
  expect(mockSetEditingArticle).toHaveBeenCalledWith({ name: "Custom", id: 0 });
  expect(mockSetArticlePopupOpen).toHaveBeenCalledWith(true);
});

test("clicking add with known article adds to cart", async () => {
  const knownItem = { id: 5, name: "Banana" };
  render(
    <TopBar
      searchItem={knownItem}
      setSearchItem={mockSetSearchItem}
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      addButtonDisabled={false}
    />
  );
  const addButton = screen.getByRole("button", { name: /add/i });
  await userEvent.click(addButton);

  await waitFor(() => {
    expect(mockProcessor.addCartItem).toHaveBeenCalledWith(5);
  });
});
