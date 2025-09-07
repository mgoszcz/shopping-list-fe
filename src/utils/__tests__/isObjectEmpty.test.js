// __tests__/isObjectEmpty.test.js
// Place next to isObjectEmpty.js (adjust the require path if needed)

describe("isObjectEmpty", () => {
  const load = () => require("..//isObjectEmpty"); // adjust if needed

  test("empty plain object -> true", () => {
    const { isObjectEmpty } = load();
    expect(isObjectEmpty({})).toBe(true);
  });

  test("object with an own property (even falsy) -> false", () => {
    const { isObjectEmpty } = load();
    expect(isObjectEmpty({ a: 0 })).toBe(false);
    expect(isObjectEmpty({ a: null })).toBe(false);
    expect(isObjectEmpty({ a: undefined })).toBe(false);
  });

  test("object with only inherited props -> true", () => {
    const { isObjectEmpty } = load();
    const proto = { a: 1 };
    const obj = Object.create(proto); // no own props
    expect(isObjectEmpty(obj)).toBe(true);
  });

  test("array: [] -> true; array with element -> false", () => {
    const { isObjectEmpty } = load();
    expect(isObjectEmpty([])).toBe(true);
    const arr = [];
    arr[0] = "x";
    expect(isObjectEmpty(arr)).toBe(false);
  });

  test("null/undefined are considered empty", () => {
    const { isObjectEmpty } = load();
    expect(isObjectEmpty(null)).toBe(true);
    expect(isObjectEmpty(undefined)).toBe(true);
  });
});
