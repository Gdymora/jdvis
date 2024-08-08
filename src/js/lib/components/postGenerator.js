/**
 * @file postGenerator.js
 * @description Post generation functionality for ModernLib.
 * @module components/postGenerator
 */

import $ from '../core';

$.prototype.postGenerator = function(url, customTemplate) {
    /**
     * Generates posts based on data fetched from a server.
     * @param {string} url - The URL to fetch post data from.
     * @param {function} [customTemplate] - Optional custom template function.
     * @returns {Promise} A promise that resolves with the fetched data and the ModernLib object.
     * @example
     * // HTML structure
     * // <section id="postsContainer" class="w-full md:w-2/3 flex flex-col items-center px-3"></section>
     * $('#postsContainer').postGenerator('https://api.example.com/posts');
     * // Initialize post generator with default template
     * $('#postsContainer').postGenerator('https://api.example.com/posts')
     *     .then(({data, $el}) => {
     *         console.log('Fetched data:', data);
     *         console.log('ModernLib element:', $el);
     *     });
     * 
     * // Initialize post generator with custom template
     * $('#postsContainer').postGenerator('https://api.example.com/posts', 
     *     (post) => `<div>${post.title}</div>`)
     *     .then(({data, $el}) => {
     *         console.log('Fetched data:', data);
     *         console.log('ModernLib element:', $el);
     *     });
     */

    const defaultTemplate = ({image, category, title, author, date, excerpt, link}) => {
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

    const createPost = customTemplate || defaultTemplate;

    return new Promise((resolve, reject) => {
        this.get(url)
            .then(data => {
                let posts = '';
                const parsedData = JSON.parse(data.data);
                parsedData.forEach(item => {
                    posts += createPost(item);
                });
                this.html(posts);
                resolve({data: parsedData, $el: this});
            })
            .catch(error => {
                console.error('Error fetching post data:', error);
                reject(error);
            });
    });
};