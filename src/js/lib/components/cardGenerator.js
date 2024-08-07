/**
 * @file cardGenerator.js
 * @description Card generation functionality for ModernLib.
 * @module components/cardGenerator
 */

import $ from '../core';

$.prototype.cardGenerator = function(url) {
    /**
     * Generates cards based on data fetched from a server.
     * @param {string} url - The URL to fetch card data from.
     * @returns {Object} The ModernLib object for chaining.
     * @example
     * // HTML structure
     * // <div class="goods d-flex f-space-around" id="cardContainer"></div>
     * 
     * // Initialize card generator
     * $('#cardContainer').cardGenerator('https://api.example.com/cards');
     */
    
    const createCard = ({imgSrc, title, text, link}) => {
        return `
            <div class="card">
                <img class="card-img" src="${imgSrc}" alt="${title}"/>
                <div class="card-body">
                    <div class="card-title">${title}</div>
                    <p class="card-text">${text}</p>
                    <a href="${link}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Link to</a>
                </div>
            </div>
        `;
    };

    this.get(url)
        .then(data => {
            let cards = '';
            JSON.parse(data.data).forEach(item => {
                cards += createCard(item);
            });
            this.html(cards);
        })
        .catch(error => console.error('Error fetching card data:', error));

    return this;
};

// Приклад використання:
// $('#cardContainer').cardGenerator('https://api.example.com/cards');

/**
 * Generates cards based on data fetched from a URL or local JSON file.
 * @memberof $.prototype
 * @param {string} source - The URL or file path to fetch card data from.
 * @param {boolean} [isLocal=false] - Whether the source is a local file.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Generate cards from API
 * $('#cardContainer').cardGenerator('https://api.example.com/cards');
 * // Generate cards from local JSON
 * $('#cardContainer').cardGeneratorLocal('data/cards.json', true);
 */

$.prototype.cardGeneratorLocal = function(source, isLocal = false) {
    const fetchMethod = isLocal ? this.fetchLocalJson : this.get;
    
    const createCard = ({imgSrc, title, text, link}) => `
        <div class="card">
            <img class="card-img" src="${imgSrc}" alt="${title}"/>
            <div class="card-body">
                <div class="card-title">${title}</div>
                <p class="card-text">${text}</p>
                <a href="${link}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Link to</a>
            </div>
        </div>
    `;

    fetchMethod.call(this, source)
        .then(data => {
            let cards = data.map(createCard).join('');
            this.html(cards);
        })
        .catch(error => console.error('Error generating cards:', error));

    return this;
};

// Приклад використання:
//$('#cardContainer').cardGeneratorLocal('data/cards.json', true);