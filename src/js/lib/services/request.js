/**
 * @file request.js
 * @description AJAX request methods for ModernLib.
 * @module services/request
 */

import $ from "../core";

/**
 * Performs a GET request.
 * @param {string} url - The URL to send the request to.
 * @param {string} [dataTypeAnswer='json'] - The expected data type of the response.
 * @returns {Promise<*>} A promise that resolves with the response data.
 * @throws {Error} If the fetch request fails.
 * @example
 * // Fetching JSON data
 * $().get('https://api.example.com/data')
 *   .then(data => console.log('Received data:', data))
 *   .catch(error => console.error('Error:', error));
 *
 * @example
 * // Fetching text data
 * $().get('https://api.example.com/text', 'text')
 *   .then(text => console.log('Received text:', text))
 *   .catch(error => console.error('Error:', error));
 *
 * @example
 * // Fetching binary data (e.g., image)
 * $().get('https://api.example.com/image.jpg', 'blob')
 *   .then(blob => {
 *     const imageUrl = URL.createObjectURL(blob);
 *     const img = document.createElement('img');
 *     img.src = imageUrl;
 *     document.body.appendChild(img);
 *   })
 *   .catch(error => console.error('Error:', error));
 *
 * @example
 * // Using with async/await
 * (async function() {
 *   try {
 *     const blob = await $().get('https://api.example.com/image.jpg', 'blob');
 *     const imageUrl = URL.createObjectURL(blob);
 *     const img = document.createElement('img');
 *     img.src = imageUrl;
 *     document.body.appendChild(img);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * })();
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
 * @example
 * // Sending form data
 * const formData = new FormData(document.querySelector('form'));
 * $().post('https://api.example.com/submit', formData)
 *   .then(response => console.log('Response:', response))
 *   .catch(error => console.error('Error:', error));
 *
 * @example
 * // Sending JSON data and expecting JSON response
 * const data = { name: 'John', age: 30 };
 * $().post('https://api.example.com/users', JSON.stringify(data), 'json')
 *   .then(response => console.log('User created:', response))
 *   .catch(error => console.error('Error:', error));
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
 * // Fetching and using local JSON data
 * $('#postsContainer').fetchLocalJson('data/posts.json')
 *   .then(data => {
 *     data.posts.forEach(post => {
 *       const postElement = document.createElement('div');
 *       postElement.textContent = post.title;
 *       document.getElementById('postsContainer').appendChild(postElement);
 *     });
 *   })
 *   .catch(error => console.error('Error:', error));
 *
 * @example
 * // Using with async/await
 * async function loadPosts() {
 *   try {
 *     const data = await $('#postsContainer').fetchLocalJson('data/posts.json');
 *     data.posts.forEach(post => {
 *       // Process each post
 *     });
 *   } catch (error) {
 *     console.error('Failed to load posts:', error);
 *   }
 * }
 * loadPosts();
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
