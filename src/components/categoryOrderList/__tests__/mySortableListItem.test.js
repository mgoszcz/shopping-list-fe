import { render, screen } from "@testing-library/react";
import { MySortableListItem } from "../mySortableListItem";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: { "data-test-attr": "attr" },
    listeners: { onPointerDown: jest.fn() },
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
}));

jest.mock("../categoryOrderListItem", () => ({
  __esModule: true,
  default: ({ item, ...rest }) => {
    const { handleDelete, ref, ...domSafeProps } = rest;
    return (
      <div data-testid="mock-item" {...domSafeProps}>
        {item.title}
      </div>
    );
  },
}));

const mockItem = { id: 1, title: "Sortable Category" };

test("renders sortable list item with correct title", () => {
  render(<MySortableListItem item={mockItem} handleDelete={jest.fn()} />);
  expect(screen.getByText("Sortable Category")).toBeInTheDocument();
});
