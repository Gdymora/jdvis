/**
 * @file loadPosts.js
 * @description Post loading functionality for ModernLib.
 * @module components/loadPosts
 */
import $ from "../core";

/**
 * Loads and displays blog posts from a given URL.
 * @memberof $.prototype
 * @param {string} url - The URL to fetch post data from.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="postsContainer"></div>
 *
 * // Load posts from an API
 * $('#postsContainer').loadPosts('https://api.example.com/posts');
 *
 * // The API should return an array of post objects with the following structure:
 * // [
 * //   {
 * //     link: "https://example.com/post1",
 * //     image: "https://example.com/image1.jpg",
 * //     category: "Technology",
 * //     title: "New Tech Trends",
 * //     author: "John Doe",
 * //     date: "2023-08-15",
 * //     excerpt: "A brief overview of the latest tech trends..."
 * //   },
 * //   // More post objects...
 * // ]
 */
$.prototype.loadPosts = function (url) {
  const createPost = (post) => `
        <article class="flex flex-col shadow my-4">
            <a href="${post.link}" class="hover:opacity-75">
                <img src="${post.image}" />
            </a>
            <div class="bg-white flex flex-col justify-start p-6">
                <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${post.category}</a>
                <a href="${post.link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${post.title}</a>
                <p class="text-sm pb-3">
                    By <a href="#" class="font-semibold hover:text-gray-800">${post.author}</a>, Published on ${post.date}
                </p>
                <a href="${post.link}" class="pb-6">${post.excerpt}</a>
                <a href="${post.link}" class="uppercase text-gray-800 hover:text-black">Continue Reading <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;

  this.get(url)
    .then((data) => {
      let postsHTML = data.map(createPost).join("");
      this.html(postsHTML);
    })
    .catch((error) => console.error("Error loading posts:", error));

  return this;
};