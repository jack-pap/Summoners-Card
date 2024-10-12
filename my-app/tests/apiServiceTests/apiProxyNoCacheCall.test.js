const apiService = require("../../server/controller/apiService.js");

// export function apiProxyNoCacheCall(apiURL) {
//     const proxyURL = `http://localhost:3001/proxyNoCache?url=${encodeURIComponent(
//       apiURL
//     )}`;
//     return new Promise((resolve, reject) => {
//       fetch(proxyURL)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Network response was not ok ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           resolve(data);
//           console.log(data);
//         })
//         .catch((error) => {
//           reject(error);
//           console.log(data);
//         });
//     });
//   }

global.fetch = jest.fn();

describe("apiProxyNoCacheCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ testData: "123" }),
    });

    const URL = "Google.com";
    const result = await apiService.apiProxyNoCacheCall(URL);

    expect(result).toStrictEqual({ testData: "123" });
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/proxyNoCache?url=${encodeURIComponent(URL)}`
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ testData: "123" }),
    });
    const URL = "Google.com";

    await expect(apiService.apiProxyNoCacheCall(URL)).rejects.toThrow(
        "Network response was not ok 500"
      );
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/proxyNoCache?url=${encodeURIComponent(URL)}`
    );
  });
});
