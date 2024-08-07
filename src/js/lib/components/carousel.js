/**
 * @file carousel.js
 * @description Carousel functionality for ModernLib.
 * @module components/carousel
 */

import $ from "../core";

/**
 * Initializes carousel functionality for selected elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="exampleCarousel" class="carousel">
 * //   <div class="carousel-inner">
 * //     <div class="carousel-slides">
 * //       <div class="carousel-item">Slide 1</div>
 * //       <div class="carousel-item">Slide 2</div>
 * //     </div>
 * //   </div>
 * //   <button data-slide="prev">Previous</button>
 * //   <button data-slide="next">Next</button>
 * //   <ol class="carousel-indicators">
 * //     <li data-slide-to="0"></li>
 * //     <li data-slide-to="1"></li>
 * //   </ol>
 * // </div>
 * 
 * // Initialize carousel
 * $('.carousel').carousel();
 */

$.prototype.carousel = function () {
  for (let i = 0; i < this.length; i++) {
    const width = window.getComputedStyle(this[i].querySelector(".carousel-inner")).width;
    const slides = this[i].querySelectorAll(".carousel-item");
    const slidesField = this[i].querySelector(".carousel-slides");
    const dots = this[i].querySelectorAll(".carousel-indicators li");

    slidesField.style.width = 100 * slides.length + "%";
    slides.forEach((slide) => {
      slide.style.width = width;
    });

    let offset = 0;
    let slideIndex = 0;

    $(this[i].querySelector('[data-slide="next"]')).click((e) => {
      e.preventDefault();
      if (offset == +width.replace(/\D/g, "") * (slides.length - 1)) {
        offset = 0;
      } else {
        offset += +width.replace(/\D/g, "");
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length - 1) {
        slideIndex = 0;
      } else {
        slideIndex++;
      }
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });

    $(this[i].querySelector('[data-slide="prev"]')).click((e) => {
      e.preventDefault();
      if (offset == 0) {
        offset = +width.replace(/\D/g, "") * (slides.length - 1);
      } else {
        offset -= +width.replace(/\D/g, "");
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 0) {
        slideIndex = slides.length - 1;
      } else {
        slideIndex--;
      }
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });

    const sliderId = this[i].getAttribute("id");
    $(`#${sliderId} .carousel-indicators li`).click((e) => {
      const slideTo = e.target.getAttribute("data-slide-to");

      slideIndex = slideTo;
      offset = +width.replace(/\D/g, "") * slideTo;

      slidesField.style.transform = `translateX(-${offset}px)`;
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });
  }
};

$(".carousel").carousel();
