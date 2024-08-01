(() => {
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
})();
