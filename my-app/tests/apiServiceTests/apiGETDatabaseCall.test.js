
const apiService = require("../../server/controller/apiService.js");
// export function apiGETDatabaseCall(path, queryRoute) {
//     const queryRouteURL = `http://localhost:3001/${path}/${queryRoute}`;

//     return new Promise((resolve, reject) => {
//       fetch(queryRouteURL)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Network response was not ok ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           resolve(data);
//         })
//         .catch((error) => {
//           reject(error);
//           console.log(error);
//         });
//     });
//   }

global.fetch = jest.fn();

describe("apiGETDatabaseCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ testData: "testData" }),
    });

    const path = "summoner";
    const queryRoute = "get";

    const result = await apiService.apiGETDatabaseCall(
      path,
      queryRoute,
    );

    expect(result).toStrictEqual({ testData: "testData" });
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/${path}/${queryRoute}`
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const path = "summoner";
    const queryRoute = "get";

    await expect(
      apiService.apiGETDatabaseCall(path, queryRoute)
    ).rejects.toThrow("Network response was not ok 500");

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/${path}/${queryRoute}`
    );
  });
});
