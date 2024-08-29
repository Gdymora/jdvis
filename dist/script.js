/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/lib/components/accordion.js":
/*!********************************************!*\
  !*** ./src/js/lib/components/accordion.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file accordion.js
 * @description Accordion functionality for ModernLib.
 * @module components/accordion
 */



/**
 * Initializes accordion functionality for selected elements.
 * @param {string} [headActive='accordion-head--active'] - Class name for active accordion header.
 * @param {string} [contentActive='accordion-content--active'] - Class name for active accordion content.
 * @param {number} [paddings=40] - Additional padding for content height calculation.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="accordion">
 * //   <div class="accordion-head">Section 1</div>
 * //   <div class="accordion-content">Content for section 1</div>
 * //   <div class="accordion-head">Section 2</div>
 * //   <div class="accordion-content">Content for section 2</div>
 * // </div>
 *
 * // Initialize accordion with default settings
 * $('.accordion-head').accordion();
 *
 * // Initialize accordion with custom settings
 * $('.accordion-head').accordion('custom-active-head', 'custom-active-content', 50);
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.accordion = function (headActive = "accordion-head--active", contentActive = "accordion-content--active", paddings = 40) {
  for (let i = 0; i < this.length; i++) {
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).click(() => {
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).toggleClass(headActive);
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i].nextElementSibling).toggleClass(contentActive);
      if (this[i].classList.contains(headActive)) {
        this[i].nextElementSibling.style.maxHeight = this[i].nextElementSibling.scrollHeight + paddings + "px";
      } else {
        this[i].nextElementSibling.style.maxHeight = "0px";
      }
    });
  }
};
(0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(".accordion-head").accordion();

/***/ }),

/***/ "./src/js/lib/components/adminPanel/adminPanelAuth.js":
/*!************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/adminPanelAuth.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showLoginForm: () => (/* binding */ showLoginForm)
/* harmony export */ });
/**
 * @file adminPanelAuth.js
 * @description Authentication functions for the admin panel
 * @module components/adminPanelAuth
 */

/**
 * Shows the login form for the admin panel
 * @param {Object} context - The ModernLib context
 * @param {Object} authComponent - The authentication component
 * @param {string} projectId - The ID of the current project
 * @param {Function} initCallback - Callback function to initialize the admin panel
 * @example
 * showLoginForm($, authComponent, '123', initializeAdminPanel);
 */

function showLoginForm(context, authService, projectId, onSuccessfulLogin) {
  const loginHTML = `
        <div class="flex items-center justify-center h-screen bg-gray-100">
          <div class="bg-white p-8 rounded shadow-md w-96">
            <h2 class="text-2xl font-bold mb-4">Admin Login</h2>
            <form id="loginForm">
              <input type="email" id="email" placeholder="Email" class="w-full p-2 mb-4 border rounded" required>
              <input type="password" id="password" placeholder="Password" class="w-full p-2 mb-4 border rounded" required>
              <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
            </form>
          </div>
        </div>
      `;
  context.html(loginHTML);
  $("#loginForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    try {
      await authService.login({
        email,
        password,
        projectId
      });
      const user = await authService.getMe(projectId);
      onSuccessfulLogin(user);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  });
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/adminPanelInit.js":
/*!************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/adminPanelInit.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeAdminPanel: () => (/* binding */ initializeAdminPanel)
/* harmony export */ });
/* harmony import */ var _util_helperFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/helperFunctions */ "./src/js/lib/components/adminPanel/util/helperFunctions.js");
/**
 * @file adminPanelInit.js
 * @description Initialization functions for the admin panel
 * @module components/adminPanel/init
 */

/**
 * Checks if the current user has a specific permission
 * @param {Object} services - The services object containing the userService
 * @param {string} permission - The permission to check
 * @returns {Promise<boolean>} A promise that resolves to true if the user has the permission, false otherwise
 */
async function checkPermission(services, permission, projectId) {
  try {
    if (!services || !services.userService || typeof services.userService.hasPermission !== "function") {
      console.error("User service or hasPermission method is not available");
      return false;
    }
    return await services.userService.hasPermission(permission, projectId);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

/**
 * Initializes the admin panel
 * @param {Object} context - The ModernLib context
 * @param {Object} user - The authenticated user object
 * @param {Object} options - Configuration options
 * @param {string} options.projectId - The ID of the current project
 * @param {Function} options.onMenuItemClick - Callback function for menu item clicks
 * @param {Array} [options.menuItems=[]] - Array of menu items
 * @param {Object} options.services - The initialized services
 * @param {Object} options.components - The initialized components
 * @fires context#adminPanelInitialized
 * @fires context#beforeMenuItemClick
 * @fires context#beforeContentLoad
 * @fires context#afterContentLoad
 * @fires context#dashboardLoaded
 * @fires context#usersLoaded
 * @fires context#rolesLoaded
 * @fires context#permissionsLoaded
 * @fires context#tablesLoaded
 * @fires context#postsLoaded
 * @fires context#accessDenied
 * @fires context#pageNotFound
 * @fires context#beforeLogout
 * @fires context#logoutSuccess
 * @fires context#logoutError
 * @fires context#adminPanelReady
 * @example
 * initializeAdminPanel($('#adminPanel'), { name: 'John Doe' }, {
 *   projectId: '123',
 *   onMenuItemClick: (menuId) => console.log(menuId),
 *   services: services,
 *   components: components
 * });
 */
function initializeAdminPanel(context, user, options) {
  const {
    projectId,
    onMenuItemClick,
    menuItems = [],
    services,
    components,
    customComponents = {},
    additionalComponents = {}
  } = options;
  if (!context || context.length === 0) {
    console.warn("Context is empty or undefined, initializing with document body");
    context = $(document.body);
  }
  const createMenuItem = item => `
    <a href="#" data-menu-id="${item.id}" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
      ${item.label}
    </a>
  `;
  const createSidebar = () => `
    <div class="w-64 bg-white shadow-md">
      <div class="p-4 bg-blue-600 text-white font-bold">
        Admin Panel
      </div>
      <div class="p-4">
        <p>Welcome, ${user.name}</p>
        <button id="logoutBtn" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>
      <nav class="mt-4">
        ${menuItems.map(createMenuItem).join("")}
      </nav>
    </div>
  `;
  const createMainContent = () => `
    <div class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-4">Welcome to Admin Panel</h1>
      <div id="contentArea">
        <!-- Dynamic content will be loaded here -->
      </div>
    </div>
  `;
  const adminPanelHTML = `
    <div class="flex h-screen bg-gray-100">
      ${createSidebar()}
      ${createMainContent()}
    </div>
  `;
  context.html(adminPanelHTML);

  // Додаємо допоміжні функції до контексту адмін-панелі
  const adminPanelHelpers = {
    createTabs: (containerSelector, tabsConfig) => (0,_util_helperFunctions__WEBPACK_IMPORTED_MODULE_0__.createTabs)(containerSelector, tabsConfig),
    createModal: (id, config) => (0,_util_helperFunctions__WEBPACK_IMPORTED_MODULE_0__.createModal)(id, config)
  };

  /**
   * Fires when the admin panel is initialized
   * @event context#adminPanelInitialized
   * @type {object}
   * @property {object} user - The authenticated user object
   * @property {string} projectId - The ID of the current project
   */
  context.trigger("adminPanelInitialized", {
    user,
    projectId
  });
  context.find("nav a").on("click", async function (e) {
    e.preventDefault();
    const menuId = this.getAttribute("data-menu-id");
    onMenuItemClick(menuId);

    // Update active menu item
    context.find("nav a").removeClass("bg-blue-100");
    context.find(this).addClass("bg-blue-100");

    // Load content based on menu item
    const contentArea = $(document.querySelector("#contentArea"));
    if (!contentArea || contentArea.length === 0) {
      console.error("Content area not found");
      return;
    }

    /**
     * Fires before content is loaded
     * @event context#beforeContentLoad
     * @type {object}
     * @property {string} menuId - The ID of the selected menu item
     * @property {Object} contentArea - The content area element
     */
    context.trigger("beforeContentLoad", {
      menuId,
      contentArea
    });
    const loadOptions = {
      page: 1,
      itemsPerPage: options.itemsPerPage,
      helpers: adminPanelHelpers
    };

    // Перевіряємо, чи є користувацький компонент для цього пункту меню
    if (customComponents[menuId]) {
      if (await checkPermission(services, `view_${menuId}`, projectId)) {
        // Передаємо допоміжні функції в користувацький компонент
        customComponents[menuId].load(contentArea, projectId, services[`${menuId}Service`], loadOptions);
        context.trigger(`${menuId}Loaded`);
      } else {
        contentArea.html(`<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view ${menuId}.</p>`);
        context.trigger("accessDenied", {
          section: menuId
        });
      }
    } else {
      switch (menuId) {
        case "dashboard":
          console.log("Dashboard case");
          contentArea.html('<h2 class="text-xl mb-4">Dashboard</h2><p>Welcome to your dashboard.</p>');
          /**
           * Fires when the dashboard is loaded
           * @event context#dashboardLoaded
           */
          context.trigger("dashboardLoaded");
          break;
        case "users":
          console.log("Users case");
          if (await checkPermission(services, "view_users", projectId)) {
            try {
              components.userManagement.load(contentArea, projectId, services.userService, services.roleService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
            /**
             * Fires when the users section is loaded
             * @event context#usersLoaded
             */
            components.userManagement.trigger("usersLoaded");
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view users.</p>');
            /**
             * Fires when access is denied to a section
             * @event context#accessDenied
             * @type {object}
             * @property {string} section - The section to which access was denied
             */
            context.trigger("accessDenied", {
              section: "users"
            });
          }
          break;
        case "roles":
          console.log("Roles case");
          if (await checkPermission(services, "view_roles", projectId)) {
            try {
              components.roleManagement.load(contentArea, projectId, services.roleService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view roles.</p>');
          }
          break;
        case "permissions":
          console.log("Permissions case");
          if (await checkPermission(services, "view_permissions", projectId)) {
            try {
              components.permissionManagement.load(contentArea, projectId, services.permissionService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view permissions.</p>');
          }
          break;
        case "tables":
          console.log("Tables case");
          if (await checkPermission(services, "view_tables", projectId)) {
            try {
              components.tableManagement.load(contentArea, projectId, services.tableStructureService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view tables.</p>');
          }
          break;
        case "posts":
          console.log("Posts case");
          if (await checkPermission(services, "view_posts", projectId)) {
            try {
              components.postManagement.load(contentArea, projectId, services.tableDataService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view posts.</p>');
          }
          break;
        case "settings":
          /**
           * Fires when the dashboard is loaded
           * @event context#settingsLoaded
           */
          context.trigger("settingsLoaded");
          break;
        default:
          console.log("Default case");
          contentArea.html('<h2 class="text-xl mb-4">Not Found</h2><p>The requested page does not exist.</p>');
          /**
           * Fires when a non-existent page is requested
           * @event context#pageNotFound
           * @type {object}
           * @property {string} menuId - The ID of the non-existent menu item
           */
          context.trigger("pageNotFound", {
            menuId
          });
      }
    }
    // console.log("Exiting switch statement");
    /**
     * Fires after content is loaded
     * @event context#afterContentLoad
     * @type {object}
     * @property {string} menuId - The ID of the selected menu item
     * @property {Object} contentArea - The content area element
     */
    context.trigger("afterContentLoad", {
      menuId,
      contentArea
    });
  });
  $(document.querySelector("#logoutBtn")).on("click", function (e) {
    e.preventDefault();
    services.authService.logout(projectId).then(() => {
      /**
       * Fires when logout is successful
       * @event context#logoutSuccess
       */
      context.trigger("logoutSuccess");
      window.location.reload();
    }).catch(error => {
      console.error("Logout failed:", error);
      /**
       * Fires when logout fails
       * @event context#logoutError
       * @type {object}
       * @property {Error} error - The error object
       */
      context.trigger("logoutError", {
        error
      });
      window.location.reload();
    });
  });
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components.js":
/*!********************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initComponents: () => (/* binding */ initComponents)
/* harmony export */ });
/* harmony import */ var _components_userManagement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/userManagement */ "./src/js/lib/components/adminPanel/components/userManagement.js");
/* harmony import */ var _components_roleManagement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/roleManagement */ "./src/js/lib/components/adminPanel/components/roleManagement.js");
/* harmony import */ var _components_permissionManagement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/permissionManagement */ "./src/js/lib/components/adminPanel/components/permissionManagement.js");
/* harmony import */ var _components_tableManagement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/tableManagement */ "./src/js/lib/components/adminPanel/components/tableManagement.js");
/* harmony import */ var _components_postManagement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/postManagement */ "./src/js/lib/components/adminPanel/components/postManagement.js");
/**
 * @file adminPanelComponents.js
 * @description Component initialization for the admin panel
 * @module components/adminPanel/components
 */






function initComponents(options = {}) {
  return {
    userManagement: options.userManagement || (0,_components_userManagement__WEBPACK_IMPORTED_MODULE_0__.createUserManagement)(),
    roleManagement: options.roleManagement || (0,_components_roleManagement__WEBPACK_IMPORTED_MODULE_1__.createRoleManagement)(),
    permissionManagement: options.permissionManagement || (0,_components_permissionManagement__WEBPACK_IMPORTED_MODULE_2__.createPermissionManagement)(),
    tableManagement: options.tableManagement || (0,_components_tableManagement__WEBPACK_IMPORTED_MODULE_3__.createTableManagement)(),
    postManagement: options.postManagement || (0,_components_postManagement__WEBPACK_IMPORTED_MODULE_4__.createPostManagement)()
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components/permissionManagement.js":
/*!*****************************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components/permissionManagement.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPermissionManagement: () => (/* binding */ createPermissionManagement)
/* harmony export */ });
// components/permissionManagement.js
function createPermissionManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000
  });
  return {
    load: function (contentArea, projectId, permissionService, options = {}) {
      const {
        page = 1,
        itemsPerPage = 10
      } = options;
      permissionService.getAll(projectId, {
        page,
        itemsPerPage
      }).then(response => {
        const permissions = response.data;
        const totalPages = response.last_page;
        let permissionsHTML = `
          <h2 class="text-xl mb-4">Permissions</h2>
          <button id="addPermissionBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Permission</button>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Description</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${permissions.map(permission => `
                <tr>
                  <td>${permission.name}</td>
                  <td>${permission.description}</td>
                  <td>
                    <button class="editPermissionBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${permission.id}">Edit</button>
                    <button class="deletePermissionBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${permission.id}">Delete</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;
        contentArea.html(permissionsHTML);

        // Render pagination
        $("#paginationArea").pagination(totalPages, page);
        $("#addPermissionBtn").click(() => this.showForm(contentArea, projectId, permissionService));
        $(".editPermissionBtn").click(e => {
          const permissionId = $(e.target).data("id");
          this.showForm(contentArea, projectId, permissionService, permissionId);
        });
        $(".deletePermissionBtn").click(e => {
          const permissionId = $(e.target).data("id");
          if (confirm("Are you sure you want to delete this permission?")) {
            permissionService.delete(projectId, permissionId).then(() => {
              notification.show("Permission deleted successfully", "success");
              this.load(contentArea, projectId, permissionService, options);
            }).catch(error => {
              notification.show("Error deleting permission: " + error.message, "error");
            });
          }
        });
      }).catch(error => {
        contentArea.html("<p>Error loading permissions.</p>");
        notification.show("Error loading permissions: " + error.message, "error");
      });
    },
    showForm: function (contentArea, projectId, permissionService, permissionId = null) {
      const title = permissionId ? "Edit Permission" : "Add Permission";
      const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="permissionForm">
        <input type="text" id="permissionName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <textarea id="permissionDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;
      contentArea.html(formHTML);
      if (permissionId) {
        permissionService.getById(projectId, permissionId).then(permission => {
          $("#permissionName").val(permission.name);
          $("#permissionDescription").val(permission.description);
        });
      }
      $("#permissionForm").on("submit", e => {
        e.preventDefault();
        const permissionData = {
          name: $("#permissionName").val(),
          description: $("#permissionDescription").val()
        };
        const action = permissionId ? permissionService.update(projectId, permissionId, permissionData) : permissionService.create(projectId, permissionData);
        action.then(() => {
          notification.show(`Permission ${permissionId ? "updated" : "created"} successfully`, "success");
          this.load(contentArea, projectId, permissionService);
        }).catch(error => {
          notification.show(`Error ${permissionId ? "updating" : "creating"} permission: ` + error.message, "error");
        });
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data
      });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    }
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components/postManagement.js":
/*!***********************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components/postManagement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPostManagement: () => (/* binding */ createPostManagement)
/* harmony export */ });
// components/tableManagement.js

function createPostManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000
  });
  return {
    load: function (contentArea, projectId, postService, options = {}) {
      const {
        page = 1,
        itemsPerPage = 15
      } = options;
      postService.getAll(projectId, {
        page,
        itemsPerPage
      }).then(response => {
        const posts = response.data;
        let postsHTML = `
            <h2 class="text-lg font-semibold mb-4">Posts</h2>
            <button id="addPostBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <i class="fa-regular fa-square-plus fa-xl" style="color: #3e1e9f"></i>
            </button>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="fa-solid fa-wrench"></i>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${posts.map((post, index) => `
                  <tr class="text-black">
                    <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${post.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${post.created_at}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button class="viewPostBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${post.id}">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                      <button class="editPostBtn bg-none rounded-md mx-2" data-id="${post.id}">
                        <i class="fa-solid fa-pencil" style="color: #429424"></i>
                      </button>
                      <button class="deletePostBtn bg-none rounded-md mx-2" data-id="${post.id}">
                        <i class="fa-regular fa-trash-can" style="color: #ea3f06"></i>
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
        contentArea.html(postsHTML);

        // Add event listeners
        $("#addPostBtn").click(() => showPostForm(contentArea, projectId, postsComponent));
        $(".viewPostBtn").click(function () {
          const postId = $(this).data("id");
          this.viewPost(contentArea, projectId, postsComponent, postId);
        });
        $(".editPostBtn").click(function () {
          const postId = $(this).data("id");
          this.showForm(contentArea, projectId, postsComponent, postId);
        });
        $(".deletePostBtn").click(function () {
          const postId = $(this).data("id");
          if (confirm("Are you sure you want to delete this post?")) {
            this.deletePost(contentArea, projectId, postsComponent, postId);
          }
        });
      }).catch(error => {
        contentArea.html("<p>Error loading posts.</p>");
        notification.show("Error loading posts: " + error.message, "error");
      });
    },
    showForm: function (contentArea, projectId, roleService, roleId = null) {
      const title = tableId ? "Edit Table Structure" : "Create New Table Structure";
      const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="tableStructureForm">
        <input type="text" id="tableName" placeholder="Table Name" class="w-full p-2 mb-4 border rounded" required>
        <div id="tableFields"></div>
        <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${tableId ? "Update" : "Create"} Table</button>
      </form>
    `;
      contentArea.html(formHTML);
      let fields = [{
        name: "",
        type: "text",
        tag: "",
        filter: null
      }];
      function renderFields() {
        $("#tableFields").html(fields.map((field, index) => `
          <div class="field-row mb-2">
            <input type="text" name="fieldName" placeholder="Field Name" value="${field.name}" class="p-2 border rounded mr-2" required>
            <select name="fieldType" class="p-2 border rounded mr-2">
              <option value="text" ${field.type === "text" ? "selected" : ""}>Text</option>
              <option value="number" ${field.type === "number" ? "selected" : ""}>Number</option>
              <option value="date" ${field.type === "date" ? "selected" : ""}>Date</option>
            </select>
            <select name="fieldTag" class="p-2 border rounded mr-2">
              <option value="">Select tag</option>
              <option value="img" ${field.tag === "img" ? "selected" : ""}>image</option>
              <option value="p" ${field.tag === "p" ? "selected" : ""}>text</option>
              <option value="div" ${field.tag === "div" ? "selected" : ""}>div</option>
            </select>
            ${index === 0 ? `
              <label>
                <input type="checkbox" name="fieldFilter" ${field.filter ? "checked" : ""}> Filter
              </label>
            ` : ""}
            <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
          </div>
        `).join(""));
        $(".removeFieldBtn").click(function () {
          const index = $(this).closest(".field-row").index();
          fields.splice(index, 1);
          renderFields();
        });
      }
      renderFields();
      $("#addFieldBtn").click(() => {
        fields.push({
          name: "",
          type: "text",
          tag: "",
          filter: null
        });
        renderFields();
      });
      if (tableId) {
        tableStructureComponent.getById(projectId, tableId).then(table => {
          $("#tableName").val(table.table_name);
          fields = JSON.parse(table.table_structure);
          renderFields();
        });
      }
      $("#tableStructureForm").on("submit", e => {
        e.preventDefault();
        const tableData = {
          table_name: $("#tableName").val(),
          table_structure: fields.map((_, index) => ({
            name: $("input[name='fieldName']").eq(index).val(),
            type: $("select[name='fieldType']").eq(index).val(),
            tag: $("select[name='fieldTag']").eq(index).val(),
            filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : null
          }))
        };
        const action = tableId ? tableStructureComponent.update(projectId, tableId, tableData) : tableStructureComponent.create(projectId, tableData);
        action.then(() => {
          notification.show(`Table ${tableId ? "updated" : "created"} successfully`, "success");
          this.load(contentArea, projectId, tableStructureComponent);
        }).catch(error => {
          notification.show(`Error ${tableId ? "updating" : "creating"} table: ${error.message}`, "error");
        });
      });
    },
    viewPost: function (contentArea, projectId, postService, postId) {
      postService.getById(projectId, postId).then(post => {
        let postHTML = `
          <h2 class="text-xl mb-4">${post.title}</h2>
          <p><strong>Created at:</strong> ${post.created_at}</p>
          <p><strong>Updated at:</strong> ${post.updated_at}</p>
          <div class="mt-4">
            ${post.content}
          </div>
          <div class="mt-4">
            <button id="editPostBtn" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
            <button id="deletePostBtn" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        `;
        contentArea.html(postHTML);
        $('#editPostBtn').click(() => this.showPostForm(contentArea, projectId, postService, postId));
        $('#deletePostBtn').click(() => this.deletePost(contentArea, projectId, postService, postId));
      });
    },
    deletePost: function (contentArea, projectId, postService, postId) {
      if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        postService.delete(projectId, postId).then(() => {
          alert('Post deleted successfully');
          this.load(contentArea, projectId, postService);
        });
      }
    },
    showPostForm: function (contentArea, projectId, postService, postId = null) {
      const isEditing = postId !== null;
      let formHTML = `
        <h2>${isEditing ? 'Edit' : 'Create'} Post</h2>
        <form id="postForm">
          <div class="mb-4">
            <label for="postTitle" class="block mb-2">Title</label>
            <input type="text" id="postTitle" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required>
          </div>
          <div class="mb-4">
            <label for="postContent" class="block mb-2">Content</label>
            <textarea id="postContent" name="content" rows="10" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required></textarea>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">${isEditing ? 'Update' : 'Create'} Post</button>
        </form>
      `;
      contentArea.html(formHTML);
      if (isEditing) {
        postService.getById(projectId, postId).then(post => {
          $('#postTitle').val(post.title);
          $('#postContent').val(post.content);
        });
      }
      $('#postForm').submit(e => {
        e.preventDefault();
        const postData = {
          title: $('#postTitle').val(),
          content: $('#postContent').val()
        };
        const action = isEditing ? postService.update(projectId, postId, postData) : postService.create(projectId, postData);
        action.then(() => {
          alert(`Post ${isEditing ? 'updated' : 'created'} successfully`);
          this.load(contentArea, projectId, postService);
        });
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data
      });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    }
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components/roleManagement.js":
/*!***********************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components/roleManagement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRoleManagement: () => (/* binding */ createRoleManagement)
/* harmony export */ });
// components/roleManagement.js

function createRoleManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000
  });
  return {
    load: function (contentArea, projectId, roleService, options = {}) {
      const {
        page = 1,
        itemsPerPage = 10
      } = options;
      roleService.getAll(projectId, {
        page,
        itemsPerPage
      }).then(response => {
        const roles = response.data;
        const totalPages = response.last_page;
        let rolesHTML = `
            <h2 class="text-xl mb-4">Roles</h2>
            <button id="addRoleBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Role</button>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Description</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${roles.map(role => `
                  <tr>
                    <td>${role.name}</td>
                    <td>${role.description || ""}</td>
                    <td>
                      <button class="editRoleBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${role.id}">Edit</button>
                      <button class="deleteRoleBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${role.id}">Delete</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
        contentArea.html(rolesHTML);

        // Render pagination
        $("#paginationArea").pagination(totalPages, page);
        $("#addRoleBtn").click(() => this.showForm(contentArea, projectId, roleService));
        $(".editRoleBtn").click(e => {
          const roleId = $(e.target).data("id");
          this.showForm(contentArea, projectId, roleService, roleId);
        });
        $(".deleteRoleBtn").click(e => {
          const roleId = $(e.target).data("id");
          if (confirm("Are you sure you want to delete this role?")) {
            roleService.delete(projectId, roleId).then(() => {
              notification.show("Role deleted successfully", "success");
              this.load(contentArea, projectId, roleService, options);
            }).catch(error => {
              notification.show(`Error deleting role: ${error.message}`, "error");
            });
          }
        });
      }).catch(error => {
        contentArea.html("<p>Error loading roles.</p>");
        notification.show(`Error loading roles: ${error.message}`, "error");
      });
    },
    showForm: function (contentArea, projectId, roleService, roleId = null) {
      const title = roleId ? "Edit Role" : "Add Role";
      const formHTML = `
          <h2 class="text-xl mb-4">${title}</h2>
          <form id="roleForm">
            <input type="text" id="roleName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
            <textarea id="roleDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
          </form>
        `;
      contentArea.html(formHTML);
      if (roleId) {
        roleService.getById(projectId, roleId).then(role => {
          $("#roleName").val(role.name);
          $("#roleDescription").val(role.description);
        });
      }
      $("#roleForm").on("submit", e => {
        e.preventDefault();
        const roleData = {
          name: $("#roleName").val(),
          description: $("#roleDescription").val()
        };
        const action = roleId ? roleService.update(projectId, roleId, roleData) : roleService.create(projectId, roleData);
        action.then(() => {
          notification.show(`Role ${roleId ? "updated" : "created"} successfully`, "success");
          this.load(contentArea, projectId, roleService);
        }).catch(error => {
          notification.show(`Error ${roleId ? "updating" : "creating"} role: ${error.message}`, "error");
        });
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data
      });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    }
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components/tableManagement.js":
/*!************************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components/tableManagement.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTableManagement: () => (/* binding */ createTableManagement)
/* harmony export */ });
// components/tableManagement.js

function createTableManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000
  });
  return {
    load: function (contentArea, projectId, tableStructureService, options = {}) {
      const {
        page = 1,
        itemsPerPage = 15
      } = options;
      tableStructureService.getAll(projectId, {
        page,
        itemsPerPage
      }).then(response => {
        const tables = response.data || [];
        let tablesHTML = `
            <h2 class="text-lg font-semibold mb-4">User Tables</h2>
            <button id="addTableBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <i class="fa-regular fa-square-plus fa-xl" style="color: #3e1e9f"></i>
            </button>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id number</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="fa-solid fa-wrench"></i>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${tables.map((table, index) => `
                  <tr class="text-black">
                    <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${table.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${table.table_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${table.created_at}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${table.updated_at}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      ${table.table_data && table.table_data.length > 0 && JSON.parse(table.table_data[0].data).length > 0 ? `
                        <button class="viewTableBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${table.id}">
                          <i class="fa-regular fa-eye">view</i>
                        </button>
                        <button class="fillTableBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                          <i class="fa-regular fa-square-plus fa-lg">add</i>
                        </button>
                        <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                          <i class="fa-solid fa-file-excel fa-lg">exel</i>
                        </button>
                      ` : `
                        <button class="viewTableBtn p-2 bg-gray-500 text-white rounded-md mr-2" data-id="${table.id}" disabled>
                          <i class="fa-regular fa-eye">view</i>
                        </button>
                        <button class="fillTableBtn px-2 py-3 bg-green-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                          <i class="fa-regular fa-square-plus fa-lg">add</i>
                        </button>
                        <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                          <i class="fa-solid fa-file-excel fa-lg">exel</i>
                        </button>
                      `}
                      <button class="cloneTableBtn bg-none rounded-md mx-2" data-id="${table.id}">clone</button>
                      <button class="editTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                        <i class="fa-solid fa-pencil" style="color: #429424">edit</i>
                      </button>
                      <button class="deleteTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                        <i class="fa-regular fa-trash-can" style="color: #ea3f06">delete</i>
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
        contentArea.html(tablesHTML);

        // Add event listeners
        $("#addTableBtn").click(() => this.showForm(contentArea, projectId, tableStructureService));
        $(".viewTableBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          this.viewTable(contentArea, projectId, tableStructureService, tableId);
        });
        $(".fillTableBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          const action = $(e.currentTarget).data("action");
          this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, action);
        });
        $(".excelImportBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          const action = $(e.currentTarget).data("action");
          this.showExcelImportForm(contentArea, projectId, tableStructureService, tableId, action);
        });
        $(".cloneTableBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          this.cloneTable(contentArea, projectId, tableStructureService, tableId);
        });
        $(".editTableBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          this.showTableStructureForm(contentArea, projectId, tableStructureService, tableId);
        });
        $(".deleteTableBtn").click(e => {
          const tableId = $(e.currentTarget).data("id");
          if (confirm("Are you sure you want to delete this table?")) {
            this.deleteTable(contentArea, projectId, tableStructureService, tableId);
          }
        });
      }).catch(error => {
        contentArea.html("<p>Error loading tables.</p>");
        notification.show("Error loading tables: " + error.message, "error");
      });
    },
    showForm: function (contentArea, projectId, tableStructureService, tableId = null) {
      const title = tableId ? "Edit Table Structure" : "Create New Table Structure";
      const formHTML = `
        <div class="w-full min-w-3xl max-w-3xl p-4 bg-white shadow-md rounded-md">
          <h2 class="text-lg font-semibold mb-4">${title}</h2>
          <form id="tableStructureForm">
            <input type="text" id="tableName" placeholder="Table name" class="w-full min-w-3xl max-w-3xl px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <div id="tableFields"></div>
            <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
            <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${tableId ? "Update" : "Create"} Table</button>
          </form>
        </div>
      `;
      contentArea.html(formHTML);
      let fields = [{
        name: "",
        type: "text",
        tag: "",
        filter: null
      }];
      function renderFields() {
        $("#tableFields").html(fields.map((field, index) => `
            <div class="field-row mb-2">
              <input type="text" name="fieldName" placeholder="Field Name" value="${field.name}" class="p-2 border rounded mr-2" required>
              <select name="fieldType" class="p-2 border rounded mr-2">
                <option value="text" ${field.type === "text" ? "selected" : ""}>Text</option>
                <option value="number" ${field.type === "number" ? "selected" : ""}>Number</option>
                <option value="date" ${field.type === "date" ? "selected" : ""}>Date</option>
              </select>
              <select name="fieldTag" class="p-2 border rounded mr-2">
                <option value="">Select tag</option>
                <option value="img" ${field.tag === "img" ? "selected" : ""}>image</option>
                <option value="p" ${field.tag === "p" ? "selected" : ""}>text</option>
                <option value="div" ${field.tag === "div" ? "selected" : ""}>div</option>
              </select>
              ${index === 0 ? `
                <label>
                  <input type="checkbox" name="fieldFilter" ${field.filter ? "checked" : ""}> Filter
                </label>
              ` : ""}
              <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
            </div>
          `).join(""));
        $(".removeFieldBtn").click(function () {
          const index = $(this).closest(".field-row").index();
          fields.splice(index, 1);
          renderFields();
        });
      }
      renderFields();
      $("#addFieldBtn").click(() => {
        fields.push({
          name: "",
          type: "text",
          tag: "",
          filter: null
        });
        renderFields();
      });
      if (tableId) {
        tableStructureService.getById(projectId, tableId).then(table => {
          $("#tableName").val(table.table_name);
          fields = JSON.parse(table.table_structure);
          renderFields();
        });
      }
      $("#tableStructureForm").submit(e => {
        e.preventDefault();
        const tableData = {
          table_name: $("#tableName").val(),
          table_structure: fields.map((_, index) => ({
            name: $("input[name='fieldName']").eq(index).val(),
            type: $("select[name='fieldType']").eq(index).val(),
            tag: $("select[name='fieldTag']").eq(index).val(),
            filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : null
          }))
        };
        const action = tableId ? tableStructureService.update(projectId, tableId, tableData) : tableStructureService.create(projectId, tableData);
        action.then(() => {
          notification.show(`Table ${tableId ? "updated" : "created"} successfully`, "success");
          this.load(contentArea, projectId, tableStructureService);
        }).catch(error => {
          notification.show(`Error ${tableId ? "updating" : "creating"} table: ${error.message}`, "error");
        });
      });
    },
    viewTable: function (contentArea, projectId, tableStructureService, tableId) {
      tableStructureService.getById(projectId, tableId).then(tableData => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];
        let tableHTML = `
          <h2 class="text-lg font-semibold m-4">${tableData.table_name} (ID: ${tableData.id})</h2>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                ${tableStructure.map(column => `
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ${column.name}
                  </th>
                `).join("")}
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${tableDataParsed.map((row, rowIndex) => `
                <tr class="text-black">
                  ${tableStructure.map(column => `
                    <td class="px-6 py-4 whitespace-nowrap">${row[column.name] || ""}</td>
                  `).join("")}
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button class="editRowBtn bg-blue-500 text-white px-2 py-1 rounded mr-2" data-row-index="${rowIndex}">Edit</button>
                    <button class="deleteRowBtn bg-red-500 text-white px-2 py-1 rounded" data-row-index="${rowIndex}">Delete</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <button id="addRowBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Row</button>
        `;
        contentArea.html(tableHTML);

        // Add event listeners
        $("#addRowBtn").click(() => this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, "add"));
        $(".editRowBtn").click(function () {
          const rowIndex = $(this).data("row-index");
          this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, "edit", rowIndex);
        });
        $(".deleteRowBtn").click(function () {
          const rowIndex = $(this).data("row-index");
          if (confirm("Are you sure you want to delete this row?")) {
            this.deleteTableRow(contentArea, projectId, tableStructureService, tableId, rowIndex);
          }
        });
      });
    },
    showFillTableForm: function (contentArea, projectId, tableStructureService, tableId, action, rowIndex = null) {
      tableStructureService.getById(projectId, tableId).then(tableData => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];
        let formHTML = `
          <h2>${action === "add" ? "Add" : "Edit"} Row</h2>
          <form id="fillTableForm">
            ${tableStructure.map(field => `
              <div>
                <label for="${field.name}">${field.name}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" 
                  value="${action === "edit" && rowIndex !== null ? tableDataParsed[rowIndex][field.name] || "" : ""}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              </div>
            `).join("")}
            <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        `;
        contentArea.html(formHTML);
        $("#fillTableForm").submit(e => {
          e.preventDefault();
          const formData = {};
          tableStructure.forEach(field => {
            formData[field.name] = $(`#${field.name}`).val();
          });
          if (action === "add") {
            tableDataParsed.push(formData);
          } else if (action === "edit" && rowIndex !== null) {
            tableDataParsed[rowIndex] = formData;
          }
          this.updateTableData(contentArea, projectId, tableStructureService, tableId, tableDataParsed);
        });
      });
    },
    showExcelImportForm: function (contentArea, projectId, tableStructureService, tableId) {
      let formHTML = `
        <h2>Import Excel Data</h2>
        <form id="excelImportForm">
          <input type="file" id="excelFile" accept=".xlsx, .xls" required>
          <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Import</button>
        </form>
      `;
      contentArea.html(formHTML);
      $("#excelImportForm").submit(e => {
        e.preventDefault();
        const file = $("#excelFile")[0].files[0];
        if (file) {
          // Here you would typically use a library like SheetJS to parse the Excel file
          // For this example, we'll just simulate the process
          setTimeout(() => {
            alert("Excel import simulated. In a real implementation, the file would be parsed and data added to the table.");
            this.viewTable(contentArea, projectId, tableStructureService, tableId);
          }, 1000);
        }
      });
    },
    cloneTable: function (contentArea, projectId, tableStructureService, tableId) {
      tableStructureService.getById(projectId, tableId).then(tableData => {
        const newTableName = `${tableData.table_name} (Clone)`;
        const newTableData = {
          ...tableData,
          id: null,
          table_name: newTableName,
          table_data: []
        };
        tableStructureService.create(projectId, newTableData).then(() => {
          alert(`Table cloned successfully. New table name: ${newTableName}`);
          this.load(contentArea, projectId, tableStructureService);
        });
      });
    },
    deleteTable: function (contentArea, projectId, tableStructureService, tableId) {
      if (confirm("Are you sure you want to delete this table? This action cannot be undone.")) {
        tableStructureService.delete(projectId, tableId).then(() => {
          alert("Table deleted successfully");
          this.load(contentArea, projectId, tableStructureService);
        });
      }
    },
    updateTableData: function (contentArea, projectId, tableStructureService, tableId, newData) {
      tableStructureService.update(projectId, tableId, {
        table_data: JSON.stringify(newData)
      }).then(() => {
        alert("Table data updated successfully");
        this.viewTable(contentArea, projectId, tableStructureService, tableId);
      });
    },
    deleteTableRow: function (contentArea, projectId, tableStructureService, tableId, rowIndex) {
      tableStructureService.getById(projectId, tableId).then(tableData => {
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];
        tableDataParsed.splice(rowIndex, 1);
        this.updateTableData(contentArea, projectId, tableStructureService, tableId, tableDataParsed);
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data
      });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    }
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/components/userManagement.js":
/*!***********************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/components/userManagement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createUserManagement: () => (/* binding */ createUserManagement)
/* harmony export */ });
// components/userManagement.js

function createUserManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000
  });
  return {
    load: function (contentArea, projectId, userService, roleService, options = {}) {
      const {
        page = 1,
        itemsPerPage = 10
      } = options;
      userService.getAll(projectId, {
        page,
        itemsPerPage
      }).then(response => {
        const users = response.data;
        const totalPages = response.last_page;
        let usersHTML = `
            <h2 class="text-xl mb-4">Users</h2>
            <button id="addUserBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add User</button>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Roles</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(user => `
                  <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.roles ? user.roles.map(role => role.name).join(", ") : ""}</td>
                    <td>
                      <button class="editUserBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${user.id}">Edit</button>
                      <button class="deleteUserBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2" data-id="${user.id}">Delete</button>
                      <button class="manageRolesBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" data-id="${user.id}">Manage Roles</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
        contentArea.html(usersHTML);
        $("#paginationArea").pagination(totalPages, page);
        $("#addUserBtn").click(() => this.showForm(contentArea, projectId, userService, roleService));
        $(".editUserBtn").click(e => {
          const userId = $(e.target).data("id");
          this.showForm(contentArea, projectId, userService, roleService, userId);
        });
        $(".deleteUserBtn").click(e => {
          const userId = $(e.target).data("id");
          if (confirm("Are you sure you want to delete this user?")) {
            userService.delete(projectId, userId).then(() => {
              notification.show("User deleted successfully", "success");
              this.load(contentArea, projectId, userService, roleService);
            }).catch(error => {
              notification.show("Error deleting user: " + error.message, "error");
              console.error("Error deleting user: " + error.message);
            });
          }
        });
        $(".manageRolesBtn").click(e => {
          const userId = $(e.target).data("id");
          this.showRolesManagement(contentArea, projectId, userService, roleService, userId);
        });
      }).catch(error => {
        contentArea.html("<p>Error loading users.</p>");
        notification.show("Error loading users: " + error.message, "error");
        console.error("Error loading users: " + error.message);
      });
    },
    showForm: function (contentArea, projectId, userService, roleService, userId = null) {
      const title = userId ? "Edit User" : "Add User";
      Promise.all([roleService.getAll(projectId, {
        page: 1,
        itemsPerPage: 100
      }), userId ? userService.getById(projectId, userId) : Promise.resolve(null)]).then(([rolesResponse, user]) => {
        const roles = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse.data || [];
        const formHTML = `
          <h2 class="text-xl mb-4">${title}</h2>
          <form id="userForm">
            <input type="text" id="userName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required value="${user ? user.name : ""}">
            <input type="email" id="userEmail" placeholder="Email" class="w-full p-2 mb-4 border rounded" required value="${user ? user.email : ""}">
            ${!userId ? `
              <input type="password" id="userPassword" placeholder="Password" class="w-full p-2 mb-4 border rounded" required>
              <input type="password" id="userConfirmed" placeholder="Confirm Password" class="w-full p-2 mb-4 border rounded" required>
            ` : ""}
            <div class="mb-4">
              <label class="block mb-2">Roles:</label>
              ${roles.map(role => `
                <label class="inline-flex items-center mr-4">
                  <input type="checkbox" class="form-checkbox" name="roles[]" value="${role.id}"
                    ${user && user.roles && user.roles.some(r => r.id === role.id) ? "checked" : ""}>
                  <span class="ml-2">${role.name}</span>
                </label>
              `).join("")}
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
          </form>
        `;
        contentArea.html(formHTML);
        $("#userForm").on("submit", e => {
          e.preventDefault();
          const userData = {
            name: $("#userName").val(),
            email: $("#userEmail").val(),
            roles: Array.from(document.querySelectorAll('input[name="roles[]"]:checked')).map(checkbox => checkbox.value)
          };
          if (!userId) {
            userData.password = $("#userPassword").val();
            userData.password_confirmation = $("#userConfirmed").val();
          }
          const action = userId ? userService.update(projectId, userId, userData) : userService.create(projectId, userData);
          action.then(() => {
            notification.show(`User ${userId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, userService, roleService);
          }).catch(error => {
            notification.show(`Error ${userId ? "updating" : "creating"} user: ${error.message}`, "error");
            console.error(`Error ${userId ? "updating" : "creating"} user: ${error.message}`);
            this.trigger("userError", {
              error,
              action: userId ? "update" : "create"
            });
          });
        });
      }).catch(error => {
        notification.show("Error loading form data: " + error.message, "error");
        console.error("Error loading form data: " + error.message);
      });
    },
    showRolesManagement: function (contentArea, projectId, userService, roleService, userId) {
      Promise.all([userService.getById(projectId, userId), roleService.getAll(projectId, {
        page: 1,
        itemsPerPage: 100
      })]).then(([user, rolesResponse]) => {
        const roles = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse.data || [];
        const rolesManagementHTML = `
          <h2 class="text-xl mb-4">Manage Roles for ${user.name}</h2>
          <div class="mb-4">
            ${roles.map(role => `
              <div class="mb-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox roleCheckbox" data-role-id="${role.id}" 
                    ${user.roles.some(r => r.id === role.id) ? "checked" : ""}>
                  <span class="ml-2">${role.name}</span>
                </label>
              </div>
            `).join("")}
          </div>
          <button id="backBtn" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back</button>
        `;
        contentArea.html(rolesManagementHTML);
        $(".roleCheckbox").change(e => {
          const roleId = $(e.target).data("role-id");
          const isChecked = e.target.checked;
          const action = isChecked ? userService.assignRole(projectId, userId, roleId) : userService.removeRole(projectId, userId, roleId);
          action.then(() => {
            notification.show(`Role ${isChecked ? "assigned to" : "removed from"} user successfully`, "success");
          }).catch(error => {
            notification.show(`Error ${isChecked ? "assigning" : "removing"} role: ${error.message}`, "error");
            console.error(`Error ${isChecked ? "assigning" : "removing"} role: ${error.message}`);
            e.target.checked = !isChecked; // Revert checkbox state on error
          });
        });
        $("#backBtn").click(() => this.load(contentArea, projectId, userService, roleService));
      }).catch(error => {
        notification.show("Error loading roles management: " + error.message, "error");
        console.error("Error loading roles management: " + error.message);
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, {
        detail: data
      });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    }
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/index.js":
/*!***************************************************!*\
  !*** ./src/js/lib/components/adminPanel/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core */ "./src/js/lib/core.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services */ "./src/js/lib/components/adminPanel/services.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./src/js/lib/components/adminPanel/components.js");
/* harmony import */ var _adminPanelAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adminPanelAuth */ "./src/js/lib/components/adminPanel/adminPanelAuth.js");
/* harmony import */ var _adminPanelInit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./adminPanelInit */ "./src/js/lib/components/adminPanel/adminPanelInit.js");
/**
 * @file index.js
 * @description Main entry point for the admin panel module
 * @module components/adminPanel
 */







// Global settings
_core__WEBPACK_IMPORTED_MODULE_0__["default"].adminSettings = {
  apiBaseUrl: "",
  defaultItemsPerPage: 10
};

/**
 * Creates an advanced admin panel component with CRUD operations, pagination, search, filtering, and notifications.
 * @memberof $.prototype
 * @param {Object} options - Configuration options for the admin panel.
 * @param {string} options.projectId - The ID of the current project.
 * @param {string} [options.apiBaseUrl] - The base URL for the API (overrides global setting).
 * @param {function} options.onMenuItemClick - Callback function when a menu item is clicked.
 * @param {Object} [options.components] - Custom components to use (optional).
 * @param {number} [options.itemsPerPage] - Number of items to display per page (default: 10).
 * @param {Array} [options.menuItems] - Custom menu items (optional).
 * @param {Object} [options.additionalComponents] - Additional UI components like tabs or modals.
 * @returns {Object} The ModernLib object for chaining.
 */

let isInitialized = false;
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.adminPanel = function (options) {
  const {
    projectId,
    apiBaseUrl = _core__WEBPACK_IMPORTED_MODULE_0__["default"].adminSettings.apiBaseUrl,
    onMenuItemClick,
    components = {},
    itemsPerPage = _core__WEBPACK_IMPORTED_MODULE_0__["default"].adminSettings.defaultItemsPerPage,
    menuItems = [{
      id: "dashboard",
      label: "Dashboard"
    }, {
      id: "users",
      label: "Users"
    }, {
      id: "roles",
      label: "Roles"
    }, {
      id: "permissions",
      label: "Permissions"
    }, {
      id: "tables",
      label: "Tables"
    }],
    additionalComponents = {}
  } = options;
  const services = (0,_services__WEBPACK_IMPORTED_MODULE_1__.initServices)(apiBaseUrl, components);
  const initializedComponents = (0,_components__WEBPACK_IMPORTED_MODULE_2__.initComponents)(components);
  const checkAuthAndInitialize = async () => {
    if (isInitialized) {
      console.log("Admin panel is already initialized");
      return;
    }
    try {
      const token = services.authService.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const user = await services.authService.getMe(projectId);
      if (!user || !user.id) {
        throw new Error("Invalid user data");
      }

      //initializeAdminPanel(this, user, options, services);
      (0,_adminPanelInit__WEBPACK_IMPORTED_MODULE_4__.initializeAdminPanel)(this, user, {
        ...options,
        services,
        components: initializedComponents
      });
      isInitialized = true;
    } catch (error) {
      console.error("Authentication error:", error);
      services.authService.removeToken();
      (0,_adminPanelAuth__WEBPACK_IMPORTED_MODULE_3__.showLoginForm)(this, services.authService, projectId, handleSuccessfulLogin);
    }
  };
  const handleSuccessfulLogin = async user => {
    if (!user || !user.id) {
      console.error("Invalid user data after login");
      services.authService.removeToken();
      (0,_adminPanelAuth__WEBPACK_IMPORTED_MODULE_3__.showLoginForm)(this, services.authService, projectId, handleSuccessfulLogin);
      return;
    }

    // initializeAdminPanel(this, user, options, services);
    (0,_adminPanelInit__WEBPACK_IMPORTED_MODULE_4__.initializeAdminPanel)(this, user, {
      ...options,
      services,
      components: initializedComponents
    });
    isInitialized = true;
  };

  // Start the authentication check and initialization process
  checkAuthAndInitialize();
  return this;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/*   services.authService
    .getMe()
    .then((user) => {
      if (!user || !user.id) {
        showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services));
      } else {
        initializeAdminPanel(this, user, options, services);
      }
    })
    .catch(() => showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services))); */

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services.js":
/*!******************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initServices: () => (/* binding */ initServices)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core */ "./src/js/lib/core.js");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/auth */ "./src/js/lib/components/adminPanel/services/auth.js");
/* harmony import */ var _services_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/user */ "./src/js/lib/components/adminPanel/services/user.js");
/* harmony import */ var _services_role__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/role */ "./src/js/lib/components/adminPanel/services/role.js");
/* harmony import */ var _services_permission__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/permission */ "./src/js/lib/components/adminPanel/services/permission.js");
/* harmony import */ var _services_tableStructure__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/tableStructure */ "./src/js/lib/components/adminPanel/services/tableStructure.js");
/* harmony import */ var _services_tableData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/tableData */ "./src/js/lib/components/adminPanel/services/tableData.js");
/**
 * @file services.js
 * @description Service initialization for the admin panel
 * @module components/adminPanel/services
 */








function initServices(apiBaseUrl, components = {}) {
  return {
    authService: components.auth || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().auth(apiBaseUrl),
    userService: components.user || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().user(apiBaseUrl),
    roleService: components.role || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().role(apiBaseUrl),
    permissionService: components.permission || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().permission(apiBaseUrl),
    tableStructureService: components.tableStructure || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().tableStructure(apiBaseUrl),
    tableDataService: components.tableData || (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])().tableData(apiBaseUrl)
  };
}

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/auth.js":
/*!***********************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/auth.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file auth.js
 * @module components/auth
 */


_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey = "project_user_token";
/**
 * Creates a component for project user authentication.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user authentication.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.auth = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  const setToken = token => {
    localStorage.setItem(tokenKey, token);
  };
  const getToken = () => {
    return localStorage.getItem(tokenKey);
  };
  const removeToken = () => {
    localStorage.removeItem(tokenKey);
  };
  return {
    /**
     * Registers a new project user.
     * @async
     * @param {Object} userData - The user data for registration.
     * @param {string} userData.name - The name of the user.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The password of the user.
     * @param {string} userData.password_confirmation - The password confirmation.
     * @param {number} userData.project_id - The ID of the project.
     * @returns {Promise<Object>} A promise that resolves to the registration result.
     * @throws {Error} If there's an error during registration.
     */

    setToken: () => setToken(),
    getToken: () => getToken(),
    removeToken: () => removeToken(),
    register: async function (userData, projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Project-ID": projectId
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        }
        return data;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    /**
     * Logs in a project user.
     * @async
     * @param {Object} credentials - The login credentials.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @param {number} credentials.project_id - The ID of the project.
     * @returns {Promise<Object>} A promise that resolves to the login result.
     * @throws {Error} If there's an error during login.
     */
    login: async function (credentials) {
      try {
        const response = await fetch(`${baseUrl}/project/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Project-ID": credentials.projectId
          },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        }
        return data;
      } catch (error) {
        console.error("Login error:", error);
        localStorage.removeItem(this.tokenKey); // Clear token on login error
        throw error;
      }
    },
    /**
     * Logs out the current project user.
     * @async
     * @returns {Promise<Object>} A promise that resolves to the logout result.
     * @throws {Error} If there's an error during logout.
     */
    logout: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/logout`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        removeToken();
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        return await response.json();
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
    /**
     * Refreshes the authentication token.
     * @async
     * @returns {Promise<Object>} A promise that resolves to the refresh result.
     * @throws {Error} If there's an error during token refresh.
     */
    refreshToken: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        }
        return data;
      } catch (error) {
        console.error("Token refresh error:", error);
        throw error;
      }
    },
    /**
     * Gets the current authenticated user's information.
     * @async
     * @returns {Promise<Object>} A promise that resolves to the user's information.
     * @throws {Error} If there's an error fetching the user's information.
     */
    getMe: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Get user info error:", error);
        throw error;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/permission.js":
/*!*****************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/permission.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file permission.js
 * @module components/permission
 */



/**
 * Creates a component for working with project permissions.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project permission operations.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.permission = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  return {
    /**
     * Retrieves all permissions.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of permissions.
     * @throws {Error} If there's an error fetching the permissions.
     */
    getAll: async function (projectId, {
      page = 1,
      itemsPerPage = 15
    }) {
      try {
        const response = await fetch(`${baseUrl}/project-permissions?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching permissions:", error);
        throw error;
      }
    },
    /**
     * Creates a new permission.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {Object} permissionData - The data for the new permission.
     * @returns {Promise<Object>} A promise that resolves to the created permission.
     * @throws {Error} If there's an error creating the permission.
     */
    create: async function (projectId, permissionData) {
      try {
        const response = await fetch(`${baseUrl}/project-permissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(permissionData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error creating permission:", error);
        throw error;
      }
    },
    /**
     * Retrieves a specific permission by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} permissionId - The ID of the permission.
     * @returns {Promise<Object>} A promise that resolves to the permission.
     * @throws {Error} If there's an error fetching the permission.
     */
    getById: async function (projectId, permissionId) {
      try {
        const response = await fetch(`${baseUrl}/project-permissions/${permissionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching permission:", error);
        throw error;
      }
    },
    /**
     * Updates a specific permission.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} permissionId - The ID of the permission to update.
     * @param {Object} permissionData - The updated data for the permission.
     * @returns {Promise<Object>} A promise that resolves to the updated permission.
     * @throws {Error} If there's an error updating the permission.
     */
    update: async function (projectId, permissionId, permissionData) {
      try {
        const response = await fetch(`${baseUrl}/project-permissions/${permissionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(permissionData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error updating permission:", error);
        throw error;
      }
    },
    /**
     * Deletes a specific permission.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} permissionId - The ID of the permission to delete.
     * @returns {Promise<void>} A promise that resolves when the permission is deleted.
     * @throws {Error} If there's an error deleting the permission.
     */
    delete: async function (projectId, permissionId) {
      try {
        await fetch(`${baseUrl}/project-permissions/${permissionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
      } catch (error) {
        console.error("Error deleting permission:", error);
        throw error;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/role.js":
/*!***********************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/role.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file role.js
 * @module components/projectRoleComponent
 */



/**
 * Creates a component for working with project roles.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project role operations.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.role = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  return {
    /**
     * Retrieves all roles for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of roles.
     * @throws {Error} If there's an error fetching the roles.
     */
    getAll: async function (projectId, {
      page = 1,
      itemsPerPage = 15
    }) {
      try {
        const response = await fetch(`${baseUrl}/project-roles?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }
    },
    /**
     * Creates a new role for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {Object} roleData - The data for the new role.
     * @returns {Promise<Object>} A promise that resolves to the created role.
     * @throws {Error} If there's an error creating the role.
     */
    create: async function (projectId, roleData) {
      try {
        const response = await fetch(`${baseUrl}/project-roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(roleData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error creating role:", error);
        throw error;
      }
    },
    /**
     * Retrieves a specific role by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} roleId - The ID of the role.
     * @returns {Promise<Object>} A promise that resolves to the role.
     * @throws {Error} If there's an error fetching the role.
     */
    getById: async function (projectId, roleId) {
      try {
        const response = await fetch(`${baseUrl}/project-roles/${roleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching role:", error);
        throw error;
      }
    },
    /**
     * Updates a specific role.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} roleId - The ID of the role to update.
     * @param {Object} roleData - The updated data for the role.
     * @returns {Promise<Object>} A promise that resolves to the updated role.
     * @throws {Error} If there's an error updating the role.
     */
    update: async function (projectId, roleId, roleData) {
      try {
        const response = await fetch(`${baseUrl}/project-roles/${roleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(roleData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error updating role:", error);
        throw error;
      }
    },
    /**
     * Deletes a specific role.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} roleId - The ID of the role to delete.
     * @returns {Promise<void>} A promise that resolves when the role is deleted.
     * @throws {Error} If there's an error deleting the role.
     */
    delete: async function (projectId, roleId) {
      try {
        await fetch(`${baseUrl}/project-roles/${roleId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
      } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
      }
    },
    /**
     * Assigns a permission to a role.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} roleId - The ID of the role.
     * @param {string} permissionId - The ID of the permission to assign.
     * @returns {Promise<Object>} A promise that resolves to the updated role with permissions.
     * @throws {Error} If there's an error assigning the permission.
     */
    assignPermission: async function (projectId, roleId, permissionId) {
      try {
        const response = await fetch(`${baseUrl}/project-roles/${roleId}/permissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify({
            permission_id: permissionId
          })
        });
        return await response.json();
      } catch (error) {
        console.error("Error assigning permission:", error);
        throw error;
      }
    },
    /**
     * Removes a permission from a role.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} roleId - The ID of the role.
     * @param {string} permissionId - The ID of the permission to remove.
     * @returns {Promise<Object>} A promise that resolves to the updated role with permissions.
     * @throws {Error} If there's an error removing the permission.
     */
    removePermission: async function (projectId, roleId, permissionId) {
      try {
        const response = await fetch(`${baseUrl}/project-roles/${roleId}/permissions/${permissionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error removing permission:", error);
        throw error;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/tableData.js":
/*!****************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/tableData.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file tableData.js
 * @module components/tableData
 */



/**
 * Creates a component for working with project table data.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project table data operations.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tableData = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  return {
    /**
     * Retrieves all table data for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of table data.
     * @throws {Error} If there's an error fetching the table data.
     */
    getAll: async function (projectId, {
      page = 1,
      itemsPerPage = 15
    }) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table data:", error);
        throw error;
      }
    },
    /**
     * Creates new table data for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {Object} tableData - The data to be created.
     * @returns {Promise<Object>} A promise that resolves to the created table data.
     * @throws {Error} If there's an error creating the table data.
     */
    create: async function (projectId, tableData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(tableData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error creating table data:", error);
        throw error;
      }
    },
    /**
     * Retrieves specific table data by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data.
     * @returns {Promise<Object>} A promise that resolves to the table data.
     * @throws {Error} If there's an error fetching the table data.
     */
    getById: async function (projectId, dataId) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data/${dataId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table data:", error);
        throw error;
      }
    },
    /**
     * Updates specific table data.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data to update.
     * @param {Object} tableData - The updated data.
     * @returns {Promise<Object>} A promise that resolves to the updated table data.
     * @throws {Error} If there's an error updating the table data.
     */
    update: async function (projectId, dataId, tableData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data/${dataId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(tableData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error updating table data:", error);
        throw error;
      }
    },
    /**
     * Deletes specific table data.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data to delete.
     * @returns {Promise<void>} A promise that resolves when the table data is deleted.
     * @throws {Error} If there's an error deleting the table data.
     */
    delete: async function (projectId, dataId) {
      try {
        await fetch(`${baseUrl}/project-table-data/${dataId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
      } catch (error) {
        console.error("Error deleting table structure:", error);
        throw error;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/tableStructure.js":
/*!*********************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/tableStructure.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file tableStructure.js
 * @module components/adminPanel/services/tableStructure
 */



/**
 * Creates a component for working with project table structures.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project table structure operations.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tableStructure = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  return {
    /**
     * Retrieves all table structures for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of table structures.
     * @throws {Error} If there's an error fetching the table structures.
     */
    getAll: async function (projectId, {
      page = 1,
      itemsPerPage = 15
    }) {
      try {
        const response = await fetch(`${baseUrl}/project-table-structures?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table structures:", error);
        throw error;
      }
    },
    /**
     * Creates a new table structure for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {Object} structureData - The data for the new table structure.
     * @returns {Promise<Object>} A promise that resolves to the created table structure.
     * @throws {Error} If there's an error creating the table structure.
     */
    create: async function (projectId, structureData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-structures`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(structureData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error creating table structure:", error);
        throw error;
      }
    },
    /**
     * Retrieves a specific table structure by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} structureId - The ID of the table structure.
     * @returns {Promise<Object>} A promise that resolves to the table structure.
     * @throws {Error} If there's an error fetching the table structure.
     */
    getById: async function (projectId, structureId) {
      try {
        const response = await fetch(`${baseUrl}/project-table-structures/${structureId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table structure:", error);
        throw error;
      }
    },
    /**
     * Updates a specific table structure.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} structureId - The ID of the table structure to update.
     * @param {Object} structureData - The updated data for the table structure.
     * @returns {Promise<Object>} A promise that resolves to the updated table structure.
     * @throws {Error} If there's an error updating the table structure.
     */
    update: async function (projectId, structureId, structureData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-structures/${structureId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(structureData)
        });
        return await response.json();
      } catch (error) {
        console.error("Error updating table structure:", error);
        throw error;
      }
    },
    /**
     * Deletes a specific table structure.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} structureId - The ID of the table structure to delete.
     * @returns {Promise<void>} A promise that resolves when the table structure is deleted.
     * @throws {Error} If there's an error deleting the table structure.
     */
    delete: async function (projectId, structureId) {
      try {
        await fetch(`${baseUrl}/project-table-structures/${structureId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
      } catch (error) {
        console.error("Error deleting table structure:", error);
        throw error;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/services/user.js":
/*!***********************************************************!*\
  !*** ./src/js/lib/components/adminPanel/services/user.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core */ "./src/js/lib/core.js");
/**
 * @file user.js
 * @module components/adminPanel/services/user
 */



/**
 * Creates a component for working with project users.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user operations.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.user = function (baseUrl) {
  const tokenKey = _core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tokenKey;
  return {
    /**
     * Retrieves information about the current project user.
     * @async
     * @param {number} projectId - The ID of the project.
     * @returns {Promise<Object>} A promise that resolves to the current user's information.
     * @throws {Error} If there's an error fetching the user information.
     * @example
     * const userComponent = $().projectUserComponent('http://api.example.com');
     * userComponent.getCurrentUser(1)
     *   .then(user => console.log(user))
     *   .catch(error => console.error(error));
     */
    getCurrentUser: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}` /*  */,
            "X-Project-ID": projectId
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        if (!userData.permissions) {
          console.warn("User permissions not found in the response");
        }
        return userData;
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
      }
    },
    /**
     * Retrieves a specific permission by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} permissionId - The ID of the permission.
     * @returns {Promise<Object>} A promise that resolves to the permission.
     * @throws {Error} If there's an error fetching the permission.
     */
    getById: async function (projectId, userId) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching permission:", error);
        throw error;
      }
    },
    /**
     * Retrieves all users for a specific project.
     * @async
     * @param {number} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of user objects.
     * @throws {Error} If there's an error fetching the users.
     * @example
     * const userComponent = $().user('http://api.example.com');
     * userComponent.getAll(1)
     *   .then(users => console.log(users))
     *   .catch(error => console.error(error));
     */
    getAll: async function (projectId, {
      page = 1,
      itemsPerPage = 15
    }) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    },
    /**
     * Creates a new user for a specific project.
     * @async
     * @param {number} projectId - The ID of the project.
     * @param {Object} userData - The user data to be created.
     * @returns {Promise<Object>} A promise that resolves to the created user object.
     * @throws {Error} If there's an error creating the user.
     */
    create: async function (projectId, userData) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(userData)
        });
        if (!response.ok) {
          const errorBody = await response.text();
          console.error("Error response:", response.status, errorBody);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error updating user:", error);
        console.error("Error details:", error.message);
        throw error;
      }
    },
    /**
     * Updates an existing user for a specific project.
     * @async
     * @param {number} projectId - The ID of the project.
     * @param {number} userId - The ID of the user to update.
     * @param {Object} userData - The updated user data.
     * @returns {Promise<Object>} A promise that resolves to the updated user object.
     * @throws {Error} If there's an error updating the user.
     */
    update: async function (projectId, userId, userData) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify(userData)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    /**
     * Deletes a user from a specific project.
     * @async
     * @param {number} projectId - The ID of the project.
     * @param {number} userId - The ID of the user to delete.
     * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
     * @throws {Error} If there's an error deleting the user.
     */
    delete: async function (projectId, userId) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
    assignRole: async function (projectId, userId, roleId) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users/${userId}/assign-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify({
            role_id: roleId
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error assigning role:", error);
        throw error;
      }
    },
    removeRole: async function (projectId, userId, roleId) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users/${userId}/remove-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId
          },
          body: JSON.stringify({
            role_id: roleId
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error removing role:", error);
        throw error;
      }
    },
    /**
     * Checks if the current user has a specific permission.
     * @async
     * @param {string} permissionName - The name of the permission to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the user has the permission, false otherwise.
     * @throws {Error} If there's an error checking the permission.
     */
    hasPermission: async function (permissionName, projectId) {
      try {
        const currentUser = await this.getCurrentUser(projectId);
        if (!currentUser) {
          console.warn("User is undefined");
          return false;
        }

        // Перевірка для super_user
        if (currentUser.user_type === "super_user") {
          return true; // super_user має всі дозволи
        }

        // Перевірка для project_user
        if (!Array.isArray(currentUser.permissions)) {
          console.warn("User permissions are undefined or not an array");
          return false;
        }
        return currentUser.permissions.includes(permissionName);
      } catch (error) {
        console.error("Error checking permission:", error);
        return false;
      }
    },
    /**
     * Checks if the current user has a specific role.
     * @async
     * @param {string} roleName - The name of the role to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the user has the role, false otherwise.
     * @throws {Error} If there's an error checking the role.
     */
    hasRole: async function (roleName) {
      try {
        const currentUser = await this.getCurrentUser(projectId);
        if (!currentUser) {
          console.warn("User is undefined");
          return false;
        }

        // Перевірка для super_user
        if (currentUser.user_type === "super_user") {
          return true; // super_user має всі ролі
        }

        // Перевірка для project_user
        if (!Array.isArray(currentUser.roles)) {
          console.warn("User roles are undefined or not an array");
          return false;
        }
        return currentUser.roles.includes(roleName);
      } catch (error) {
        console.error("Error checking role:", error);
        return false;
      }
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/adminPanel/util/helperFunctions.js":
/*!******************************************************************!*\
  !*** ./src/js/lib/components/adminPanel/util/helperFunctions.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createModal: () => (/* binding */ createModal),
/* harmony export */   createTabs: () => (/* binding */ createTabs)
/* harmony export */ });
// helperFunctions.js

function createTabs(containerSelector, tabsConfig) {
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
function createModal(id, config) {
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

/***/ }),

/***/ "./src/js/lib/components/cardGenerator.js":
/*!************************************************!*\
  !*** ./src/js/lib/components/cardGenerator.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file cardGenerator.js
 * @description Card generation functionality for ModernLib.
 * @module components/cardGenerator
 */



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
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.cardGenerator = function (url) {
  const createCard = ({
    imgSrc,
    title,
    text,
    link
  }) => {
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
  this.get(url).then(data => {
    let cards = "";
    JSON.parse(data.data).forEach(item => {
      cards += createCard(item);
    });
    this.html(cards);
  }).catch(error => console.error("Error fetching card data:", error));
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

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.cardGeneratorLocal = function (source, isLocal = false) {
  const fetchMethod = isLocal ? this.fetchLocalJson : this.get;
  const createCard = ({
    imgSrc,
    title,
    text,
    link
  }) => `
        <div class="card">
            <img class="card-img" src="${imgSrc}" alt="${title}"/>
            <div class="card-body">
                <div class="card-title">${title}</div>
                <p class="card-text">${text}</p>
                <a href="${link}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Link to</a>
            </div>
        </div>
    `;
  fetchMethod.call(this, source).then(data => {
    let cards = data.map(createCard).join("");
    this.html(cards);
  }).catch(error => console.error("Error generating cards:", error));
  return this;
};

// Приклад використання:
//$('#cardContainer').cardGeneratorLocal('data/cards.json', true);

/***/ }),

/***/ "./src/js/lib/components/carousel.js":
/*!*******************************************!*\
  !*** ./src/js/lib/components/carousel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file carousel.js
 * @description Carousel functionality for ModernLib.
 * @module components/carousel
 */



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
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.carousel = function () {
  for (let i = 0; i < this.length; i++) {
    const width = window.getComputedStyle(this[i].querySelector(".carousel-inner")).width;
    const slides = this[i].querySelectorAll(".carousel-item");
    const slidesField = this[i].querySelector(".carousel-slides");
    const dots = this[i].querySelectorAll(".carousel-indicators li");
    slidesField.style.width = 100 * slides.length + "%";
    slides.forEach(slide => {
      slide.style.width = width;
    });
    let offset = 0;
    let slideIndex = 0;
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i].querySelector('[data-slide="next"]')).click(e => {
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
      dots.forEach(dot => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i].querySelector('[data-slide="prev"]')).click(e => {
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
      dots.forEach(dot => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });
    const sliderId = this[i].getAttribute("id");
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(`#${sliderId} .carousel-indicators li`).click(e => {
      const slideTo = e.target.getAttribute("data-slide-to");
      slideIndex = slideTo;
      offset = +width.replace(/\D/g, "") * slideTo;
      slidesField.style.transform = `translateX(-${offset}px)`;
      dots.forEach(dot => dot.classList.remove("active"));
      dots[slideIndex].classList.add("active");
    });
  }
};
(0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(".carousel").carousel();

/***/ }),

/***/ "./src/js/lib/components/carouselBlog.js":
/*!***********************************************!*\
  !*** ./src/js/lib/components/carouselBlog.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file carouselBlog.js
 * @description Image carousel functionality for ModernLib.
 * @module components/carouselBlog
 */



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
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.carouselBlog = function (options) {
  const settings = {
    prevButtonSelector: "#prev",
    nextButtonSelector: "#next",
    slideSelector: "img",
    slidesContainerSelector: ".flex",
    visibleSlides: 6,
    slideWidth: 100 / 6 // Default width for 6 visible slides
  };

  // Merge options with defaults
  if (options) {
    Object.keys(options).forEach(key => {
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
    slides.forEach(slide => {
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
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(nextButton).click(e => {
      e.preventDefault();
      if (slideIndex < totalSlides - 6) {
        offset += slideWidth;
        slideIndex++;
        moveSlide();
      }
    });
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(prevButton).click(e => {
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

/***/ }),

/***/ "./src/js/lib/components/dropdown.js":
/*!*******************************************!*\
  !*** ./src/js/lib/components/dropdown.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file dropdown.js
 * @description Dropdown functionality for ModernLib.
 * @module components/dropdown
 */



/**
 * Initializes dropdown functionality for selected elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="dropdown">
 * //   <button id="dropdownButton" class="dropdown-toggle">Dropdown</button>
 * //   <div data-toggle-id="dropdownButton" class="dropdown-menu">
 * //     <a href="#">Item 1</a>
 * //     <a href="#">Item 2</a>
 * //   </div>
 * // </div>
 *
 * // Initialize dropdown
 * $('.dropdown-toggle').dropdown();
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.dropdown = function () {
  for (let i = 0; i < this.length; i++) {
    const id = this[i].getAttribute("id");
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).click(() => {
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(`[data-toggle-id="${id}"]`).fadeToggle(300);
    });
  }
};
(0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(".dropdown-toggle").dropdown();

/***/ }),

/***/ "./src/js/lib/components/loadPosts.js":
/*!********************************************!*\
  !*** ./src/js/lib/components/loadPosts.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file loadPosts.js
 * @description Post loading functionality for ModernLib.
 * @module components/loadPosts
 */


/**
 * Loads and displays blog posts from a given URL.
 * @memberof $.prototype
 * @param {string} url - The URL to fetch post data from.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="postsContainer"></div>
 *
 * // Load posts from an API
 * $('#postsContainer').loadPosts('https://api.example.com/posts');
 *
 * // The API should return an array of post objects with the following structure:
 * // [
 * //   {
 * //     link: "https://example.com/post1",
 * //     image: "https://example.com/image1.jpg",
 * //     category: "Technology",
 * //     title: "New Tech Trends",
 * //     author: "John Doe",
 * //     date: "2023-08-15",
 * //     excerpt: "A brief overview of the latest tech trends..."
 * //   },
 * //   // More post objects...
 * // ]
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.loadPosts = function (url) {
  const createPost = post => `
        <article class="flex flex-col shadow my-4">
            <a href="${post.link}" class="hover:opacity-75">
                <img src="${post.image}" />
            </a>
            <div class="bg-white flex flex-col justify-start p-6">
                <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${post.category}</a>
                <a href="${post.link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${post.title}</a>
                <p class="text-sm pb-3">
                    By <a href="#" class="font-semibold hover:text-gray-800">${post.author}</a>, Published on ${post.date}
                </p>
                <a href="${post.link}" class="pb-6">${post.excerpt}</a>
                <a href="${post.link}" class="uppercase text-gray-800 hover:text-black">Continue Reading <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;
  this.get(url).then(data => {
    let postsHTML = data.map(createPost).join("");
    this.html(postsHTML);
  }).catch(error => console.error("Error loading posts:", error));
  return this;
};

/***/ }),

/***/ "./src/js/lib/components/loadPostsLocal.js":
/*!*************************************************!*\
  !*** ./src/js/lib/components/loadPostsLocal.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file loadPostsLocal.js
 * @description Post loading functionality for ModernLib.
 * @module components/loadPostsLocal
 */


/**
 * Loads and displays blog posts from a given URL or local JSON file.
 * @memberof $.prototype
 * @param {string} source - The URL or file path to fetch post data from.
 * @param {boolean} [isLocal=false] - Whether the source is a local file.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="postsContainer"></div>
 * 
 * // Load from API
 * $('#postsContainer').loadPostsLocal('https://api.example.com/posts');
 * 
 * // Load from local JSON file
 * $('#postsContainer').loadPostsLocal('data/posts.json', true);
 * 
 * // The JSON file or API should return an array of post objects with the following structure:
 * // [
 * //   {
 * //     link: "https://example.com/post1",
 * //     image: "https://example.com/image1.jpg",
 * //     category: "Technology",
 * //     title: "New Tech Trends",
 * //     author: "John Doe",
 * //     date: "2023-08-15",
 * //     excerpt: "A brief overview of the latest tech trends..."
 * //   },
 * //   // More post objects...
 * // ]
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.loadPostsLocal = function (source, isLocal = false) {
  const fetchMethod = isLocal ? this.fetchLocalJson : this.get;
  const createPost = post => `
      <article class="flex flex-col shadow my-4">
          <a href="${post.link}" class="hover:opacity-75">
              <img src="${post.image}" />
          </a>
          <div class="bg-white flex flex-col justify-start p-6">
              <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${post.category}</a>
              <a href="${post.link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${post.title}</a>
              <p class="text-sm pb-3">
                  By <a href="#" class="font-semibold hover:text-gray-800">${post.author}</a>, Published on ${post.date}
              </p>
              <a href="${post.link}" class="pb-6">${post.excerpt}</a>
              <a href="${post.link}" class="uppercase text-gray-800 hover:text-black">Continue Reading <i class="fas fa-arrow-right"></i></a>
          </div>
      </article>
  `;
  fetchMethod.call(this, source).then(data => {
    let postsHTML = data.map(createPost).join("");
    this.html(postsHTML);
  }).catch(error => console.error("Error loading posts:", error));
  return this;
};

/***/ }),

/***/ "./src/js/lib/components/modal.js":
/*!****************************************!*\
  !*** ./src/js/lib/components/modal.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file modal.js
 * @description Modal functionality for ModernLib.
 * @module components/modal
 */



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

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.modal = function (created) {
  for (let i = 0; i < this.length; i++) {
    const target = this[i].getAttribute("data-target");
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).click(e => {
      e.preventDefault();
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(target).fadeIn(500);
      document.body.style.overflow = "hidden";
    });
    const closeElements = document.querySelectorAll(`${target} [data-close]`);
    closeElements.forEach(elem => {
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(elem).click(() => {
        (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(target).fadeOut(500);
        document.body.style.overflow = "";
        if (created) {
          document.querySelector(target).remove();
        }
      });
    });
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(target).click(e => {
      if (e.target.classList.contains("modal")) {
        (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(target).fadeOut(500);
        document.body.style.overflow = "";
        if (created) {
          document.querySelector(target).remove();
        }
      }
    });
  }
};

// Auto-initialize modals
(0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])('[data-toggle="modal"]').modal();

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

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.createModal = function ({
  text,
  btns
} = {}) {
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
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).modal(true);
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i].getAttribute("data-target")).fadeIn(500);
  }
};

/***/ }),

/***/ "./src/js/lib/components/navigation.js":
/*!*********************************************!*\
  !*** ./src/js/lib/components/navigation.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file navigation.js
 * @description Mobile navigation functionality for ModernLib.
 * @module components/navigation
 */



/**
 * Initializes mobile navigation functionality.
 * Toggles the visibility of the target element when clicked.
 * @memberof $.prototype
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <button id="menuToggle" data-target="#mobileMenu">Menu</button>
 * // <nav id="mobileMenu" class="hidden">
 * //   <ul>
 * //     <li><a href="#">Home</a></li>
 * //     <li><a href="#">About</a></li>
 * //     <li><a href="#">Contact</a></li>
 * //   </ul>
 * // </nav>
 * 
 * // Initialize mobile navigation
 * $('#menuToggle').mobileNav();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.mobileNav = function () {
  this.click(function () {
    const target = (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this.getAttribute("data-target"));
    target.toggleClass("hidden");
  });
  return this;
};

/***/ }),

/***/ "./src/js/lib/components/notification.js":
/*!***********************************************!*\
  !*** ./src/js/lib/components/notification.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file notification.js
 * @module components/notification
 */



/**
 * Creates a notification component.
 * @param {Object} options - Configuration options for the notification component.
 * @param {string} [options.position='top-right'] - Position of the notification ('top-right', 'top-left', 'bottom-right', 'bottom-left').
 * @param {number} [options.duration=5000] - Duration in milliseconds for which the notification is displayed.
 * @returns {Object} An object with methods for showing notifications.
 *
 * @example
 * // Initialize the notification component
 * const notification = $().notification({
 *   position: 'bottom-left',
 *   duration: 3000
 * });
 *
 * // Show a success notification
 * notification.show('Operation successful!', 'success');
 *
 * // Show an error notification
 * notification.show('An error occurred', 'error');
 *
 * // Show a warning notification
 * notification.show('Please check your input', 'warning');
 *
 * // Show an info notification
 * notification.show('New update available', 'info');
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.notification = function (options = {}) {
  const defaultOptions = {
    position: "top-right",
    duration: 5000
  };
  const settings = {
    ...defaultOptions,
    ...options
  };

  // Create container for notifications if it doesn't exist
  let container = document.querySelector(".modernlib-notification-container");
  if (!container) {
    container = document.createElement("div");
    container.className = `modernlib-notification-container ${settings.position}`;
    document.body.appendChild(container);
  }

  /**
   * Shows a notification.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification ('success', 'error', 'warning', 'info').
   */
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `modernlib-notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    // Trigger a reflow to enable the transition
    notification.offsetHeight;

    // Add visible class to trigger the transition
    notification.classList.add("visible");

    // Remove the notification after the specified duration
    setTimeout(() => {
      notification.classList.remove("visible");
      setTimeout(() => {
        container.removeChild(notification);
      }, 300); // Wait for the fade-out transition to complete
    }, settings.duration);
  }

  // Add styles to the document
  const style = document.createElement("style");
  style.textContent = `
    .modernlib-notification-container {
      position: fixed;
      z-index: 9999;
      max-width: 300px;
    }
    .modernlib-notification-container.top-right { top: 20px; right: 20px; }
    .modernlib-notification-container.top-left { top: 20px; left: 20px; }
    .modernlib-notification-container.bottom-right { bottom: 20px; right: 20px; }
    .modernlib-notification-container.bottom-left { bottom: 20px; left: 20px; }
    .modernlib-notification {
      margin-bottom: 10px;
      padding: 15px;
      border-radius: 4px;
      color: white;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .modernlib-notification.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .modernlib-notification.success { background-color: #4CAF50; }
    .modernlib-notification.error { background-color: #F44336; }
    .modernlib-notification.warning { background-color: #FF9800; }
    .modernlib-notification.info { background-color: #2196F3; }
  `;
  document.head.appendChild(style);
  return {
    show: showNotification
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/components/pagination.js":
/*!*********************************************!*\
  !*** ./src/js/lib/components/pagination.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file pagination.js
 * @description Pagination functionality for ModernLib.
 * @module components/pagination
 */



/**
 * Creates a pagination component.
 * @memberof $.prototype
 * @param {number} totalPages - The total number of pages.
 * @param {number} currentPage - The current active page.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div id="pagination"></div>
 * 
 * // Initialize pagination with 5 total pages, currently on page 1
 * $('#pagination').pagination(5, 1);
 * 
 * // The resulting HTML will look like:
 * // <div id="pagination">
 * //   <a href="#" data-page="1" class="h-10 w-10 bg-blue-800 text-white ...">1</a>
 * //   <a href="#" data-page="2" class="h-10 w-10 text-gray-800 ...">2</a>
 * //   <a href="#" data-page="3" class="h-10 w-10 text-gray-800 ...">3</a>
 * //   <a href="#" data-page="4" class="h-10 w-10 text-gray-800 ...">4</a>
 * //   <a href="#" data-page="5" class="h-10 w-10 text-gray-800 ...">5</a>
 * // </div>
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.pagination = function (totalPages, currentPage) {
  const createPaginationItem = (page, isActive = false) => `
        <a href="#" data-page="${page}" class="h-10 w-10 ${isActive ? "bg-blue-800 text-white" : "text-gray-800"} hover:bg-blue-600 hover:text-white font-semibold text-sm flex items-center justify-center">${page}</a>
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

/***/ }),

/***/ "./src/js/lib/components/postGenerator.js":
/*!************************************************!*\
  !*** ./src/js/lib/components/postGenerator.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file postGenerator.js
 * @description Post generation functionality for ModernLib.
 * @module components/postGenerator
 */


_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.postGenerator = function (url, customTemplate) {
  /**
   * Generates posts based on data fetched from a server.
   * @param {string} url - The URL to fetch post data from.
   * @param {function} [customTemplate] - Optional custom template function.
   * @returns {Promise} A promise that resolves with the fetched data and the ModernLib object.
   * @example
   * // HTML structure
   * // <section id="postsContainer" class="w-full md:w-2/3 flex flex-col items-center px-3"></section>
   * $('#postsContainer').postGenerator('https://api.example.com/posts');
   * // Initialize post generator with default template
   * $('#postsContainer').postGenerator('https://api.example.com/posts')
   *     .then(({data, $el}) => {
   *         console.log('Fetched data:', data);
   *         console.log('ModernLib element:', $el);
   *     });
   * 
   * // Initialize post generator with custom template
   * $('#postsContainer').postGenerator('https://api.example.com/posts', 
   *     (post) => `<div>${post.title}</div>`)
   *     .then(({data, $el}) => {
   *         console.log('Fetched data:', data);
   *         console.log('ModernLib element:', $el);
   *     });
   */

  const defaultTemplate = ({
    image,
    category,
    title,
    author,
    date,
    excerpt,
    link
  }) => {
    return `
            <article class="flex flex-col shadow my-4">
                <a href="${link}" class="hover:opacity-75">
                    <img src="${image}" alt="${title}" />
                </a>
                <div class="bg-white flex flex-col justify-start p-6">
                    <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${category}</a>
                    <a href="${link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${title}</a>
                    <p class="text-sm pb-3">
                        By
                        <a href="#" class="font-semibold hover:text-gray-800">${author}</a>, Published on ${date}
                    </p>
                    <a href="${link}" class="pb-6">${excerpt}</a>
                    <a href="${link}" class="uppercase text-gray-800 hover:text-black">Continue Reading <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
  };
  const createPost = customTemplate || defaultTemplate;
  return new Promise((resolve, reject) => {
    this.get(url).then(data => {
      let posts = '';
      const parsedData = JSON.parse(data.data);
      parsedData.forEach(item => {
        posts += createPost(item);
      });
      this.html(posts);
      resolve({
        data: parsedData,
        $el: this
      });
    }).catch(error => {
      console.error('Error fetching post data:', error);
      reject(error);
    });
  });
};

/***/ }),

/***/ "./src/js/lib/components/tab.js":
/*!**************************************!*\
  !*** ./src/js/lib/components/tab.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file tab.js
 * @description Tab functionality for ModernLib.
 * @module components/tab
 */


/**
 * Initializes tab functionality for selected elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="tab">
 * //   <div class="tab-panel">
 * //     <div class="tab-item">Tab 1</div>
 * //     <div class="tab-item">Tab 2</div>
 * //   </div>
 * //   <div class="tab-content">Content 1</div>
 * //   <div class="tab-content">Content 2</div>
 * // </div>
 *
 * // Initialize tabs
 * $('[data-tabpanel] .tab-item').tab();
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.tab = function () {
  for (let i = 0; i < this.length; i++) {
    (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).on("click", () => {
      (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).addClass("tab-item--active").siblings().removeClass("tab-item--active").closest(".tab").find(".tab-content").removeClass("tab-content--active").eq((0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[i]).index()).addClass("tab-content--active");
    });
  }
};

// Auto-initialize tabs
(0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])('[data-tabpanel] .tab-item').tab();

/***/ }),

/***/ "./src/js/lib/core.js":
/*!****************************!*\
  !*** ./src/js/lib/core.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @file core.js
 * @description Core functionality of the ModernLib library.
 * @module core
 */

/**
 * Creates a new ModernLib object.
 * @param {string|Element} selector - A CSS selector string or DOM Element.
 * @returns {Object} ModernLib object.
 */
const $ = function (selector) {
  return new $.prototype.init(selector);
};

/**
 * Initializes a new ModernLib object.
 * @constructor
 * @param {string|Element} selector - A CSS selector string or DOM Element.
 */

$.prototype.init = function (selector) {
  if (!selector) {
    return this; //{}
  }
  if (selector.tagName) {
    // перевіряємо чи не є обєкт вузлом
    this[0] = selector;
    this.length = 1;
    return this;
  }
  Object.assign(this, document.querySelectorAll(selector));
  this.length = document.querySelectorAll(selector).length;
  return this;
};
$.prototype.init.prototype = $.prototype;
// Додайте цей рядок для підтримки плагінів
$.fn = $.prototype;

/**
 * Iterates over each element in the collection and executes a callback function.
 * @param {Function} callback - Function to execute for each element.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.each = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback.call(this[i], this[i], i, this);
  }
  return this;
};

// Експортуємо як глобальний об'єкт
if (typeof window !== 'undefined') {
  window.$ = $;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ($);

/***/ }),

/***/ "./src/js/lib/lib.js":
/*!***************************!*\
  !*** ./src/js/lib/lib.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/js/lib/core.js");
/* harmony import */ var _modules_display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/display */ "./src/js/lib/modules/display.js");
/* harmony import */ var _modules_classes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/classes */ "./src/js/lib/modules/classes.js");
/* harmony import */ var _modules_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/actions */ "./src/js/lib/modules/actions.js");
/* harmony import */ var _modules_handlers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/handlers */ "./src/js/lib/modules/handlers.js");
/* harmony import */ var _modules_attributes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/attributes */ "./src/js/lib/modules/attributes.js");
/* harmony import */ var _modules_effects__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/effects */ "./src/js/lib/modules/effects.js");
/* harmony import */ var _modules_url__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/url */ "./src/js/lib/modules/url.js");
/* harmony import */ var _modules_jqueryLikeMethods__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/jqueryLikeMethods */ "./src/js/lib/modules/jqueryLikeMethods.js");
/* harmony import */ var _components_notification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/notification */ "./src/js/lib/components/notification.js");
/* harmony import */ var _components_dropdown__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/dropdown */ "./src/js/lib/components/dropdown.js");
/* harmony import */ var _components_modal__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/modal */ "./src/js/lib/components/modal.js");
/* harmony import */ var _components_tab__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/tab */ "./src/js/lib/components/tab.js");
/* harmony import */ var _components_accordion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/accordion */ "./src/js/lib/components/accordion.js");
/* harmony import */ var _components_carousel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/carousel */ "./src/js/lib/components/carousel.js");
/* harmony import */ var _components_navigation__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/navigation */ "./src/js/lib/components/navigation.js");
/* harmony import */ var _components_postGenerator__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/postGenerator */ "./src/js/lib/components/postGenerator.js");
/* harmony import */ var _components_loadPosts__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/loadPosts */ "./src/js/lib/components/loadPosts.js");
/* harmony import */ var _components_loadPostsLocal__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/loadPostsLocal */ "./src/js/lib/components/loadPostsLocal.js");
/* harmony import */ var _components_pagination__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/pagination */ "./src/js/lib/components/pagination.js");
/* harmony import */ var _components_carouselBlog__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/carouselBlog */ "./src/js/lib/components/carouselBlog.js");
/* harmony import */ var _components_cardGenerator__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/cardGenerator */ "./src/js/lib/components/cardGenerator.js");
/* harmony import */ var _components_adminPanel__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/adminPanel */ "./src/js/lib/components/adminPanel/index.js");
/* harmony import */ var _services_request__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./services/request */ "./src/js/lib/services/request.js");
/**
 * @file lib.js
 * @description Main entry point for the ModernLib library.
 * @module ModernLib
 */

/**
 * Import and initialize all modules and components of the ModernLib.
 * @type {Object}
 * @const
 */























// import "./components/projectAuthComponent";
// import "./components/projectUserComponent";
// import "./components/projectRoleComponent";
// import "./components/projectPermissionComponent";
// import "./components/projectTableStructureComponent";


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/modules/actions.js":
/*!***************************************!*\
  !*** ./src/js/lib/modules/actions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file actions.js
 * @description DOM manipulation and traversal methods for ModernLib.
 * @module modules/actions
 */



/**
 * Gets or sets the HTML content of the selected elements.
 * @param {string} [content] - The HTML content to set. If not provided, returns the HTML content of the first element.
 * @returns {(Object|string)} The ModernLib object for chaining when setting, or the HTML content when getting.
 * @example
 * // Getting HTML content
 * const content = $('#myElement').html();
 * console.log(content); // Outputs the HTML content of the first matched element
 *
 * // Setting HTML content
 * $('#myElement').html('<p>New content</p>');
 * // Sets the HTML content for all matched elements and returns the ModernLib object for chaining
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.html = function (content) {
  for (let i = 0; i < this.length; i++) {
    if (content) {
      this[i].innerHTML = content;
    } else {
      return this[i].innerHTML;
    }
  }
  return this;
};

/**
 * Reduces the set of matched elements to the one at the specified index.
 * @param {number} i - The index of the element to select.
 * @returns {Object} A new ModernLib object containing the selected element.
 * @example
 * // Selecting the second element in a set
 * const secondElement = $('li').eq(1);
 * console.log(secondElement.html()); // Outputs the HTML content of the second <li> element
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.eq = function (i) {
  const swap = this[i];
  const objLength = Object.keys(this).length;
  for (let i = 0; i < objLength; i++) {
    delete this[i];
  }
  this[0] = swap;
  this.length = 1;
  return this;
};

/**
 * Gets the index of the first element within its parent.
 * @returns {number} The index of the element.
 * @example
 * // Getting the index of an element
 * const index = $('#myElement').index();
 * console.log(index); // Outputs the index of #myElement among its siblings
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.index = function () {
  const parent = this[0].parentNode;
  const childs = [...parent.children];
  const findMyIndex = item => {
    return item == this[0];
  };
  return childs.findIndex(findMyIndex);
};

/**
 * Finds descendants of the selected elements that match the selector.
 * @param {string} selector - A CSS selector to match elements against.
 * @returns {Object} The ModernLib object containing the matched elements.
 * @example
 * // Finding all paragraphs within a div
 * const paragraphs = $('div').find('p');
 * console.log(paragraphs.length); // Outputs the number of paragraphs found
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.find = function (selector) {
  let numberOfItems = 0;
  let counter = 0;
  const copyObj = Object.assign({}, this);
  for (let i = 0; i < copyObj.length; i++) {
    const arr = copyObj[i].querySelectorAll(selector);
    if (arr.length == 0) {
      continue;
    }
    for (let j = 0; j < arr.length; j++) {
      this[counter] = arr[j];
      counter++;
    }
    numberOfItems += arr.length;
  }
  this.length = numberOfItems;
  const objLength = Object.keys(this).length;
  for (; numberOfItems < objLength; numberOfItems++) {
    delete this[numberOfItems];
  }
  return this;
};

/**
 * Gets the first ancestor of each element that matches the selector.
 * @param {string} selector - A CSS selector to match elements against.
 * @returns {Object} The ModernLib object containing the matched ancestors.
 * @example
 * // Finding the closest div ancestor
 * const closestDiv = $('#myElement').closest('div');
 * console.log(closestDiv.html()); // Outputs the HTML content of the closest div ancestor
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.closest = function (selector) {
  let counter = 0;
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i].closest(selector);
    counter++;
  }
  const objLength = Object.keys(this).length;
  for (; counter < objLength; counter++) {
    delete this[counter];
  }
  return this;
};

/**
 * Gets the siblings of each element in the set of matched elements.
 * @returns {Object} The ModernLib object containing the sibling elements.
 * @example
 * // Getting all siblings of an element
 * const siblings = $('#myElement').siblings();
 * siblings.each(function() {
 *   console.log(this.tagName); // Outputs the tag name of each sibling
 * });
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.siblings = function () {
  let numberOfItems = 0;
  let counter = 0;
  const copyObj = Object.assign({}, this);
  for (let i = 0; i < copyObj.length; i++) {
    const arr = copyObj[i].parentNode.children;
    for (let j = 0; j < arr.length; j++) {
      if (copyObj[i] === arr[j]) {
        continue;
      }
      this[counter] = arr[j];
      counter++;
    }
    numberOfItems += arr.length - 1;
  }
  this.length = numberOfItems;
  const objLength = Object.keys(this).length;
  for (; numberOfItems < objLength; numberOfItems++) {
    delete this[numberOfItems];
  }
  return this;
};

/***/ }),

/***/ "./src/js/lib/modules/attributes.js":
/*!******************************************!*\
  !*** ./src/js/lib/modules/attributes.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file attributes.js
 * @description Attribute manipulation methods for ModernLib.
 * @module modules/attributes
 */


// https://www.w3schools.com/jsref/prop_node_attributes.asp
// https://www.w3schools.com/jsref/met_element_setattribute.asp

/**
 * Sets an attribute on the selected elements.
 * @param {string} attrName - The name of the attribute to set.
 * @param {string} attrValue - The value to set for the attribute.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.setAttr = function (attrName, attrValue) {
  for (let i = 0; i < this.length; i++) {
    this[i].setAttribute(attrName, attrValue);
  }
  return this;
};

/***/ }),

/***/ "./src/js/lib/modules/classes.js":
/*!***************************************!*\
  !*** ./src/js/lib/modules/classes.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file classes.js
 * @description CSS class manipulation methods for ModernLib.
 * @module modules/classes
 */

// https://www.w3schools.com/jsref/prop_element_classlist.asp

/**
 * Adds one or more classes to the selected elements.
 * @param {...string} classNames - The class names to add.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.addClass = function (...classNames) {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].classList) {
      continue;
    }
    this[i].classList.add(...classNames);
  }
  return this;
};

/**
 * Removes one or more classes from the selected elements.
 * @param {...string} classNames - The class names to remove.
 * @returns {Object} The ModernLib object for chaining.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.removeClass = function (...classNames) {
  for (let i = 0; i < this.length; i++) {
    this[i].classList.remove(...classNames);
  }
  return this;
};

/**
 * Toggles a class on the selected elements.
 * @param {string} classNames - The class name to toggle.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.toggleClass = function (classNames) {
  for (let i = 0; i < this.length; i++) {
    this[i].classList.toggle(classNames);
  }
  return this;
};

/**
 * Checks if the element has the specified class.
 * @param {string} className - The name of the class to check.
 * @returns {boolean} true if the element has the specified class, false otherwise.
 * @example
 * if ($('#myElement').hasClass('active')) {
 *   console.log('Element has class "active"');
 * }
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.hasClass = function (className) {
  return this[0].classList.contains(className);
};

/***/ }),

/***/ "./src/js/lib/modules/display.js":
/*!***************************************!*\
  !*** ./src/js/lib/modules/display.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file display.js
 * @description Display manipulation methods for ModernLib.
 * @module modules/display
 */


/**
 * Shows the selected elements by setting their display property to an empty string.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.show = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    this[i].style.display = "";
  }
  return this;
};

/**
 * Hides the selected elements by setting their display property to 'none'.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.hide = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    this[i].style.display = "none";
  }
  return this;
};

/**
 * Toggles the visibility of the selected elements.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.toggle = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    if (this[i].style.display === "none") {
      this[i].style.display = "";
    } else {
      this[i].style.display = "none";
    }
  }
  return this;
};

/***/ }),

/***/ "./src/js/lib/modules/effects.js":
/*!***************************************!*\
  !*** ./src/js/lib/modules/effects.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file effects.js
 * @description Animation and visual effects methods for ModernLib.
 * @module modules/effects
 */



/**
 * Creates an animation function that runs over a specified duration.
 * @param {number} dur - The duration of the animation in milliseconds.
 * @param {Function} cb - The callback function to run on each animation frame.
 * @param {Function} [fin] - The function to run when the animation is complete.
 * @returns {Function} The animation function.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.animateOverTime = function (dur, cb, fin) {
  let timeStart;
  function _animateOverTime(time) {
    if (!timeStart) {
      timeStart = time;
    }
    let timeElapsed = time - timeStart;
    let complection = Math.min(timeElapsed / dur, 1);
    cb(complection);
    if (timeElapsed < dur) {
      requestAnimationFrame(_animateOverTime);
    } else {
      if (typeof fin === "function") {
        fin();
      }
    }
  }
  return _animateOverTime;
};

/**
 * Fades in the selected elements.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {string} [display='block'] - The display property to set when fading in.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.fadeIn = function (dur, display, fin) {
  for (let i = 0; i < this.length; i++) {
    this[i].style.display = display || "block";
    const _fadeIn = complection => {
      this[i].style.opacity = complection;
    };
    const ani = this.animateOverTime(dur, _fadeIn, fin);
    requestAnimationFrame(ani);
  }
  return this;
};

/**
 * Fades out the selected elements.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.fadeOut = function (dur, fin) {
  for (let i = 0; i < this.length; i++) {
    const _fadeOut = complection => {
      this[i].style.opacity = 1 - complection;
      if (complection === 1) {
        this[i].style.display = "none";
      }
    };
    const ani = this.animateOverTime(dur, _fadeOut, fin);
    requestAnimationFrame(ani);
  }
  return this;
};

/**
 * Toggles the visibility of the selected elements with a fade effect.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {string} [display='block'] - The display property to set when fading in.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.fadeToggle = function (dur, display, fin) {
  for (let i = 0; i < this.length; i++) {
    if (window.getComputedStyle(this[i]).display === "none") {
      this[i].style.display = display || "block";
      const _fadeIn = complection => {
        this[i].style.opacity = complection;
      };
      const ani = this.animateOverTime(dur, _fadeIn, fin);
      requestAnimationFrame(ani);
    } else {
      const _fadeOut = complection => {
        this[i].style.opacity = 1 - complection;
        if (complection === 1) {
          this[i].style.display = "none";
        }
      };
      const ani = this.animateOverTime(dur, _fadeOut, fin);
      requestAnimationFrame(ani);
    }
  }
  return this;
};

/***/ }),

/***/ "./src/js/lib/modules/handlers.js":
/*!****************************************!*\
  !*** ./src/js/lib/modules/handlers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file handlers.js
 * @description Event handling methods for ModernLib.
 * @module modules/handlers
 */



/**
 * Attaches an event listener to each element in the collection.
 * @param {string} eventName - The name of the event to listen for.
 * @param {Function} callback - The function to execute when the event occurs.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.on = function (eventName, callback) {
  if (!eventName || !callback) {
    return this;
  }
  for (let i = 0; i < this.length; i++) {
    this[i].addEventListener(eventName, callback);
  }
  return this;
};

/**
 * Removes an event listener from each element in the collection.
 * @param {string} eventName - The name of the event to remove.
 * @param {Function} callback - The function to remove from the event.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.off = function (eventName, callback) {
  if (!eventName || !callback) {
    return this;
  }
  for (let i = 0; i < this.length; i++) {
    this[i].removeEventListener(eventName, callback);
  }
  return this;
};

/**
 * Attaches a click event handler or triggers a click event on each element.
 * @param {Function} [handler] - The function to execute on click event.
 * @returns {Object} The ModernLib object for chaining.
 */

_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.click = function (handler) {
  for (let i = 0; i < this.length; i++) {
    if (handler) {
      this[i].addEventListener("click", handler);
    } else {
      this[i].click();
    }
  }
  return this;
};

/**
 * Attaches a change event handler to each element in the collection.
 * @param {Function} callback - The function to execute when the change event occurs.
 * @returns {Object} The ModernLib object for chaining.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.change = function (callback) {
  if (!callback) {
    return this;
  }
  for (let i = 0; i < this.length; i++) {
    this[i].addEventListener("change", callback);
  }
  return this;
};

/**
 * Maps each element in the collection through a transformation function.
 * @param {Function} callback - Function that produces an element of the new collection.
 * @param {*} [thisArg] - Value to use as `this` when executing callback.
 * @returns {Object} A new ModernLib object with the results of calling the provided function for every element.
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.map = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const results = [];
  const len = this.length;
  for (let i = 0; i < len; i++) {
    if (i in this) {
      results.push(callback.call(thisArg, this[i], i, this));
    }
  }
  return (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(results);
};

/***/ }),

/***/ "./src/js/lib/modules/jqueryLikeMethods.js":
/*!*************************************************!*\
  !*** ./src/js/lib/modules/jqueryLikeMethods.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file jqueryLikeMethods.js
 * @description jQuery-like methods for ModernLib to enhance DOM manipulation and traversal.
 * @module modules/jqueryLikeMethods
 */



/**
 * Gets the next sibling element.
 * @returns {Object} A new ModernLib object containing the next sibling element.
 * @example
 * const nextElement = $('#myElement').next();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.next = function () {
  return (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[0].nextElementSibling);
};

/**
 * Gets the previous sibling element.
 * @returns {Object} A new ModernLib object containing the previous sibling element.
 * @example
 * const prevElement = $('#myElement').prev();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.prev = function () {
  return (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[0].previousElementSibling);
};

/**
 * Gets the parent element.
 * @returns {Object} A new ModernLib object containing the parent element.
 * @example
 * const parentElement = $('#myElement').parent();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.parent = function () {
  return (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[0].parentElement);
};

/**
 * Checks if the element matches the given selector.
 * @param {string} selector - The selector to check against.
 * @returns {boolean} True if the element matches the selector, false otherwise.
 * @example
 * if ($('#myElement').is('.active')) {
 *   console.log('Element has class "active"');
 * }
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.is = function (selector) {
  return this[0].matches(selector);
};

/**
 * Gets the child elements.
 * @returns {Object} A new ModernLib object containing the child elements.
 * @example
 * const childElements = $('#myElement').children();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.children = function () {
  return (0,_core__WEBPACK_IMPORTED_MODULE_0__["default"])(this[0].children);
};

/**
 * Appends content to the end of each element in the set.
 * @param {(string|Node)} content - The content to append. Can be an HTML string or a DOM node.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#myElement').append('<p>New content</p>');
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.append = function (content) {
  if (typeof content === "string") {
    for (let i = 0; i < this.length; i++) {
      this[i].insertAdjacentHTML("beforeend", content);
    }
  } else if (content instanceof Node) {
    for (let i = 0; i < this.length; i++) {
      this[i].appendChild(content.cloneNode(true));
    }
  }
  return this;
};

/**
 * Gets or sets data attributes on the first element in the set.
 * The method supports both camelCase and kebab-case keys.
 *
 * @param {string} key - The name of the data attribute (camelCase or kebab-case).
 * @param {*} [value] - The value to set. If omitted, gets the current value.
 * @returns {(*|Object)} The value of the data attribute if getting, or the ModernLib object for chaining if setting.
 *
 * @example
 * //  <input type="checkbox" data-role-id="${role.id}" />
 * // Get data using kebab-case
 * const value = $('#myElement').data('role-id');
 *
 * @example
 * // Get data using camelCase
 * const value = $('#myElement').data('roleId');
 *
 * @example
 * // Set data using kebab-case
 * $('#myElement').data('role-id', 'value');
 *
 * @example
 * // Set data using camelCase
 * $('#myElement').data('roleId', 'value');
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.data = function (key, value) {
  const formattedKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
  if (value === undefined) {
    return this[0].dataset[formattedKey];
  } else {
    for (let i = 0; i < this.length; i++) {
      this[i].dataset[formattedKey] = value;
    }
    return this;
  }
};

/**
 * Gets or sets the value of a form element.
 * @param {string} [value] - The value to set. If not provided, the method returns the current value.
 * @returns {(string|$.prototype)} The current value of the element (if value is not provided) or the $.prototype object for chaining.
 * @example
 * // Getting the value
 * const value = $('#myInput').val();
 *
 * // Setting the value
 * $('#myInput').val('New value');
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.val = function (value) {
  if (value === undefined) {
    return this[0].value;
  } else {
    for (let i = 0; i < this.length; i++) {
      this[i].value = value;
    }
    return this;
  }
};

/**
 * Triggers a specified event on the first element in the set, or optionally on all elements.
 * @param {string|Event} eventName - The name of the event to trigger or an Event object.
 * @param {*} [data] - Additional data to pass along with the event. If not an object, it will be wrapped in an object with a 'value' property.
 * @param {boolean} [triggerAll=false] - Whether to trigger the event on all elements in the set.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Triggering a simple event on the first element
 * $('#myElement').trigger('click');
 *
 * @example
 * // Triggering an event with object data on the first element
 * $('#myElement').trigger('customEvent', { foo: 'bar' });
 *
 * @example
 * // Triggering an event with a simple value
 * $('#myElement').trigger('customEvent', 'simpleValue');
 *
 * @example
 * // Triggering a custom event on all elements in the set
 * $('.myClass').trigger('myEvent', { foo: 'bar' }, true);
 *
 * @example
 * // Triggering a custom Event object
 * const event = new CustomEvent('myEvent', { detail: { foo: 'bar' } });
 * $('#myElement').trigger(event);
 *
 * @example
 * // Accessing triggered data in an event listener
 * $('#myElement').on('customEvent', function(event) {
 *   console.log(event.detail); // Access the passed data
 * });
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.trigger = function (eventName, data, triggerAll = false) {
  let event;
  if (typeof eventName === "string") {
    event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: data
    });
  } else if (eventName instanceof Event) {
    event = eventName;
  } else {
    throw new Error("Invalid event type. Must be a string or Event object.");
  }
  if (triggerAll) {
    for (let i = 0; i < this.length; i++) {
      this[i].dispatchEvent(event);
    }
  } else if (this[0]) {
    this[0].dispatchEvent(event);
  }
  return this;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/modules/url.js":
/*!***********************************!*\
  !*** ./src/js/lib/modules/url.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file url.js
 * @description URL manipulation and parsing utilities for ModernDOM library. Provides methods for working with post URLs and their components.
 * @module modules/url
 */



/**
 * Parses the current URL and extracts various components.
 * @memberof $.prototype
 * @returns {Object} An object containing parsed URL components.
 * @property {string} fullUrl - The full URL.
 * @property {string} protocol - The protocol (e.g., 'http:' or 'https:').
 * @property {string} host - The host (e.g., 'localhost:8013').
 * @property {string} pathname - The pathname (e.g., '/4/post/123').
 * @property {string} projectNumber - The project number (e.g., '4').
 * @property {string} postType - The post type (e.g., 'post').
 * @property {string} postNumber - The post number (e.g., '123').
 * @property {Object} queryParams - An object containing query parameters.
 * @example
 * // Assuming the current URL is: http://localhost:8013/4/post/123?page=2&category=tech
 * const urlInfo = $().parsePostUrl();
 * console.log(urlInfo);
 * // Output:
 * // {
 * //   fullUrl: "http://localhost:8013/4/post/123?page=2&category=tech",
 * //   protocol: "http:",
 * //   host: "localhost:8013",
 * //   pathname: "/4/post/123",
 * //   projectNumber: "4",
 * //   postType: "post",
 * //   postNumber: "123",
 * //   queryParams: {
 * //     page: "2",
 * //     category: "tech"
 * //   }
 * // }
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.parsePostUrl = function () {
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const result = {
    fullUrl: url.href,
    protocol: url.protocol,
    host: url.host,
    pathname: url.pathname,
    projectNumber: pathParts[0] || '',
    postType: pathParts[1] || '',
    postNumber: pathParts[2] || '',
    queryParams: {}
  };

  // Parse query parameters
  for (const [key, value] of url.searchParams) {
    result.queryParams[key] = value;
  }
  return result;
};

/**
 * Checks if the current URL matches the post structure.
 * @memberof $.prototype
 * @returns {boolean} True if the URL matches the post structure, false otherwise.
 * @example
 * if ($().isPostUrl()) {
 *   console.log("This is a post URL");
 * } else {
 *   console.log("This is not a post URL");
 * }
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.isPostUrl = function () {
  const urlInfo = this.parsePostUrl();
  return urlInfo.pathname.match(/^\/\d+\/post\/\d+$/) !== null;
};

/**
 * Gets a specific component from the parsed URL.
 * @memberof $.prototype
 * @param {string} component - The name of the component to retrieve.
 * @returns {string|Object} The requested component value.
 * @example
 * const postNumber = $().getUrlComponent('postNumber');
 * console.log(`Current post number: ${postNumber}`);
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.getUrlComponent = function (component) {
  const urlInfo = this.parsePostUrl();
  return urlInfo[component];
};

/**
 * Opens a new tab and transfers data.
 * @memberof $.prototype
 * @param {string} url - The URL to open in the new tab.
 * @param {Object} data - The data to transfer.
 * @param {Object} [options] - Additional options.
 * @param {string} [options.target='_blank'] - The target for window.open().
 * @param {string} [options.storageKey='transferredData'] - The key to use in localStorage.
 * @returns {Window} The newly opened window object.
 * @example
 * $().openInNewTabWithData('/post.html', { postId: 123, title: 'My Post' }, { storageKey: 'postData' });
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.openInNewTabWithData = function (url, data, options = {}) {
  const {
    target = '_blank',
    storageKey = 'transferredData'
  } = options;
  const dataId = Date.now().toString();
  const fullUrl = `${url}${url.includes('?') ? '&' : '?'}dataId=${dataId}`;
  localStorage.setItem(`${storageKey}_${dataId}`, JSON.stringify(data));
  const newWindow = window.open(fullUrl, target);

  // Очистка даних через 1 хвилину
  setTimeout(() => {
    localStorage.removeItem(`${storageKey}_${dataId}`);
  }, 60000);
  return newWindow;
};

/**
 * Retrieves transferred data from localStorage based on URL parameter.
 * @memberof $.prototype
 * @param {Object} [options] - Additional options.
 * @param {string} [options.storageKey='transferredData'] - The key used in localStorage.
 * @returns {Object|null} The retrieved data or null if not found.
 * @example
 * const data = $().getTransferredData({ storageKey: 'postData' });
 * if (data) {
 *   console.log('Received data:', data);
 * } else {
 *   console.log('No data found');
 * }
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.getTransferredData = function (options = {}) {
  const {
    storageKey = 'transferredData'
  } = options;
  const urlParams = new URLSearchParams(window.location.search);
  const dataId = urlParams.get('dataId');
  if (!dataId) {
    console.error('No dataId provided in URL');
    return null;
  }
  const data = localStorage.getItem(`${storageKey}_${dataId}`);
  if (!data) {
    console.error('No transferred data found in localStorage');
    return null;
  }

  // Видаляємо дані після отримання
  localStorage.removeItem(`${storageKey}_${dataId}`);
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing transferred data:', error);
    return null;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/lib/services/request.js":
/*!****************************************!*\
  !*** ./src/js/lib/services/request.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core */ "./src/js/lib/core.js");
/**
 * @file request.js
 * @description AJAX request methods for ModernLib.
 * @module services/request
 */



/**
 * Performs a GET request.
 * @param {string} url - The URL to send the request to.
 * @param {string} [dataTypeAnswer='json'] - The expected data type of the response.
 * @returns {Promise<*>} A promise that resolves with the response data.
 * @throws {Error} If the fetch request fails.
 * @example
 * // Fetching JSON data
 * $().get('https://api.example.com/data')
 *   .then(data => console.log('Received data:', data))
 *   .catch(error => console.error('Error:', error));
 * 
 * @example
 * // Fetching text data
 * $().get('https://api.example.com/text', 'text')
 *   .then(text => console.log('Received text:', text))
 *   .catch(error => console.error('Error:', error));
 * 
 * @example
 * // Fetching binary data (e.g., image)
 * $().get('https://api.example.com/image.jpg', 'blob')
 *   .then(blob => {
 *     const imageUrl = URL.createObjectURL(blob);
 *     const img = document.createElement('img');
 *     img.src = imageUrl;
 *     document.body.appendChild(img);
 *   })
 *   .catch(error => console.error('Error:', error));
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.get = async function (url, dataTypeAnswer = "json") {
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }
  switch (dataTypeAnswer) {
    case "json":
      return await res.json();
    case "text":
      return await res.text();
    case "blob":
      return await res.blob();
  }
};

/**
 * Performs a POST request.
 * @param {string} url - The URL to send the request to.
 * @param {*} data - The data to send with the request.
 * @param {string} [dataTypeAnswer='text'] - The expected data type of the response.
 * @returns {Promise<*>} A promise that resolves with the response data.
 * @example
 * // Sending form data
 * const formData = new FormData(document.querySelector('form'));
 * $().post('https://api.example.com/submit', formData)
 *   .then(response => console.log('Response:', response))
 *   .catch(error => console.error('Error:', error));
 * 
 * @example
 * // Sending JSON data and expecting JSON response
 * const data = { name: 'John', age: 30 };
 * $().post('https://api.example.com/users', JSON.stringify(data), 'json')
 *   .then(response => console.log('User created:', response))
 *   .catch(error => console.error('Error:', error));
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.post = async function (url, data, dataTypeAnswer = "text") {
  let res = await fetch(url, {
    method: "POST",
    body: data
  });
  switch (dataTypeAnswer) {
    case "json":
      return await res.json();
    case "text":
      return await res.text();
    case "blob":
      return await res.blob();
  }
};

/**
 * Fetches data from a local JSON file.
 * @memberof $.prototype
 * @param {string} filePath - The path to the local JSON file.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON data.
 * @example
 * // Fetching and using local JSON data
 * $('#postsContainer').fetchLocalJson('data/posts.json')
 *   .then(data => {
 *     data.posts.forEach(post => {
 *       const postElement = document.createElement('div');
 *       postElement.textContent = post.title;
 *       document.getElementById('postsContainer').appendChild(postElement);
 *     });
 *   })
 *   .catch(error => console.error('Error:', error));
 * 
 * @example
 * // Using with async/await
 * async function loadPosts() {
 *   try {
 *     const data = await $('#postsContainer').fetchLocalJson('data/posts.json');
 *     data.posts.forEach(post => {
 *       // Process each post
 *     });
 *   } catch (error) {
 *     console.error('Failed to load posts:', error);
 *   }
 * }
 * loadPosts();
 */
_core__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.fetchLocalJson = function (filePath) {
  return fetch(filePath).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).catch(error => {
    console.error("Error fetching local JSON:", error);
    throw error;
  });
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/lib */ "./src/js/lib/lib.js");
 /* 
                           $(".active").on("click", sayHello);
                           $(".active").off("click", sayHello);
                           $("button").on("click", function () {
                           $('div').eq(1).toggleClass("active");
                           });
                           $("div").on("click", function () { 
                           console.log($(this).index());
                           $('div').find(1);
                           });
                           console.log($('div').eq(2).find('.more'));
                           $('button').html('Click');
                           console.log($('.some').closest('.findme'));
                           console.log($('.more').eq(0).siblings())
                           console.log($('.findme').siblings())
                           function sayHello() {
                           console.log('Click');
                           } */

/* function sayHello() {
  console.log('Click');
}

$(".active").on("click", sayHello);
 

$("div").on("click", function () { 
  console.log($(this).index()); 
}); */
/******/ })()
;
//# sourceMappingURL=script.js.map