/**
 * API call to Riot for data by calling the proxy route
 * and passing the apiURL
 * @param {string} apiURL
 * @returns {Promise}
 */
export function apiCall(apiURL) {
  const proxyURL = `http://localhost:3000/proxy?url=${encodeURIComponent(
    apiURL
  )}`;

  return new Promise((resolve, reject) => {
    fetch(proxyURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
        console.log(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
