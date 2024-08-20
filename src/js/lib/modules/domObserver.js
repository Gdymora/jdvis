/**
 * @file domObserver.js
 * @description DOM Observer functionality for ModernLib.
 */

import $ from '../core';

/**
 * Initializes a DOM observer that watches for changes in the specified element.
 * @memberof $.prototype
 * @param {Function} callback - Function to be called when changes are detected.
 * @param {Object} [options] - MutationObserver options.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#contentArea').domObserver(function(mutations) {
 *   mutations.forEach(function(mutation) {
 *     console.log('DOM changed:', mutation.target);
 *   });
 * });
 */
$.prototype.domObserver = function(callback, options = {}) {
  const defaultOptions = {
    childList: true,
    subtree: true
  };

  const observerOptions = { ...defaultOptions, ...options };

  this.each(function(element) {
    const observer = new MutationObserver(callback);
    observer.observe(element, observerOptions);

    // Store the observer instance on the element
    element._domObserver = observer;
  });

  return this;
};

/**
 * Stops observing DOM changes for the specified element.
 * @memberof $.prototype
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#contentArea').stopDomObserver();
 */
$.prototype.stopDomObserver = function() {
  this.each(function(element) {
    if (element._domObserver) {
      element._domObserver.disconnect();
      delete element._domObserver;
    }
  });

  return this;
};

// Example usage
// $('.observed-element').domObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.type === 'childList') {
//       console.log('DOM changed:', mutation.target);
//     }
//   });
// });

/* 
// Почати спостереження за змінами
$('#contentArea').domObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('DOM changed:', mutation.target);
      console.log('Content area after change:', $('#contentArea')[0]);
    }
  });
});

// Пізніше, якщо потрібно зупинити спостереження
$('#contentArea').stopDomObserver();
*/