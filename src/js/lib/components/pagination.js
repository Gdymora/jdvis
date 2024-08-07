/**
 * @file pagination.js
 * @description Pagination functionality for ModernLib.
 */

import $ from "../core";

/**
 * Creates a pagination component.
 * @memberof $.prototype
 * @param {number} totalPages - The total number of pages.
 * @param {number} currentPage - The current active page.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#pagination').pagination(5, 1);
 */

$.prototype.pagination = function (totalPages, currentPage) {
  const createPaginationItem = (page, isActive = false) => `
        <a href="#" data-page="${page}" class="h-10 w-10 ${
    isActive ? "bg-blue-800 text-white" : "text-gray-800"
  } hover:bg-blue-600 hover:text-white font-semibold text-sm flex items-center justify-center">${page}</a>
    `;

  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += createPaginationItem(i, i === currentPage);
  }

  this.html(paginationHTML);
  this.find("a").click(function (e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    // Тут можна додати логіку завантаження нової сторінки
    console.log(`Loading page ${page}`);
  });

  return this;
};
