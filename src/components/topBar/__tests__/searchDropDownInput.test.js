import React, { act } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchDropDownInput from "../searchDropDownInput";

const mockSetSearchItem = jest.fn();
const mockSetAddButtonDisabled = jest.fn();
const mockSetInputValues = jest.fn();
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

test("sets article on match", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
      setInputValue={mockSetInputValues}
    />
  );
  const input = screen.getByRole("combobox");
  await act(() => userEvent.type(input, "Banana"));
  await waitFor(() => {
    const found = mockSetSearchItem.mock.calls.some(([arg]) => arg?.id === 2);
    expect(found).toBe(true);
  });
});

test("sets custom article on no match", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={[]}
      articlesProcessor={mockArticlesProcessor}
      setInputValue={mockSetInputValues}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Kiwi");
  expect(mockSetSearchItem).toHaveBeenCalledWith({ id: null, name: "Kiwi" });
});

test("disables already-in-cart options", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={mockShoppingCart}
      articlesProcessor={mockArticlesProcessor}
      setInputValue={mockSetInputValues}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Apple");
  await waitFor(() => expect(input.value).toBe("Apple"));
  const listitem = screen.getByRole("option");
  expect(listitem).toHaveAttribute("aria-disabled", "true");
});

test("filters articles in dropdown", async () => {
  render(
    <SearchDropDownInput
      articles={sampleArticles}
      setSearchItem={mockSetSearchItem}
      setAddButtonDisabled={mockSetAddButtonDisabled}
      shoppingCart={mockShoppingCart}
      articlesProcessor={mockArticlesProcessor}
      setInputValue={mockSetInputValues}
    />
  );
  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  let listitems = screen.getAllByRole("option");
  expect(listitems.length).toBe(2);
  await userEvent.type(input, "ap");
  await waitFor(() => expect(input.value).toBe("ap"));
  listitems = screen.getAllByRole("option");
  expect(listitems.length).toBe(1);
  expect(within(listitems[0]).getByText(/apple/i)).toBeInTheDocument();
  await userEvent.clear(input);
  await userEvent.type(input, "ba");
  await waitFor(() => expect(input.value).toBe("ba"));
  listitems = screen.getAllByRole("option");
  expect(listitems.length).toBe(1);
  expect(within(listitems[0]).getByText(/banana/i)).toBeInTheDocument();
});
