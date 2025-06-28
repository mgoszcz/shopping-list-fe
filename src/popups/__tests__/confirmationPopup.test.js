// __tests__/popupComponents.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmationPopup } from "../confirmationPopup";

describe("ConfirmationPopup", () => {
  test("renders with message and calls onConfirm when Yes is clicked", () => {
    const mockConfirm = jest.fn();
    const mockSetOpen = jest.fn();

    render(
      <ConfirmationPopup
        message="Are you sure?"
        onConfirm={mockConfirm}
        open={true}
        setOpen={mockSetOpen}
      />
    );

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));
    expect(mockConfirm).toHaveBeenCalled();
  });

  test("calls setOpen(false) when No is clicked", () => {
    const mockSetOpen = jest.fn();

    render(
      <ConfirmationPopup
        message="Confirm?"
        onConfirm={jest.fn()}
        open={true}
        setOpen={mockSetOpen}
      />
    );

    fireEvent.click(screen.getByText("No"));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
