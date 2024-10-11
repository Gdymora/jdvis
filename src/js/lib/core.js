/**
 * @file core.js
 * @description Core functionality of the ModernLib library. Provides a lightweight DOM manipulation utility similar to jQuery.
 * @module core
 */

/**
 * Creates a new ModernLib object for DOM manipulation.
 * Accepts either a CSS selector string or a DOM Element.
 *
 * @param {string|Element} selector - A CSS selector string or a DOM Element to initialize the library with.
 * @returns {ModernLib} A new instance of the ModernLib object for chaining.
 *
 * @example
 * // Select by CSS selector
 * const elements = $('.myClass');
 *
 * @example
 * // Select by DOM element
 * const element = $(document.getElementById('myElement'));
 * * @example
 * // Select by CSS selector
 * const form = $('#loginForm');
 *
 * @example
 * // Select by data attribute
 * const slideNext = $('[data-slide="next"]');
 *
 * @example
 * // Select by complex CSS selector
 * const checkedRoles = $('input[name="roles"]:checked');
 *
 * @example
 * // Create elements using HTML string
 * const newElement = $('<div class="tab-panel" data-tabpanel></div>');
 *
 * @example
 * // Create element with dynamic content using template literals
 * const tabItem = $(`<div class="tab-item${index === 0 ? ' tab-item--active' : ''}">${tab.title}</div>`);
 *
 * @example
 * // Select by DOM element
 * const domElement = $(document.querySelector('[data-slide="next"]'));
 
 */

const $ = function (selector) {
  return new $.prototype.init(selector);
};

/**
 * Initializes a new ModernLib object.
 * @constructor
 * @param {string|Element} selector - A CSS selector string or DOM Element.
 */

$.prototype.init = function (selector) {
  if (!selector) {
    return this; // Return an empty object if no selector is provided
  }

  // If the selector is an HTML string (e.g. '<div></div>')

  // Якщо selector — це HTML-рядок
  if (typeof selector === "string" && selector.trim().startsWith("<")) {
    const temp = document.implementation.createHTMLDocument();
    temp.body.innerHTML = selector.trim();
    Object.assign(this, temp.body.children);
    this.length = temp.body.children.length;
    return this;
  }

  // Якщо selector — це DOM-вузол
  if (selector instanceof HTMLElement) {
    this[0] = selector;
    this.length = 1;
    return this;
  }

  // Якщо selector — це CSS-селектор
  if (typeof selector === "string") {
    const nodeList = document.querySelectorAll(selector);
    Object.assign(this, nodeList);
    this.length = nodeList.length;
  } else {
    this[0] = selector;
    this.length = 1;
  }

  return this;
};

/**
 * Ensure that instances of ModernLib can access methods from $.prototype.
 */
$.prototype.init.prototype = $.prototype;

// Allow plugins or extensions by assigning $.fn as an alias for $.prototype
$.fn = $.prototype;

/**
 * Iterates over each element in the ModernLib collection and executes a callback.
 * The callback function is called with three arguments: the current element, its index, and the ModernLib object.
 *
 * @param {Function} callback - The function to be executed for each element.
 * @returns {ModernLib} The ModernLib object for chaining.
 *
 * @example
 * $('.myClass').each(function(element, index) {
 *   console.log(element, index);
 * });
 */
$.prototype.each = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback.call(this[i], this[i], i, this);
  }
  return this;
};

/**
 * Executes a callback when the DOM is fully loaded.
 * If the DOM is already ready, the callback is executed immediately.
 *
 * @param {Function} callback - The function to execute when the DOM is ready.
 * @returns {ModernLib} The ModernLib object for chaining.
 *
 * @example
 * $(document).ready(function() {
 *   console.log('DOM is fully loaded');
 * });
 */

$.prototype.ready = function (callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
  return this;
};

// Експортуємо як глобальний об'єкт
if (typeof window !== "undefined") {
  window.$ = $;
}

export default $;
