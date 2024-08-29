/**
 * @file adminPanelUsers.js
 * @description User management functions for the admin panel
 * @module components/adminPanelUsers
 */

/**
 * Loads and displays the list of users
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} userComponent - The user management component
 * @example
 * loadUsers($('#contentArea'), '123', userComponent);
 */
export function loadUsers(contentArea, projectId, userComponent, options = {}) {
  const { page = 1, itemsPerPage = 10 } = options;

  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  userComponent
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
                  <td>
                    <button class="editUserBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${user.id}">Edit</button>
                    <button class="deleteUserBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${user.id}">Delete</button>
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

      $("#addUserBtn").click(() => showUserForm(contentArea, projectId, userComponent));
      $(".editUserBtn").click(function () {
        const userId = $(this).data("id");
        showUserForm(contentArea, projectId, userComponent, userId);
      });
      $(".deleteUserBtn").click(function () {
        const userId = $(this).data("id");
        if (confirm("Are you sure you want to delete this user?")) {
          userComponent
            .delete(projectId, userId)
            .then(() => {
              notification.show("User delete successfully", "success");
              loadUsers(contentArea, projectId, userComponent);
            })
            .catch((error) => {
              notification.show("Error deleting user: " + error.message);
            });
        }
      });
    })
    .catch((error) => {
      contentArea.html("<p>Error loading users.</p>");
      console.error("Error loading users:", error);
      notification.show("Error loading users:", error);
    });
}

/**
 * Shows the user form for adding or editing a user
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} userComponent - The user management component
 * @param {string} [userId] - The ID of the user to edit (optional)
 * @example
 * showUserForm($('#contentArea'), '123', userComponent, '456');
 */
export function showUserForm(contentArea, projectId, userComponent, userId = null) {
  const title = userId ? "Edit User" : "Add User";
  const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="userForm">
        <input type="text" id="userName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <input type="email" id="userEmail" placeholder="Email" class="w-full p-2 mb-4 border rounded" required>
        <input type="password" id="userPassword" placeholder="Password" class="w-full p-2 mb-4 border rounded" ${userId ? "" : "required"}>
        <input type="password" id="userConfirmed" placeholder="Confirmed" class="w-full p-2 mb-4 border rounded" ${userId ? "" : "required"}>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;
  contentArea.html(formHTML);

  if (userId) {
    userComponent.getById(projectId, userId).then((user) => {
      $("#userName").val(user.name);
      $("#userEmail").val(user.email);
    });
  }

  $("#userForm").on("submit", function (e) {
    e.preventDefault();
    const userData = {
      name: $("#userName").val(),
      email: $("#userEmail").val(),
      password: $("#userPassword").val(),
      password_confirmation: $("#userConfirmed").val(),
    };

    const action = userId ? userComponent.update(projectId, userId, userData) : userComponent.create(projectId, userData);

    action.then(() => loadUsers(contentArea, projectId, userComponent)).catch((error) => alert("Error saving user: " + error.message));
  });
}
