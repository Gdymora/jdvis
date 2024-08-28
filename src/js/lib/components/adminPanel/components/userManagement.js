// components/userManagement.js

export function createUserManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, userService, roleService, options = {}) {
      const { page = 1, itemsPerPage = 10 } = options;

      userService
        .getAll(projectId, { page, itemsPerPage })
        .then((response) => {
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
                ${users
                  .map(
                    (user) => `
                  <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.roles ? user.roles.map((role) => role.name).join(", ") : ""}</td>
                    <td>
                      <button class="editUserBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${user.id}">Edit</button>
                      <button class="deleteUserBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2" data-id="${user.id}">Delete</button>
                      <button class="manageRolesBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" data-id="${user.id}">Manage Roles</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `;
          contentArea.html(usersHTML);

          $("#paginationArea").pagination(totalPages, page);

          $("#addUserBtn").click(() => this.showForm(contentArea, projectId, userService, roleService));
          $(".editUserBtn").click((e) => {
            const userId = $(e.target).data("id");
            this.showForm(contentArea, projectId, userService, roleService, userId);
          });
          $(".deleteUserBtn").click((e) => {
            const userId = $(e.target).data("id");
            if (confirm("Are you sure you want to delete this user?")) {
              userService
                .delete(projectId, userId)
                .then(() => {
                  notification.show("User deleted successfully", "success");
                  this.load(contentArea, projectId, userService, roleService);
                })
                .catch((error) => {
                  notification.show("Error deleting user: " + error.message, "error");
                  console.error("Error deleting user: " + error.message);
                });
            }
          });
          $(".manageRolesBtn").click((e) => {
            const userId = $(e.target).data("id");
            this.showRolesManagement(contentArea, projectId, userService, roleService, userId);
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading users.</p>");
          notification.show("Error loading users: " + error.message, "error");
          console.error("Error loading users: " + error.message);
        });
    },

    showForm: function (contentArea, projectId, userService, roleService, userId = null) {
      const title = userId ? "Edit User" : "Add User";

      Promise.all([roleService.getAll(projectId, { page: 1, itemsPerPage: 100 }), userId ? userService.getById(projectId, userId) : Promise.resolve(null)])
        .then(([rolesResponse, user]) => {
          const roles = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse.data || [];
          const formHTML = `
          <h2 class="text-xl mb-4">${title}</h2>
          <form id="userForm">
            <input type="text" id="userName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required value="${user ? user.name : ""}">
            <input type="email" id="userEmail" placeholder="Email" class="w-full p-2 mb-4 border rounded" required value="${user ? user.email : ""}">
            ${
              !userId
                ? `
              <input type="password" id="userPassword" placeholder="Password" class="w-full p-2 mb-4 border rounded" required>
              <input type="password" id="userConfirmed" placeholder="Confirm Password" class="w-full p-2 mb-4 border rounded" required>
            `
                : ""
            }
            <div class="mb-4">
              <label class="block mb-2">Roles:</label>
              ${roles
                .map(
                  (role) => `
                <label class="inline-flex items-center mr-4">
                  <input type="checkbox" class="form-checkbox" name="roles[]" value="${role.id}"
                    ${user && user.roles && user.roles.some((r) => r.id === role.id) ? "checked" : ""}>
                  <span class="ml-2">${role.name}</span>
                </label>
              `
                )
                .join("")}
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
          </form>
        `;
          contentArea.html(formHTML);

          $("#userForm").on("submit", (e) => {
            e.preventDefault();
            const userData = {
              name: $("#userName").val(),
              email: $("#userEmail").val(),
              roles: Array.from(document.querySelectorAll('input[name="roles[]"]:checked')).map((checkbox) => checkbox.value),
            };

            if (!userId) {
              userData.password = $("#userPassword").val();
              userData.password_confirmation = $("#userConfirmed").val();
            }

            const action = userId ? userService.update(projectId, userId, userData) : userService.create(projectId, userData);

            action
              .then(() => {
                notification.show(`User ${userId ? "updated" : "created"} successfully`, "success");
                this.load(contentArea, projectId, userService, roleService);
              })
              .catch((error) => {
                notification.show(`Error ${userId ? "updating" : "creating"} user: ${error.message}`, "error");
                console.error(`Error ${userId ? "updating" : "creating"} user: ${error.message}`);
                this.trigger("userError", { error, action: userId ? "update" : "create" });
              });
          });
        })
        .catch((error) => {
          notification.show("Error loading form data: " + error.message, "error");
          console.error("Error loading form data: " + error.message);
        });
    },

    showRolesManagement: function (contentArea, projectId, userService, roleService, userId) {
      Promise.all([userService.getById(projectId, userId), roleService.getAll(projectId, { page: 1, itemsPerPage: 100 })])
        .then(([user, rolesResponse]) => {
          const roles = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse.data || [];
          const rolesManagementHTML = `
          <h2 class="text-xl mb-4">Manage Roles for ${user.name}</h2>
          <div class="mb-4">
            ${roles
              .map(
                (role) => `
              <div class="mb-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox roleCheckbox" data-role-id="${role.id}" 
                    ${user.roles.some((r) => r.id === role.id) ? "checked" : ""}>
                  <span class="ml-2">${role.name}</span>
                </label>
              </div>
            `
              )
              .join("")}
          </div>
          <button id="backBtn" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back</button>
        `;
          contentArea.html(rolesManagementHTML);

          $(".roleCheckbox").change((e) => {
            const roleId = $(e.target).data("role-id");
            const isChecked = e.target.checked;

            const action = isChecked ? userService.assignRole(projectId, userId, roleId) : userService.removeRole(projectId, userId, roleId);

            action
              .then(() => {
                notification.show(`Role ${isChecked ? "assigned to" : "removed from"} user successfully`, "success");
              })
              .catch((error) => {
                notification.show(`Error ${isChecked ? "assigning" : "removing"} role: ${error.message}`, "error");
                console.error(`Error ${isChecked ? "assigning" : "removing"} role: ${error.message}`);
                e.target.checked = !isChecked; // Revert checkbox state on error
              });
          });

          $("#backBtn").click(() => this.load(contentArea, projectId, userService, roleService));
        })
        .catch((error) => {
          notification.show("Error loading roles management: " + error.message, "error");
          console.error("Error loading roles management: " + error.message);
        });
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
