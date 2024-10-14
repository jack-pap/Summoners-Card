/**
 * @module apiService
 */

/**
 * API call to Riot for data by calling the proxy route
 * server and passing the apiURL endpoint
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export function apiProxyCall(apiURL) {
  const proxyURL = `https://summoners-card.onrender.com/proxy?url=${encodeURIComponent(
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
        console.log(error);
      });
  });
}

/**
 * @module apiService
 */

/**
 * API call to Riot for data by calling the proxy route
 * server that doesnt cache the request and passing the
 * apiURL endpoint
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export function apiProxyNoCacheCall(apiURL) {
  const proxyURL = `https://summoners-card.onrender.com/proxyNoCache?url=${encodeURIComponent(
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
        console.log(error);
      });
  });
}

/**
 * API call to imageURL to get image data
 *
 * @param {string} imageURL
 * @returns {Promise}
 */
export function apiImageCall(imageURL) {
  return new Promise((resolve, reject) => {
    fetch(imageURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Image data failed to request: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}

/**
 * API POST call to server to create
 * new database entry
 *
 * @param {string} path
 * @param {string} queryRoute
 * @param {JSON} summonerJSONObject
 * @returns {Promise}
 */
export function apiPOSTDatabaseCall(path, queryRoute, summonerJSONObject) {
  const queryRouteURL = `https://summoners-card.onrender.com/${path}/${queryRoute}`;

  return new Promise((resolve, reject) => {
    fetch(queryRouteURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(summonerJSONObject),
    })
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
        console.log(error);
      });
  });
}

/**
 * API GET call to server to request data from
 * the database
 *
 * @param {string} path
 * @param {string} queryRoute
 * @returns {Promise}
 */
export function apiGETDatabaseCall(path, queryRoute) {
  const queryRouteURL = `https://summoners-card.onrender.com/${path}/${queryRoute}`;

  return new Promise((resolve, reject) => {
    fetch(queryRouteURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}
