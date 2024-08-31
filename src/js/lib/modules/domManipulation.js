/**
 * @file domManipulation.js
 * @module domManipulation
 * @description Модуль для створення та маніпуляції елементами DOM.
 */

import $ from "../core";

/**
 * Create a new ModernLib object with elements created from the provided HTML string.
 * @param {string} html - A string of HTML to create DOM elements from.
 * @returns {Object} A new ModernLib object containing the created elements.
 * @example
 *  const newElement = $().create(`
 * <div class="container">
 *   <h1>Hello World</h1>
 *   <p>This is a new paragraph.</p>
 * </div>
 * `);
 * // Додаємо створені елементи на сторінку
 *  $('body').append(newElement);
 */
$.prototype.create = function (html) {
  return $(html.trim())[0];
};

/**
 * Set or get the text content of the matched elements.
 * @param {string} [text] - The text to set. If omitted, returns the text of the first element.
 * @returns {(string|Object)} The text content or the ModernLib object for chaining.
 * @example
 * // Встановлення тексту для всіх елементів
 * $('p').text('Новий текст для параграфів');
 * // Отримання тексту першого елемента
 * const text = $('p').text();
 * console.log(text);
 */
$.prototype.text = function (text) {
  if (typeof text !== "undefined") {
    this.each((element) => {
      element.textContent = text;
    });
    return this;
  } else {
    return this[0] ? this[0].textContent : "";
  }
};

/**
 * Insert content at the end of each element in the set of matched elements.
 * @param {(string|Node|ModernLib)} content - The content to append.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Додавання HTML-коду до всіх елементів
 * $('div').append('<p>Новий параграф всередині div</p>');
 * // Додавання існуючого вузла до всіх елементів
 * const newNode = document.createElement('span');
 * newNode.textContent = 'Новий елемент';
 * $('div').append(newNode);
 * // Додавання елементів із ModernLib об'єкта
 * const newContent = $.fn.create('<p>Параграф створений за допомогою ModernLib</p>');
 * $('div').append(newContent);
 */
$.prototype.append = function (content) {
  if (typeof content === "string") {
    this.each((element) => {
      element.insertAdjacentHTML("beforeend", content);
    });
  } else if (content instanceof Node) {
    this.each((element) => {
      element.appendChild(content.cloneNode(true));
    });
  } else if (content instanceof $) {
    this.each((element) => {
      content.each((index, item) => {
        if (item instanceof Node) {
          element.appendChild(item.cloneNode(true));
        }
      });
    });
  }
  return this;
};

/**
 * Remove all child nodes of the set of matched elements from the DOM.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Видалення всіх дочірніх елементів із вибраних елементів
 * $('div').empty();
 */
$.prototype.empty = function () {
  this.each((element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  });
  return this;
};

export default $;
