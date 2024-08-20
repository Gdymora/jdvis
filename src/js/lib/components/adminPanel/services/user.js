/**
 * @file user.js
 * @module components/adminPanel/services/user
 */

import $ from "../../../core";

/**
 * Creates a component for working with project users.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user operations.
 */
$.prototype.user = function (baseUrl) {
  const tokenKey = $.prototype.tokenKey;
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
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,/*  */
            "X-Project-ID": projectId,
          },
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
    getAll: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/${projectId}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
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
    createUser: async function (projectId, userData) {
      try {
        const response = await fetch(`${baseUrl}/${apiVersion}/project/${projectId}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error creating user:", error);
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
    updateUser: async function (projectId, userId, userData) {
      try {
        const response = await fetch(`${baseUrl}/${apiVersion}/project/${projectId}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
          body: JSON.stringify(userData),
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
    deleteUser: async function (projectId, userId) {
      try {
        const response = await fetch(`${baseUrl}/${apiVersion}/project/${projectId}/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
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
        console.warn('User is undefined');
        return false;
      }

      // Перевірка для super_user
      if (currentUser.user_type === 'super_user') {
        return true; // super_user має всі дозволи
      }

      // Перевірка для project_user
      if (!Array.isArray(currentUser.permissions)) {
        console.warn('User permissions are undefined or not an array');
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
        console.warn('User is undefined');
        return false;
      }

      // Перевірка для super_user
      if (currentUser.user_type === 'super_user') {
        return true; // super_user має всі ролі
      }

      // Перевірка для project_user
      if (!Array.isArray(currentUser.roles)) {
        console.warn('User roles are undefined or not an array');
        return false;
      }
      return currentUser.roles.includes(roleName);
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  },
  };
};

export default $;
