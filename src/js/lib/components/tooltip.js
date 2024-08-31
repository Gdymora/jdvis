/**
 * Add tooltip functionality to the matched elements.
 * @param {Object} options - Configuration options for the tooltip.
 * @param {string} [options.class='tooltip'] - CSS class for the tooltip element.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Add default tooltips to all elements with a title attribute
 * $('[title]').tooltip();
 * 
 * @example
 * // Add tooltips with a custom class
 * $('[data-tooltip]').tooltip({ class: 'my-custom-tooltip' });
 */
$.prototype.tooltip = function(options = {}) {
    const tooltipClass = options.class || 'tooltip';
  
    this.forEach(element => {
      element.addEventListener('mouseenter', function() {
        const tooltipText = this.getAttribute('title') || this.getAttribute('data-tooltip');
        if (!tooltipText) return;
  
        const tooltip = document.createElement('div');
        tooltip.className = tooltipClass;
        tooltip.textContent = tooltipText;
        this.appendChild(tooltip);
  
        // Remove the title attribute to prevent the default browser tooltip
        this.setAttribute('data-original-title', this.getAttribute('title'));
        this.removeAttribute('title');
      });
  
      element.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector(`.${tooltipClass}`);
        if (tooltip) {
          tooltip.remove();
        }
  
        // Restore the title attribute
        const originalTitle = this.getAttribute('data-original-title');
        if (originalTitle) {
          this.setAttribute('title', originalTitle);
          this.removeAttribute('data-original-title');
        }
      });
    });
  
    return this;
  };