/**
 * @file postGenerator.js
 * @description Post generation functionality for ModernLib.
 * @module components/postGenerator
 */

import $ from '../core';

$.prototype.postGenerator = function(url) {
    /**
     * Generates posts based on data fetched from a server.
     * @param {string} url - The URL to fetch post data from.
     * @returns {Object} The ModernLib object for chaining.
     * @example
     * // HTML structure
     * // <section id="postsContainer" class="w-full md:w-2/3 flex flex-col items-center px-3"></section>
     * 
     * // Initialize post generator
     * $('#postsContainer').postGenerator('https://api.example.com/posts');
     */
    
    const createPost = ({image, category, title, author, date, excerpt, link}) => {
        return `
            <article class="flex flex-col shadow my-4">
                <a href="${link}" class="hover:opacity-75">
                    <img src="${image}" alt="${title}" />
                </a>
                <div class="bg-white flex flex-col justify-start p-6">
                    <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${category}</a>
                    <a href="${link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${title}</a>
                    <p class="text-sm pb-3">
                        By
                        <a href="#" class="font-semibold hover:text-gray-800">${author}</a>, Published on ${date}
                    </p>
                    <a href="${link}" class="pb-6">${excerpt}</a>
                    <a href="${link}" class="uppercase text-gray-800 hover:text-black">Continue Reading <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    };

    this.get(url)
        .then(data => {
            let posts = '';
            data.forEach(item => {
                posts += createPost(item);
            });
            this.html(posts);
        })
        .catch(error => console.error('Error fetching post data:', error));

    return this;
};

// Приклад використання:
// $('#postsContainer').postGenerator('https://api.example.com/posts');