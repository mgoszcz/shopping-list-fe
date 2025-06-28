// __tests__/shoppingCartPage.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import ShoppingCartPage from "../shoppingCartPage";

jest.mock("../../components/shoppingCart/shoppingCartCard", () => ({
  __esModule: true,
  default: ({ cartItem }) => (
    <div data-testid="mock-cart-card">Card: {cartItem.name}</div>
  ),
}));

jest.mock("../../popups/articlePopup", () => ({
  __esModule: true,
  default: ({ open }) =>
    open ? <div data-testid="mock-article-popup">Popup Open</div> : null,
}));

describe("ShoppingCartPage", () => {
  const mockCart = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
  ];

  const mockProps = {
    shoppingCart: mockCart,
    shoppingCartProcessor: {},
    articlePopupOpen: true,
    setArticlePopupOpen: jest.fn(),
    editingArticle: { id: 99, name: "Pear" },
    setEditingArticle: jest.fn(),
    articlesProcessor: {},
  };

  test("renders cart items", () => {
    render(<ShoppingCartPage {...mockProps} />);
    const items = screen.getAllByTestId("mock-cart-card");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Apple");
    expect(items[1]).toHaveTextContent("Banana");
  });

  test("shows ArticlePopup when open", () => {
    render(<ShoppingCartPage {...mockProps} articlePopupOpen={true} />);
    expect(screen.getByTestId("mock-article-popup")).toBeInTheDocument();
  });

  test("hides ArticlePopup when not open", () => {
    render(<ShoppingCartPage {...mockProps} articlePopupOpen={false} />);
    expect(screen.queryByTestId("mock-article-popup")).not.toBeInTheDocument();
  });
});
