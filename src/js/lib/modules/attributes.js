/**
 * @file attributes.js
 * @description Attribute manipulation methods for ModernLib.
 * @module modules/attributes
 */
import $ from "../core";

// https://www.w3schools.com/jsref/prop_node_attributes.asp
// https://www.w3schools.com/jsref/met_element_setattribute.asp

/**
 * Sets an attribute on the selected elements.
 * @param {string} attrName - The name of the attribute to set.
 * @param {string} attrValue - The value to set for the attribute.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.setAttr = function (attrName, attrValue) {
  for (let i = 0; i < this.length; i++) {
    this[i].setAttribute(attrName, attrValue);
  }
  return this;
};
