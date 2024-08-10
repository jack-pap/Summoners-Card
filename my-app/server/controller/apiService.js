/**
 * API call to Riot for data by calling the proxy route
 * server and passing the apiURL endpoint
 * @param {string} apiURL
 * @returns {Promise}
 */
export function apiProxyCall(apiURL) {
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
        console.log(data);
      });
  });
}

/**
 * API POST call to server to create
 * new database entry
 * 
 * @param {string} queryRoute
 * @returns {Promise}
 */
export function apiPOSTDatabaseCall(queryRoute, summonerJSONObject) {
  const queryRouteURL = `http://localhost:3000/summoner/${queryRoute}`;

  return new Promise((resolve, reject) => {
    fetch(queryRouteURL, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(summonerJSONObject)
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
        console.log(data);
      });
  });
}

/**
 * API GET call to server to request data from
 * the database
 * 
 * @param {string} queryRoute
 * @returns {Promise}
 */
export function apiGETDatabaseCall(queryRoute) {
  const queryRouteURL = `http://localhost:3000/summoner/${queryRoute}`;

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
        console.log(data);
      })
      .catch((error) => {
        reject(error);
        console.log(data);
      });
  });
}

/**
 * API PUT call to server to modify data from
 * the database
 * 
 * @param {string} queryRoute
 * @returns {Promise}
 */
export function apiPUTDatabaseCall(queryRoute, summonerJSONObject) {
  const queryRouteURL = `http://localhost:3000/summoner/${queryRoute}`;

  return new Promise((resolve, reject) => {
    fetch(queryRouteURL, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(summonerJSONObject)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  });
}
