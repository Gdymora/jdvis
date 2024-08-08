/**
 * @file actions.js
 * @description DOM manipulation and traversal methods for ModernLib.
 * @module modules/actions 
 */

import $ from "../core";

/**
 * Gets or sets the HTML content of the selected elements.
 * @param {string} [content] - The HTML content to set. If not provided, returns the HTML content of the first element.
 * @returns {(Object|string)} The ModernLib object for chaining when setting, or the HTML content when getting.
 */

$.prototype.html = function (content) {
  for (let i = 0; i < this.length; i++) {
    if (content) {
      this[i].innerHTML = content;
    } else {
      return this[i].innerHTML;
    }
  }

  return this;
};

/*отримати елемент за номером*/
/**
 * Reduces the set of matched elements to the one at the specified index.
 * @param {number} i - The index of the element to select.
 * @returns {Object} A new ModernLib object containing the selected element.
 */

$.prototype.eq = function (i) {
  const swap = this[i];
  const objLength = Object.keys(this).length;

  for (let i = 0; i < objLength; i++) {
    delete this[i];
  }

  this[0] = swap;
  this.length = 1;
  return this;
};

/*отримати елемент за індексом*/
/**
 * Gets the index of the first element within its parent.
 * @returns {number} The index of the element.
 */

$.prototype.index = function () {
  const parent = this[0].parentNode;
  const childs = [...parent.children];

  const findMyIndex = (item) => {
    return item == this[0];
  };

  return childs.findIndex(findMyIndex);
};

/**
 * Finds descendants of the selected elements that match the selector.
 * @param {string} selector - A CSS selector to match elements against.
 * @returns {Object} The ModernLib object containing the matched elements.
 */

$.prototype.find = function (selector) {
  let numberOfItems = 0;
  let counter = 0;

  const copyObj = Object.assign({}, this);

  for (let i = 0; i < copyObj.length; i++) {
    const arr = copyObj[i].querySelectorAll(selector);
    if (arr.length == 0) {
      continue;
    }

    for (let j = 0; j < arr.length; j++) {
      this[counter] = arr[j];
      counter++;
    }

    numberOfItems += arr.length;
  }

  this.length = numberOfItems;

  const objLength = Object.keys(this).length;
  for (; numberOfItems < objLength; numberOfItems++) {
    delete this[numberOfItems];
  }

  return this;
};

/**
 * Gets the first ancestor of each element that matches the selector.
 * @param {string} selector - A CSS selector to match elements against.
 * @returns {Object} The ModernLib object containing the matched ancestors.
 */

$.prototype.closest = function (selector) {
  let counter = 0;

  for (let i = 0; i < this.length; i++) {
    this[i] = this[i].closest(selector);
    counter++;
  }

  const objLength = Object.keys(this).length;
  for (; counter < objLength; counter++) {
    delete this[counter];
  }

  return this;
};

/**
 * Gets the siblings of each element in the set of matched elements.
 * @returns {Object} The ModernLib object containing the sibling elements.
 */

$.prototype.siblings = function () {
  let numberOfItems = 0;
  let counter = 0;

  const copyObj = Object.assign({}, this);

  for (let i = 0; i < copyObj.length; i++) {
    const arr = copyObj[i].parentNode.children;

    for (let j = 0; j < arr.length; j++) {
      if (copyObj[i] === arr[j]) {
        continue;
      }

      this[counter] = arr[j];
      counter++;
    }

    numberOfItems += arr.length - 1;
  }

  this.length = numberOfItems;

  const objLength = Object.keys(this).length;
  for (; numberOfItems < objLength; numberOfItems++) {
    delete this[numberOfItems];
  }

  return this;
};
