/**
 * @file objectUtils.js
 * @description Utility functions for object manipulation in ModernDOM library.
 * @module modules/objectUtils
 */

import $ from "../core";

/**
 * Merges multiple objects into a target object.
 * @param {boolean} deep - If true, performs a deep merge.
 * @param {Object} target - The target object to merge into.
 * @param {...Object} sources - Source objects to merge from.
 * @returns {Object} The merged object.
 * @example
 * // Shallow merge
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { b: 3, c: 4 };
 * $.extend(false, {}, obj1, obj2);
 * // Returns: { a: 1, b: 3, c: 4 }
 *
 * // Deep merge
 * const obj3 = { a: { x: 1 }, b: 2 };
 * const obj4 = { a: { y: 2 }, c: 3 };
 * $.extend(true, {}, obj3, obj4);
 * // Returns: { a: { x: 1, y: 2 }, b: 2, c: 3 }
 */
$.prototype.extend = function (deep, target, ...sources) {
  if (typeof deep !== "boolean") {
    sources.unshift(target);
    target = deep || {};
    deep = false;
  }

  sources.forEach((source) => {
    if (source == null) return;

    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        if (deep && typeof source[key] === "object" && !Array.isArray(source[key])) {
          target[key] = utils.extend(true, target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  });

  return target;
};

/**
 * Checks if a value is a plain object.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 * @example
 * $.isPlainObject({});        // Returns: true
 * $.isPlainObject([]);        // Returns: false
 * $.isPlainObject(null);      // Returns: false
 * $.isPlainObject(new Date); // Returns: false
 */
$.prototype.isPlainObject = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

/**
 * Creates a deep clone of an object.
 * @param {Object} obj - The object to clone.
 * @returns {Object} A deep clone of the object.
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const clone = $.deepClone(original);
 * console.log(clone);        // { a: 1, b: { c: 2 } }
 * console.log(clone === original);           // false
 * console.log(clone.b === original.b);       // false
 */
$.prototype.deepClone = function (obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = utils.deepClone(obj[key]);
    }
  }

  return clone;
};

/**
 * Flattens a nested object structure.
 * @param {Object} obj - The object to flatten.
 * @param {string} [prefix=''] - The prefix to use for flattened keys.
 * @returns {Object} A flattened version of the object.
 * @example
 * const nested = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: {
 *       e: 3
 *     }
 *   },
 *   f: 4
 * };
 * const flattened = $.flattenObject(nested);
 * console.log(flattened);
 * // Returns: {
 * //   'a': 1,
 * //   'b.c': 2,
 * //   'b.d.e': 3,
 * //   'f': 4
 * // }
 */
$.prototype.flattenObject = function (obj, prefix = "") {
  let result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        Object.assign(result, utils.flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};
