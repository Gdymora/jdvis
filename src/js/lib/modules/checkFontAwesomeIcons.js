import $ from "../core";

// Глобальна функція для перевірки готовності DOM
$().ready = function (callback) {
  return $(document).ready(callback);
};

// Реалізація перевірки іконок Font Awesome
$.prototype.checkFontAwesomeIcons = function () {
  return this.each(function () {
    const $this = $(this);
    if ($this.is(".fa-regular, .fa-solid, .fa-brands")) {
      const computedStyle = window.getComputedStyle($this[0], ":before");
      if (computedStyle.content === "none" || computedStyle.content === "") {
        const fallbackText = $this.text() || $this.data("fallback-text") || "";
        if (fallbackText && !$this.find(".fallback-text").length) {
          $this.empty().append($("<span>").addClass("fallback-text").text(fallbackText));
        }
      } else {
        $this.find(".fallback-text").hide();
      }
    }
  });
};

$.prototype.checkAllFontAwesomeIcons = function () {
  $(".fa-regular, .fa-solid, .fa-brands").checkFontAwesomeIcons();
};

// Автоматична перевірка після завантаження DOM
$().ready(function () {
  $().checkAllFontAwesomeIcons();
});
