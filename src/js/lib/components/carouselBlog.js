/**
 * @file carouselBlog.js
 * @description Image carousel functionality for ModernLib.
 * @module components/carouselBlog
 */

import $ from "../core";

/**
 * Initializes a customizable image carousel.
 * @memberof $.prototype
 * @param {Object} [options] - Customization options for the carousel.
 * @param {string} [options.prevButtonSelector='#prev'] - Selector for the previous button.
 * @param {string} [options.nextButtonSelector='#next'] - Selector for the next button.
 * @param {string} [options.slideSelector='img'] - Selector for the slide elements.
 * @param {string} [options.slidesContainerSelector='.flex'] - Selector for the slides container.
 * @param {number} [options.visibleSlides=6] - Number of slides visible at once.
 * @param {number} [options.slideWidth=16.66] - Width of each slide in percentage.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="imageCarousel" class="carousel">
 * //   <button id="prevBtn">Previous</button>
 * //   <div class="slides-container">
 * //     <img src="image1.jpg" alt="Image 1">
 * //     <img src="image2.jpg" alt="Image 2">
 * //     <!-- Add more images as needed -->
 * //   </div>
 * //   <button id="nextBtn">Next</button>
 * // </div>
 *
 * // Initialize the carousel with custom options
 * $('#imageCarousel').carouselBlogNew({
 *   prevButtonSelector: '#prevBtn',
 *   nextButtonSelector: '#nextBtn',
 *   slidesContainerSelector: '.slides-container',
 *   visibleSlides: 4,
 *   slideWidth: 25
 * });
 */
$.prototype.carouselBlog = function (options) {
  const settings = {
    prevButtonSelector: "#prev",
    nextButtonSelector: "#next",
    slideSelector: "img",
    slidesContainerSelector: ".flex",
    visibleSlides: 6,
    slideWidth: 100 / 6, // Default width for 6 visible slides
  };

  // Merge options with defaults
  if (options) {
    Object.keys(options).forEach((key) => {
      if (options[key] !== undefined) {
        settings[key] = options[key];
      }
    });
  }
  for (let i = 0; i < this.length; i++) {
    const carousel = this[i];
    const slides = carousel.querySelectorAll(settings.slideSelector);
    const slidesField = carousel.querySelector(settings.slidesContainerSelector);
    const prevButton = carousel.querySelector(settings.prevButtonSelector);
    const nextButton = carousel.querySelector(settings.nextButtonSelector);
    // Перевірка наявності необхідних елементів
    if (!slidesField || !prevButton || !nextButton || slides.length === 0) {
      console.error("Carousel is missing required elements");
      continue;
    }

    const slideWidth = settings.slideWidth;
    const totalSlides = slides.length;

    // Налаштування ширини контейнера слайдів
    slidesField.style.width = `${slideWidth * totalSlides}%`;

    // Налаштування ширини кожного слайду
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}%`;
    });

    let offset = 0;
    let slideIndex = 0;

    const updateButtons = () => {
      prevButton.disabled = slideIndex === 0;
      nextButton.disabled = slideIndex >= totalSlides - settings.visibleSlides;
    };

    const moveSlide = () => {
      slidesField.style.transform = `translateX(-${offset}%)`;
      updateButtons();
    };

    $(nextButton).click((e) => {
      e.preventDefault();
      if (slideIndex < totalSlides - 6) {
        offset += slideWidth;
        slideIndex++;
        moveSlide();
      }
    });

    $(prevButton).click((e) => {
      e.preventDefault();
      if (slideIndex > 0) {
        offset -= slideWidth;
        slideIndex--;
        moveSlide();
      }
    });

    // Початкова ініціалізація
    updateButtons();
  }

  return this;
};
