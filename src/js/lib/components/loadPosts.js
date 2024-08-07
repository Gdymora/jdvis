/**
 * @file loadPosts.js
 * @description Post loading functionality for ModernLib.
 */
import $ from '../core';

/**
 * Loads and displays blog posts from a given URL.
 * @memberof $.prototype
 * @param {string} url - The URL to fetch post data from.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#postsContainer').loadPosts('https://api.example.com/posts');
 */

$.prototype.loadPosts = function(url) {
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
        .then(data => {
            let postsHTML = data.map(createPost).join('');
            this.html(postsHTML);
        })
        .catch(error => console.error('Error loading posts:', error));

    return this;
};