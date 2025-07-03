// __tests__/categoryOrderPopup.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryOrderPopup } from "../categoryOrderPopup";

jest.mock("../../components/categoryOrderList/categoryOrderListDnd", () => ({
  CategoryOrderListDnd: () => <div data-testid="mock-dnd-list">DND List</div>,
}));

describe("CategoryOrderPopup", () => {
  const mockSetOpen = jest.fn();
  const mockSetCategories = jest.fn();

  test("renders DND list and closes", () => {
    render(
      <CategoryOrderPopup
        open={true}
        setOpen={mockSetOpen}
        shopId={123}
        categories={[{ id: 1, name: "Fruits" }]}
        setCategories={mockSetCategories}
      />
    );

    expect(screen.getByTestId("mock-dnd-list")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
