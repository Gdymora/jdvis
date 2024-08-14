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
export function showLoginForm(context, authComponent, projectId, initCallback) {
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
  
    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();
      authComponent
        .login({ email, password, project_id: projectId })
        .then(() => {
          authComponent.getMe().then((user) => initCallback(context, user, { projectId }));
        })
        .catch(() => alert("Login failed. Please try again."));
    });
  }