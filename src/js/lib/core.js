/**
 * @file core.js
 * @description Core functionality of the ModernLib library.
 * @module core
 */

/**
 * Creates a new ModernLib object.
 * @param {string|Element} selector - A CSS selector string or DOM Element.
 * @returns {Object} ModernLib object.
 */
const $ = function (selector) {
  return new $.prototype.init(selector);
};

/**
 * Initializes a new ModernLib object.
 * @constructor
 * @param {string|Element} selector - A CSS selector string or DOM Element.
 */

/* $.prototype.init = function (selector) {
  if (!selector) {
    return this; //{}
  }

  if (selector.tagName) {
    // перевіряємо чи не є обєкт вузлом
    this[0] = selector;
    this.length = 1;
    return this;
  }

  Object.assign(this, document.querySelectorAll(selector));
  this.length = document.querySelectorAll(selector).length;
  return this;
}; */
$.prototype.init = function (selector) {
  if (!selector) {
    return this; // Повертаємо пустий об'єкт, якщо немає селектора
  }

  // Якщо selector — це HTML-рядок
  if (typeof selector === 'string' && selector.trim().startsWith('<')) {
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
  if (typeof selector === 'string') {
    const nodeList = document.querySelectorAll(selector);
    Object.assign(this, nodeList);
    this.length = nodeList.length;
  } else {
    this[0] = selector;
    this.length = 1;
  }

  return this;
};



$.prototype.init.prototype = $.prototype;
// Додайте цей рядок для підтримки плагінів
$.fn = $.prototype;

/**
 * Iterates over each element in the collection and executes a callback function.
 * @param {Function} callback - Function to execute for each element.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.each = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback.call(this[i], this[i], i, this);
  }
  return this;
};

/**
 * Executes a callback function when the DOM is ready.
 * @param {Function} callback - Function to execute when the DOM is ready.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $().ready(function() {
 *   console.log('DOM is ready!');
 *     // Ваш код ініціалізації тут
 *  });
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
