// ShoppingCartCard.test.jsx
import {
  render,
  screen,
  fireEvent,
  within,
} from "../../../../tests/setup/test-utils";
import ShoppingCartCard from "../shoppingCartCard";

const mockProcessor = {
  toggleChecked: jest.fn(),
  changeQuantity: jest.fn(),
  deleteCartItem: jest.fn(),
};

const cartItem = {
  id: 1,
  article: { id: 101, name: "Milk" },
  category: { name: "Dairy" },
  quantity: 2,
  checked: false,
  sorted: true,
};

const setup = (overrides = {}) => {
  const props = {
    cartItem: { ...cartItem, ...overrides },
    shoppingCartProcessor: mockProcessor,
    setArticlePopupOpen: jest.fn(),
    setEditingArticle: jest.fn(),
  };
  render(<ShoppingCartCard {...props} />);
  return props;
};

test("renders article name and category", () => {
  setup();
  expect(screen.getByRole("heading", { name: /milk/i })).toBeInTheDocument();
  expect(screen.getByText(/dairy/i)).toBeInTheDocument();
});

test("calls toggleChecked on card click", () => {
  setup();
  const card = screen.getByRole("heading", { name: /milk/i }).closest("button");
  fireEvent.click(card);
  expect(mockProcessor.toggleChecked).toHaveBeenCalledWith(cartItem);
});

test("displays correct quantity in input", () => {
  setup();
  const input = screen.getByDisplayValue("2");
  expect(input).toBeInTheDocument();
});

test("calls changeQuantity on input change", () => {
  setup();
  const input = screen.getByDisplayValue("2");
  fireEvent.change(input, { target: { value: "5" } });
  expect(mockProcessor.changeQuantity).toHaveBeenCalledWith(cartItem, "5");
});

test("calls deleteCartItem on delete button click", () => {
  setup();
  const deleteBtn = screen.getByLabelText("delete");
  fireEvent.click(deleteBtn);
  expect(mockProcessor.deleteCartItem).toHaveBeenCalledWith(cartItem);
});

test("calls edit handlers on edit button click", () => {
  const { setArticlePopupOpen, setEditingArticle } = setup();
  const editBtn = screen.getByLabelText("edit");
  fireEvent.click(editBtn);
  expect(setArticlePopupOpen).toHaveBeenCalledWith(true);
  expect(setEditingArticle).toHaveBeenCalledWith({ id: 101 });
});
