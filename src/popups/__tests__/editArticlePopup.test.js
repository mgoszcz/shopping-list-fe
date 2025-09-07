// __tests__/articlePopup.test.js

jest.mock("../../data/api/categoriesData", () => ({
  createCategory: jest
    .fn()
    .mockResolvedValue({ data: { name: "newCategory", id: 99 } }),
  getCategoriesData: jest.fn().mockResolvedValue([
    { id: 1, name: "fruits" },
    { id: 2, name: "vegetables" },
  ]),
}));

const mockArticlesProcessor = {
  getArticleById: jest.fn(),
  createArticle: jest.fn(),
  editArticle: jest.fn(),
  removeArticle: jest.fn(),
};

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlePopup from "../articlePopup";
import {
  createCategory,
  getCategoriesData,
} from "../../data/api/categoriesData";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  jest.clearAllMocks();
  createCategory.mockResolvedValue({ data: { name: "newCategory", id: 99 } });
  getCategoriesData.mockResolvedValue([
    { id: 1, name: "fruits" },
    { id: 2, name: "vegetables" },
  ]);
  mockArticlesProcessor.getArticleById.mockResolvedValue({
    id: 1,
    name: "Milk",
    category: { id: 1, name: "fruits" },
  });
  mockArticlesProcessor.editArticle.mockResolvedValue({ ok: true });
  mockArticlesProcessor.removeArticle.mockResolvedValue({ ok: true });
});

describe("EditArticlePopup", () => {
  const mockSetOpen = jest.fn();

  const mockArticle = { id: 1, name: "Milk" };

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
    const categoryCombo = screen.getByRole("combobox", { name: /category/i });
    await waitFor(() => {
      expect(dialogTitle).toHaveTextContent("Edit article");
      expect(articleName).toBeInTheDocument();
      expect(articleName).toHaveValue("Milk");
      expect(removeButton).toBeVisible();
      expect(categoryCombo).toHaveValue("fruits");
    });

    const closeButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test("apply edits article name", async () => {
    const user = userEvent.setup();

    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
      />
    );
    const articleName = screen.getByRole("textbox", {
      name: /article name/i,
    });

    await user.type(articleName, "editedArticle");

    const applyButton = screen.getByRole("button", { name: /apply/i });
    await waitFor(() => expect(applyButton).toBeEnabled());
    await user.click(applyButton);
    await waitFor(() => {
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalled();
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalledWith(
        mockArticle,
        {
          id: mockArticle.id,
          name: "MilkeditedArticle",
          category: { id: 1, name: "fruits" },
        }
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("apply edits article with new category", async () => {
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
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalled();
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalledWith(
        mockArticle,
        {
          id: mockArticle.id,
          name: "Milk",
          category: { id: 99, name: "newCategory" },
        }
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("apply edits article with existing category", async () => {
    const user = userEvent.setup();
    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
        _selectedCategoryOverride={{ id: 2, name: "vegetables" }}
      />
    );
    const applyButton = screen.getByRole("button", { name: /apply/i });
    await waitFor(() => expect(applyButton).toBeEnabled());
    await user.click(applyButton);
    await waitFor(() => {
      expect(createCategory).not.toHaveBeenCalled();
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalled();
      expect(mockArticlesProcessor.editArticle).toHaveBeenCalledWith(
        mockArticle,
        {
          id: mockArticle.id,
          name: "Milk",
          category: { id: 2, name: "vegetables" },
        }
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  test("remove article button removes article", async () => {
    const user = userEvent.setup();

    render(
      <ArticlePopup
        open={true}
        setOpen={mockSetOpen}
        article={mockArticle}
        articlesProcessor={mockArticlesProcessor}
      />
    );

    const removeButton = screen.getByRole("button", {
      name: /remove article/i,
    });
    await user.click(removeButton);

    const confirmButton = screen.getByTestId("confirm-remove-article");
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockArticlesProcessor.removeArticle).toHaveBeenCalledWith(
        mockArticle
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
