/* (() => {
  const $ = function (selector) {
    const elements = document.querySelectorAll(selector);
    const obj = {};
    obj.hide = () => {
      elements.forEach((elem) => {
        elem.style.display = "none";
      });
      return obj;
    };
    obj.show = () => {
      elements.forEach((elem) => {
        elem.style.display = "";
      });
      return obj;
    };
    return obj;
  };
  window.$ = $;
})(); */

const $ = function (selector) {
  return new $.prototype.init(selector);
};

$.prototype.init = function (selector) {
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
};

$.prototype.init.prototype = $.prototype;
// Додайте цей рядок для підтримки плагінів
$.fn = $.prototype;

// Додаємо метод forEach
$.prototype.each = function(callback) {
  for (let i = 0; i < this.length; i++) {
    callback.call(this[i], this[i], i, this);
  }
  return this;
};

// Експортуємо як глобальний об'єкт
if (typeof window !== 'undefined') {
  window.$ = $;
}

export default $;
