import React from "react";
const AppModule = require("@/src/App.jsx");
const fetch = require("isomorphic-fetch");

jest.mock("isomorphic-fetch");

jest.mock("@/src/components/ErrorPage.jsx", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="error-page">Mocked ErrorPage</div>),
}));

describe("loadVersion function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Returns version number", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve("19.20"),
    });
    const result = await AppModule.loadVersion();

    expect(result).toEqual("19.20");
  });

  test("Fails to return version number", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    try {
      await AppModule.loadVersion();
    } catch (error) {
      expect(error).toEqual(
        <div data-testid="error-page">Mocked ErrorPage</div>
      );
    }
  });
});
