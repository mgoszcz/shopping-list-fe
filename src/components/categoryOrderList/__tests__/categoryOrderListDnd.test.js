import { render, screen, fireEvent } from "@testing-library/react";
import CategoryOrderListDnd from "../categoryOrderListDnd";

jest.mock("../mySortableListItem", () => ({
  __esModule: true,
  default: ({ item, handleDelete }) => (
    <div>
      <span>{item.title}</span>
      <button
        className="delete-category"
        category-id={item.id}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  ),
}));

jest.mock("../categoryOrderListItem", () => ({
  __esModule: true,
  default: ({ item }) => <div data-testid="drag-overlay">{item.title}</div>,
}));

test("renders all items", () => {
  const setOrderList = jest.fn();
  const setApplyDisabled = jest.fn();
  const orderList = [
    { id: 1, title: "One" },
    { id: 2, title: "Two" },
  ];

  render(
    <CategoryOrderListDnd
      orderList={orderList}
      setOrderList={setOrderList}
      setApplyDisabled={setApplyDisabled}
    />
  );

  expect(screen.getByText("One")).toBeInTheDocument();
  expect(screen.getByText("Two")).toBeInTheDocument();
});

test("calls setOrderList on delete", () => {
  const setOrderList = jest.fn();
  const setApplyDisabled = jest.fn();
  const orderList = [{ id: 1, title: "One" }];

  render(
    <CategoryOrderListDnd
      orderList={orderList}
      setOrderList={setOrderList}
      setApplyDisabled={setApplyDisabled}
    />
  );

  fireEvent.click(screen.getByText("Delete"));
  expect(setOrderList).toHaveBeenCalled();
  expect(setApplyDisabled).toHaveBeenCalledWith(false);
});
