import fetch from "isomorphic-fetch";
/**
 * @module apiService
 */

const BASE_URL = `${window.location.origin}/api`;

/**
 * API call to fetch data from a route end point
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export async function apiCall(apiURL) {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * API call to Riot for data by calling the proxy route server and passing the apiURL endpoint
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export async function apiProxyCall(apiURL) {
  const proxyURL = `${BASE_URL}/proxy?url=${apiURL}`;
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * API call to Riot for data by calling the proxy route server that doesn't cache the request
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export async function apiProxyNoCacheCall(apiURL) {
  const proxyURL = `${BASE_URL}/proxyNoCache?url=${encodeURIComponent(apiURL)}`;
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * API call to imageURL to get image data
 *
 * @param {string} imageURL
 * @returns {Promise}
 */
export async function apiImageCall(imageURL) {
  try {
    const response = await fetch(imageURL);
    if (!response.ok) {
      throw new Error(`Image data failed to request: ${response.status}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * API POST call to server to create new database entry
 *
 * @param {string} path
 * @param {string} queryRoute
 * @param {Object} summonerJSONObject
 * @returns {Promise}
 */
export async function apiPOSTDatabaseCall(
  path,
  queryRoute,
  summonerJSONObject
) {
  const queryRouteURL = `${BASE_URL}/${path}/${queryRoute}`;
  try {
    const response = await fetch(queryRouteURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(summonerJSONObject),
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * API GET call to server to request data from the database
 *
 * @param {string} path
 * @param {string} queryRoute
 * @returns {Promise}
 */
export async function apiGETDatabaseCall(path, queryRoute) {
  const queryRouteURL = `${BASE_URL}/${path}/${queryRoute}`;
  try {
    const response = await fetch(queryRouteURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
