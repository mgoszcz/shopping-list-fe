import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryOrderListItem } from "../categoryOrderListItem";

const mockItem = { id: 1, title: "Test Category" };

test("renders category title", () => {
  render(<CategoryOrderListItem item={mockItem} />);
  expect(screen.getByText("Test Category")).toBeInTheDocument();
});

test("calls handleDelete when delete button is clicked", () => {
  const handleDelete = jest.fn();
  render(<CategoryOrderListItem item={mockItem} handleDelete={handleDelete} />);
  fireEvent.click(screen.getByLabelText("delete"));
  expect(handleDelete).toHaveBeenCalled();
});

test("renders divider", () => {
  const { container } = render(<CategoryOrderListItem item={mockItem} />);
  expect(container.querySelector("hr")).toBeInTheDocument();
});
