/**
 * @file url.js
 * @description URL manipulation and parsing utilities for ModernDOM library. Provides methods for working with post URLs and their components.
 * @module modules/url
 */

import $ from "../core";

/**
 * Parses the current URL and extracts various components.
 * @memberof $.prototype
 * @returns {Object} An object containing parsed URL components.
 * @property {string} fullUrl - The full URL.
 * @property {string} protocol - The protocol (e.g., 'http:' or 'https:').
 * @property {string} host - The host (e.g., 'localhost:8013').
 * @property {string} pathname - The pathname (e.g., '/4/post/123').
 * @property {string} projectNumber - The project number (e.g., '4').
 * @property {string} postType - The post type (e.g., 'post').
 * @property {string} postNumber - The post number (e.g., '123').
 * @property {Object} queryParams - An object containing query parameters.
 * @example
 * // Assuming the current URL is: http://localhost:8013/4/post/123?page=2&category=tech
 * const urlInfo = $().parsePostUrl();
 * console.log(urlInfo);
 * // Output:
 * // {
 * //   fullUrl: "http://localhost:8013/4/post/123?page=2&category=tech",
 * //   protocol: "http:",
 * //   host: "localhost:8013",
 * //   pathname: "/4/post/123",
 * //   projectNumber: "4",
 * //   postType: "post",
 * //   postNumber: "123",
 * //   queryParams: {
 * //     page: "2",
 * //     category: "tech"
 * //   }
 * // }
 */
$.prototype.parsePostUrl = function() {
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/').filter(Boolean);

    const result = {
        fullUrl: url.href,
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        projectNumber: pathParts[0] || '',
        postType: pathParts[1] || '',
        postNumber: pathParts[2] || '',
        queryParams: {}
    };

    // Parse query parameters
    for (const [key, value] of url.searchParams) {
        result.queryParams[key] = value;
    }

    return result;
};

/**
 * Checks if the current URL matches the post structure.
 * @memberof $.prototype
 * @returns {boolean} True if the URL matches the post structure, false otherwise.
 * @example
 * if ($().isPostUrl()) {
 *   console.log("This is a post URL");
 * } else {
 *   console.log("This is not a post URL");
 * }
 */
$.prototype.isPostUrl = function() {
    const urlInfo = this.parsePostUrl();
    return urlInfo.pathname.match(/^\/\d+\/post\/\d+$/) !== null;
};

/**
 * Gets a specific component from the parsed URL.
 * @memberof $.prototype
 * @param {string} component - The name of the component to retrieve.
 * @returns {string|Object} The requested component value.
 * @example
 * const postNumber = $().getUrlComponent('postNumber');
 * console.log(`Current post number: ${postNumber}`);
 */
$.prototype.getUrlComponent = function(component) {
    const urlInfo = this.parsePostUrl();
    return urlInfo[component];
};

/**
 * Opens a new tab and transfers data.
 * @memberof $.prototype
 * @param {string} url - The URL to open in the new tab.
 * @param {Object} data - The data to transfer.
 * @param {Object} [options] - Additional options.
 * @param {string} [options.target='_blank'] - The target for window.open().
 * @param {string} [options.storageKey='transferredData'] - The key to use in localStorage.
 * @returns {Window} The newly opened window object.
 * @example
 * $().openInNewTabWithData('/post.html', { postId: 123, title: 'My Post' }, { storageKey: 'postData' });
 */
$.prototype.openInNewTabWithData = function(url, data, options = {}) {
    const { target = '_blank', storageKey = 'transferredData' } = options;
    const dataId = Date.now().toString();
    const fullUrl = `${url}${url.includes('?') ? '&' : '?'}dataId=${dataId}`;

    localStorage.setItem(`${storageKey}_${dataId}`, JSON.stringify(data));

    const newWindow = window.open(fullUrl, target);

    // Очистка даних через 1 хвилину
    setTimeout(() => {
        localStorage.removeItem(`${storageKey}_${dataId}`);
    }, 60000);

    return newWindow;
};

/**
 * Retrieves transferred data from localStorage based on URL parameter.
 * @memberof $.prototype
 * @param {Object} [options] - Additional options.
 * @param {string} [options.storageKey='transferredData'] - The key used in localStorage.
 * @returns {Object|null} The retrieved data or null if not found.
 * @example
 * const data = $().getTransferredData({ storageKey: 'postData' });
 * if (data) {
 *   console.log('Received data:', data);
 * } else {
 *   console.log('No data found');
 * }
 */
$.prototype.getTransferredData = function(options = {}) {
    const { storageKey = 'transferredData' } = options;
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get('dataId');

    if (!dataId) {
        console.error('No dataId provided in URL');
        return null;
    }

    const data = localStorage.getItem(`${storageKey}_${dataId}`);
    if (!data) {
        console.error('No transferred data found in localStorage');
        return null;
    }

    // Видаляємо дані після отримання
    localStorage.removeItem(`${storageKey}_${dataId}`);

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing transferred data:', error);
        return null;
    }
};


export default $;