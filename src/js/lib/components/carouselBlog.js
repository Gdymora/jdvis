/**
 * @file carouselBlog.js
 * @description Image carousel functionality for ModernLib.
 */


/**
 * Initializes a simple image carousel.
 * @memberof $.prototype
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#imageCarousel').carouselBlog();
 */

$.prototype.carouselBlog = function() {
    for (let i = 0; i < this.length; i++) {
        const carousel = this[i];
        const slides = carousel.querySelectorAll('img');
        const slidesField = carousel.querySelector('.flex');
        const prevButton = carousel.querySelector('#prev');
        const nextButton = carousel.querySelector('#next');

        // Перевірка наявності необхідних елементів
        if (!slidesField || !prevButton || !nextButton || slides.length === 0) {
            console.error('Carousel is missing required elements');
            continue;
        }

        const slideWidth = 100 / 6; // Ширина одного слайду у відсотках
        const totalSlides = slides.length;

        // Налаштування ширини контейнера слайдів
        slidesField.style.width = `${slideWidth * totalSlides}%`;

        // Налаштування ширини кожного слайду
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}%`;
        });

        let offset = 0;
        let slideIndex = 0;

        const updateButtons = () => {
            prevButton.disabled = slideIndex === 0;
            nextButton.disabled = slideIndex >= totalSlides - 6;
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