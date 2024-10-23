import fetch from "isomorphic-fetch";

/**
 * @module apiService
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;
const PROXY_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}/api`;

/**
 * API call to fetch data from a route end point
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export async function apiCall(apiURL) {
  try {
    const proxyURL = `${PROXY_URL}/?url=${encodeURIComponent(apiURL)}`;
    const response = await fetch(proxyURL);
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
