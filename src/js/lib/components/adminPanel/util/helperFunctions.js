// helperFunctions.js

export function createTabs(containerSelector, tabsConfig) {
    const container = $(containerSelector);
    const tabPanel = $('<div class="tab-panel" data-tabpanel></div>');
    const tabContents = $('<div class="tab-contents"></div>');
  
    tabsConfig.forEach((tab, index) => {
      const tabItem = $(`<div class="tab-item${index === 0 ? ' tab-item--active' : ''}">${tab.title}</div>`);
      tabPanel.append(tabItem);
  
      const tabContent = $(`<div class="tab-content${index === 0 ? ' tab-content--active' : ''}">${tab.content}</div>`);
      tabContents.append(tabContent);
    });
  
    container.append(tabPanel).append(tabContents);
    $().tab(containerSelector);
  } 
  
  export function createModal(id, config) {
    const modalHTML = `
      <div class="modal" id="${id}">
        <div class="modal-dialog">
          <div class="modal-content">
            <button class="close" data-close>
              <span>&times;</span>
            </button>
            <div class="modal-header">
              <div class="modal-title">${config.title}</div>
            </div>
            <div class="modal-body">${config.body}</div>
            <div class="modal-footer">
              ${config.footer || ''}
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modalHTML);
    return $().modal(`#${id}`);
  }