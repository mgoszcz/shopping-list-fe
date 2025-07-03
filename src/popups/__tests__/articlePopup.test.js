// __tests__/articlePopup.test.js

jest.mock("../../data/api/categoriesData", () => ({
  getCategoriesData: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Fruits" },
      { id: 2, name: "Vegetables" },
    ])
  ),
  createCategory: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArticlePopup from "../articlePopup";
import {
  createCategory,
  getCategoriesData,
} from "../../data/api/categoriesData";
import { isEditable } from "@testing-library/user-event/dist/cjs/utils/index.js";

describe("ArticlePopup", () => {
  const mockSetOpen = jest.fn();
  const mockSetEditingArticle = jest.fn();

  const mockArticle = { id: 1, name: "Milk" };

  const mockArticlesProcessor = {
    getArticleById: jest.fn(() => {
      console.log("IN");
      return Promise.resolve({
        id: 1,
        name: "Milk",
        category: { id: 1, name: "fruits" },
      });
    }),
  };

  test("renders with editingArticle and close button works", () => {
    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
      />
    );

    expect(screen.getByText(/milk/i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
