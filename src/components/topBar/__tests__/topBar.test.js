// __tests__/topBar.test.js
import userEvent from "@testing-library/user-event";
import TopBar from "../topBar";
import { render, screen, waitFor } from "@testing-library/react";
import React, { act } from "react";

const mockProcessor = {
  addCartItem: jest.fn(() => Promise.resolve()),
};

const mockShoppingCart = [
  {
    id: 1,
    article: {
      id: 1,
      name: "Apple",
    },
    category: {
      id: 1,
      name: "fruits",
    },
    quantity: 1,
    checked: false,
    sorted: false,
  },
];

const mockArticlesProcessor = {
  state: [
    { id: 1, name: "Apple", category: { id: 1, name: "fruits" } },
    { id: 2, name: "Banana", category: { id: 1, name: "fruits" } },
  ],
};

const mockSetEditingArticle = jest.fn();
const mockSetArticlePopupOpen = jest.fn();

test("add button is disabled initially", () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
    />
  );
  expect(screen.getByTestId("add-article-to-cart")).toBeDisabled();
});

test("clicking add with custom article opens popup", async () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
      _forceAddButtonEnabled={true}
    />
  );
  const addButton = screen.getByTestId("add-article-to-cart");
  const input = screen.getByRole("combobox");
  await act(() => userEvent.type(input, "Custom"));

  await waitFor(() => expect(addButton).toBeEnabled());
  await waitFor(() => expect(input.value).toBe("Custom"));
  await userEvent.click(addButton);
  expect(mockSetEditingArticle).toHaveBeenCalledWith({ name: "Custom", id: 0 });
  expect(mockSetArticlePopupOpen).toHaveBeenCalledWith(true);
});

test("clicking add with known article adds to cart", async () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
      _forceAddButtonEnabled={true}
    />
  );
  const addButton = screen.getByTestId("add-article-to-cart");
  const input = screen.getByRole("combobox");
  await act(() => userEvent.type(input, "Banana"));
  await waitFor(() => expect(addButton).toBeEnabled());
  await waitFor(() => expect(input.value).toBe("Banana"));
  await userEvent.click(addButton);

  await waitFor(() => {
    expect(mockProcessor.addCartItem).toHaveBeenCalledWith(2);
  });
});

test("disables Add button when input is empty", async () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
    />
  );
  const addButton = screen.getByTestId("add-article-to-cart");
  const input = screen.getByRole("combobox");
  await act(() => userEvent.type(input, "Banana"));
  await waitFor(() => expect(input.value).toBe("Banana"));
  await waitFor(() => expect(addButton).toBeEnabled());
  await act(() => userEvent.clear(input));
  await waitFor(() => expect(input.value).toBe(""));
  await waitFor(() => expect(addButton).toBeDisabled());
});
