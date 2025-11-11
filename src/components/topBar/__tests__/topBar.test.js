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

test("hitting enter with custom article opens popup", async () => {
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
  await userEvent.type(input, "{enter}");
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

test("hitting enter with known article adds to cart", async () => {
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
  await userEvent.type(input, "{enter}");

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

test("hitting enter with empty article does nothing", async () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
      _forceAddButtonEnabled={false}
    />
  );
  const addButton = screen.getByTestId("add-article-to-cart");
  const input = screen.getByRole("combobox");
  await act(() => userEvent.clear(input));

  await waitFor(() => expect(input.value).toBe(""));
  await userEvent.type(input, "{enter}");
  expect(mockSetEditingArticle).not.toHaveBeenCalledWith({ name: "", id: 0 });
  expect(mockSetArticlePopupOpen).not.toHaveBeenCalledWith(true);
  expect(mockProcessor.addCartItem).not.toHaveBeenCalled();
});

test("hitting enter with article on list does nothing", async () => {
  render(
    <TopBar
      setEditingArticle={mockSetEditingArticle}
      setArticlePopupOpen={mockSetArticlePopupOpen}
      shoppingCartProcessor={mockProcessor}
      articlesProcessor={mockArticlesProcessor}
      shoppingCart={mockShoppingCart}
      _forceAddButtonEnabled={false}
    />
  );
  const addButton = screen.getByTestId("add-article-to-cart");
  const input = screen.getByRole("combobox");
  await act(() => userEvent.type(input, "Apple"));
  await waitFor(() => expect(addButton).toBeDisabled());
  await waitFor(() => expect(input.value).toBe("Apple"));
  await userEvent.type(input, "{enter}");

  await waitFor(() => {
    expect(mockProcessor.addCartItem).not.toHaveBeenCalledWith(2);
  });
});
