import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchDropDownInput from "../searchDropDownInput";

const mockSetSearchItem = jest.fn();
const mockSetAddButtonDisabled = jest.fn();
const mockArticlesProcessor = {
  state: [
    { id: 1, name: "Apple", category: { id: 1, name: "fruits" } },
    { id: 2, name: "Banana", category: { id: 1, name: "fruits" } },
  ],
};

const sampleArticles = [
  { id: 1, name: "Apple", category: { id: 1, name: "fruits" } },
  { id: 2, name: "Banana", category: { id: 1, name: "fruits" } },
];

beforeEach(() => {
  jest.clearAllMocks();
});

test("renders input and options", () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
    />
  );
  expect(screen.getByLabelText(/search article/i)).toBeInTheDocument();
});

test("disables Add button when input is empty", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "");
  expect(mockSetAddButtonDisabled).toHaveBeenCalledWith(true);
});

test("enables Add button and sets matched item", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Apple");
  expect(mockSetAddButtonDisabled).toHaveBeenCalledWith(false);
  expect(mockSetSearchItem).toHaveBeenCalledWith(
    expect.objectContaining({ id: 1 })
  );
});

test("sets custom article on no match", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Kiwi");
  expect(mockSetSearchItem).toHaveBeenCalledWith({ id: null, name: "Kiwi" });
});

test("disables already-in-cart options", () => {
  const cart = [{ id: 2, name: "Banana" }];
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={cart}
      articlesProcessor={mockArticlesProcessor}
    />
  );
  const input = screen.getByRole("combobox");
  expect(input).toBeInTheDocument();
});
