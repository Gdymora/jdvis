/**
 * @file modal.js
 * @description Modal functionality for ModernLib.
 * @module components/modal
 */

import $ from "../core";

/**
 * Initializes modal functionality for selected elements.
 * @param {boolean} created - Indicates if the modal was dynamically created.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <button data-toggle="modal" data-target="#exampleModal">Open Modal</button>
 * // <div id="exampleModal" class="modal">...</div>
 *
 * // Initialize modal
 * $('[data-toggle="modal"]').modal();
 */

$.prototype.modal = function (created) {
  for (let i = 0; i < this.length; i++) {
    const target = this[i].getAttribute("data-target");
    $(this[i]).click((e) => {
      e.preventDefault();
      $(target).fadeIn(500);
      document.body.style.overflow = "hidden";
    });

    const closeElements = document.querySelectorAll(`${target} [data-close]`);
    closeElements.forEach((elem) => {
      $(elem).click(() => {
        $(target).fadeOut(500);
        document.body.style.overflow = "";
        if (created) {
          document.querySelector(target).remove();
        }
      });
    });

    $(target).click((e) => {
      if (e.target.classList.contains("modal")) {
        $(target).fadeOut(500);
        document.body.style.overflow = "";
        if (created) {
          document.querySelector(target).remove();
        }
      }
    });
  }
};

// Auto-initialize modals
$('[data-toggle="modal"]').modal();

/**
 * Creates a modal dynamically and attaches it to the selected element.
 * @param {Object} options - Modal configuration options.
 * @param {Object} options.text - Modal text content.
 * @param {string} options.text.title - Modal title.
 * @param {string} options.text.body - Modal body content.
 * @param {Object} options.btns - Modal buttons configuration.
 * @param {number} options.btns.count - Number of buttons.
 * @param {Array} options.btns.settings - Button settings array.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#dynamicModalTrigger').createModal({
 *     text: {
 *         title: 'Dynamic Modal',
 *         body: 'This is a dynamically created modal.'
 *     },
 *     btns: {
 *         count: 2,
 *         settings: [
 *             ['OK', ['btn-primary'], true, () => console.log('OK clicked')],
 *             ['Cancel', ['btn-secondary'], true]
 *         ]
 *     }
 * });
 */

$.prototype.createModal = function ({ text, btns } = {}) {
  for (let i = 0; i < this.length; i++) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute("id", this[i].getAttribute("data-target").slice(1));

    // btns = {count: num, settings: [[text, classNames=[], close, cb]]}
    const buttons = [];
    for (let j = 0; j < btns.count; j++) {
      let btn = document.createElement("button");
      btn.classList.add("btn", ...btns.settings[j][1]);
      btn.textContent = btns.settings[j][0];
      if (btns.settings[j][2]) {
        btn.setAttribute("data-close", "true");
      }
      if (btns.settings[j][3] && typeof btns.settings[j][3] === "function") {
        btn.addEventListener("click", btns.settings[j][3]);
      }

      buttons.push(btn);
    }

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <button class="close" data-close>
                    <span>&times;</span>
                </button>
                <div class="modal-header">
                    <div class="modal-title">
                        ${text.title}
                    </div>
                </div>
                <div class="modal-body">
                    ${text.body}
                </div>
                <div class="modal-footer">
                    
                </div>
            </div>
        </div>
        `;

    modal.querySelector(".modal-footer").append(...buttons);
    document.body.appendChild(modal);
    $(this[i]).modal(true);
    $(this[i].getAttribute("data-target")).fadeIn(500);
  }
};
