// __tests__/articlePopup.test.js

jest.mock("../../data/api/categoriesData", () => ({
  createCategory: jest
    .fn()
    .mockResolvedValue({ data: { name: "newCategory", id: 99 } }),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlePopup from "../articlePopup";
import { createCategory } from "../../data/api/categoriesData";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  jest.clearAllMocks();
  createCategory.mockResolvedValue({ data: { name: "newCategory", id: 99 } });
});

describe("ArticlePopup", () => {
  const mockSetOpen = jest.fn();

  const mockArticle = { id: 0, name: "Milk" };

  const mockArticlesProcessor = {
    getArticleById: jest.fn(() => {
      console.log("IN");
      return Promise.resolve({
        id: 1,
        name: "Milk",
        category: { id: 1, name: "fruits" },
      });
    }),
    createArticle: jest.fn().mockResolvedValue({ ok: true }),
  };

  describe("AddArticlePopup", () => {
    test("renders with proper title and cancel button works", async () => {
      render(
        <ArticlePopup
          open={true}
          setOpen={mockSetOpen}
          article={mockArticle}
          articlesProcessor={mockArticlesProcessor}
        />
      );

      const dialogTitle = screen.getByTestId("add-edit-article-dialog-title");
      const articleName = screen.getByRole("textbox", {
        name: /article name/i,
      });
      const removeButton = screen.getByRole("button", {
        name: /remove article/i,
      });
      await waitFor(() => {
        expect(dialogTitle).toHaveTextContent("Add article");
        expect(articleName).toBeInTheDocument();
        expect(articleName).toHaveValue("Milk");
        expect(removeButton).not.toBeVisible();
      });

      const closeButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(closeButton);

      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("apply adds article with existing category", async () => {
    const user = userEvent.setup();

    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
        _selectedCategoryOverride={{ id: 1, name: "fruits" }}
      />
    );
    const applyButton = screen.getByRole("button", { name: /apply/i });
    await waitFor(() => expect(applyButton).toBeEnabled());
    await user.click(applyButton);
    await waitFor(() => {
      expect(mockArticlesProcessor.createArticle).toHaveBeenCalled();
      expect(mockArticlesProcessor.createArticle).toHaveBeenCalledWith(
        {
          name: "Milk",
          category: { id: 1, name: "fruits" },
        },
        true
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("apply adds article with new category", async () => {
    const user = userEvent.setup();

    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
        _selectedCategoryOverride={{ name: "newCategory" }}
      />
    );
    const applyButton = screen.getByRole("button", { name: /apply/i });
    await waitFor(() => expect(applyButton).toBeEnabled());
    await user.click(applyButton);
    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: "newCategory" });
      expect(mockArticlesProcessor.createArticle).toHaveBeenCalled();
      expect(mockArticlesProcessor.createArticle).toHaveBeenCalledWith(
        {
          name: "Milk",
          category: { id: 99, name: "newCategory" },
        },
        true
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
