// api.test.js
// Verifies axios.create is called with baseURL from getBackendBaseUrl()

jest.mock("axios", () => ({ create: jest.fn(() => ({ __api: true })) }));
jest.mock("../../../constants/urls/baseUrl", () => ({
  getBackendBaseUrl: () => "https://example.test",
}));

describe("api.js", () => {
  test("creates axios instance with baseURL", async () => {
    const axios = require("axios");
    const { api } = require("../api"); // relative to this test file
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://example.test",
    });
    expect(api).__api; // instance came from axios.create
  });
});
