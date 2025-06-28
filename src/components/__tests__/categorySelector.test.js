// __tests__/categorySelector.test.js
jest.mock("../../data/api/categoriesData", () => ({
  getCategoriesData: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Fruits" },
      { id: 2, name: "Vegetables" },
    ])
  ),
}));

import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategorySelector } from "../categorySelector";

import { getCategoriesData } from "../../data/api/categoriesData";

describe("CategorySelector", () => {
  const mockSetSelectedCategory = jest.fn();
  const mockSetCategories = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input field", () => {
    render(
      <CategorySelector
        categories={[]}
        setCategories={mockSetCategories}
        selectedCategory={{}}
        setSelectedCategory={mockSetSelectedCategory}
        freeSoloEnabled={false}
      />
    );
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  test("loads categories on open", async () => {
    const mockCategories = [
      { id: 1, name: "Fruits" },
      { id: 2, name: "Vegetables" },
    ];

    getCategoriesData.mockResolvedValueOnce(mockCategories);
    render(
      <CategorySelector
        categories={[]}
        setCategories={mockSetCategories}
        selectedCategory={{}}
        setSelectedCategory={mockSetSelectedCategory}
        freeSoloEnabled={false}
      />
    );

    const input = screen.getByLabelText(/category/i);
    await userEvent.click(input); // triggers onOpen

    await waitFor(() => {
      expect(getCategoriesData).toHaveBeenCalled();
    });

    await act(() => Promise.resolve());

    await waitFor(() => {
      expect(mockSetCategories).toHaveBeenCalledWith(mockCategories);
    });
  });

  test("selects existing category from list", async () => {
    render(
      <CategorySelector
        categories={[{ id: 1, name: "Fruits" }]}
        setCategories={mockSetCategories}
        selectedCategory={{}}
        setSelectedCategory={mockSetSelectedCategory}
        freeSoloEnabled={false}
      />
    );

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Fruits");
    await waitFor(() => {
      expect(mockSetSelectedCategory).toHaveBeenCalledWith({
        id: 1,
        name: "Fruits",
      });
    });
  });

  test("sets new category if freeSolo enabled", async () => {
    render(
      <CategorySelector
        categories={[{ id: 1, name: "Fruits" }]}
        setCategories={mockSetCategories}
        selectedCategory={{}}
        setSelectedCategory={mockSetSelectedCategory}
        freeSoloEnabled={true}
      />
    );

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Snacks");
    await waitFor(() => {
      expect(mockSetSelectedCategory).toHaveBeenCalledWith({ name: "Snacks" });
    });
  });

  test("clears category when input is emptied", async () => {
    render(
      <CategorySelector
        categories={[{ id: 1, name: "Fruits" }]}
        setCategories={mockSetCategories}
        selectedCategory={{ id: 1, name: "Fruits" }}
        setSelectedCategory={mockSetSelectedCategory}
        freeSoloEnabled={true}
      />
    );

    const input = screen.getByRole("combobox");
    await userEvent.clear(input);
    await waitFor(() => {
      expect(mockSetSelectedCategory).toHaveBeenCalledWith({});
    });
  });
});
