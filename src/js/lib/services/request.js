/**
 * @file request.js
 * @description AJAX request methods for ModernLib.
 * @module request
 */

import $ from "../core";

/**
 * Performs a GET request.
 * @param {string} url - The URL to send the request to.
 * @param {string} [dataTypeAnswer='json'] - The expected data type of the response.
 * @returns {Promise<*>} A promise that resolves with the response data.
 * @throws {Error} If the fetch request fails.
 */

$.prototype.get = async function (url, dataTypeAnswer = "json") {
  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }

  switch (dataTypeAnswer) {
    case "json":
      return await res.json();
    case "text":
      return await res.text();
    case "blob":
      return await res.blob();
  }
};

/**
 * Performs a POST request.
 * @param {string} url - The URL to send the request to.
 * @param {*} data - The data to send with the request.
 * @param {string} [dataTypeAnswer='text'] - The expected data type of the response.
 * @returns {Promise<*>} A promise that resolves with the response data.
 */

$.prototype.post = async function (url, data, dataTypeAnswer = "text") {
  let res = await fetch(url, {
    method: "POST",
    body: data,
  });

  switch (dataTypeAnswer) {
    case "json":
      return await res.json();
    case "text":
      return await res.text();
    case "blob":
      return await res.blob();
  }
};



/**
 * Fetches data from a local JSON file.
 * @memberof $.prototype
 * @param {string} filePath - The path to the local JSON file.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON data.
 * @example
 * $('#postsContainer').fetchLocalJson('data/posts.json')
 *   .then(data => console.log(data))
 *   .catch(error => console.error('Error:', error));
 */
$.prototype.fetchLocalJson = function (filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching local JSON:", error);
      throw error;
    });
};
