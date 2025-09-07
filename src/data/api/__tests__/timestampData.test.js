// timestampData.test.js
const mockApi = { get: jest.fn() };

jest.mock("../api", () => ({ api: mockApi }));
jest.mock("../../../logger/logger", () => ({ debug: jest.fn() }));
jest.mock("../../../constants/urls/timestampEndpoints", () => ({
  timestampEndpoints: { get: "/timestamp" },
}));

describe("timestampData", () => {
  beforeEach(() => jest.clearAllMocks());
  const mod = () => require("../timestampData");

  test("getTimestampData -> GET /timestamp returns data", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { ts: 123 } });
    const { getTimestampData } = mod();
    await expect(getTimestampData()).resolves.toEqual({ ts: 123 });
    expect(mockApi.get).toHaveBeenCalledWith("/timestamp");
  });
});
