import $ from "../core";
// https://www.w3schools.com/jsref/prop_node_attributes.asp
// https://www.w3schools.com/jsref/met_element_setattribute.asp
$.prototype.setAttr = function (attrName, attrValue) {
  for (let i = 0; i < this.length; i++) {
    this[i].setAttribute(attrName, attrValue);
  }
  return this;
};
