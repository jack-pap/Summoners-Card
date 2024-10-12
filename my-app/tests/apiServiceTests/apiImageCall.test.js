const apiService = require("../../server/controller/apiService.js");

// export function apiImageCall(imageURL) {
//     return new Promise((resolve, reject) => {
//       fetch(imageURL)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Image data failed to request: ${response.status}`);
//           }
//           return response.blob();
//         })
//         .then((blob) => {
//           const url = URL.createObjectURL(blob);
//           resolve(url);
//         })
//         .catch((error) => {
//           reject(error);
//           console.log(error);
//         });
//     });
//   }

global.fetch = jest.fn();

describe("apiImageCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 500,
      blob: async () => blob,
    });

    global.URL = {
      createObjectURL: jest.fn((blob) => `blob:${blob.size}`),
    };

    global.Blob = jest.fn(() => ({
      size: 50,
      type: "image/png",
    }));

    const blob = new Blob();
    const URL = "Google.com/image.png";
    const result = await apiService.apiImageCall(URL);

    expect(result).toStrictEqual(`blob:${blob.size}`);
    expect(fetch).toHaveBeenCalledWith(URL);
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      blob: async () => blob,
    });

    const blob = new Blob();
    const URL = "Google.com/image.png";

    await expect(apiService.apiImageCall(URL)).rejects.toThrow(
      "Image data failed to request: 500"
    );
    expect(fetch).toHaveBeenCalledWith(URL);
  });
});
