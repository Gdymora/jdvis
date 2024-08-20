/**
 * @file auth.js
 * @module components/auth
 */

import $ from "../../../core";
$.prototype.tokenKey = "project_user_token";
/**
 * Creates a component for project user authentication.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user authentication.
 */
$.prototype.auth = function (baseUrl) {
  const tokenKey = $.prototype.tokenKey;

  const setToken = (token) => {
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
    register: async function (userData, projectId) {
      try {
        const response = await fetch(`${baseUrl}/project/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Project-ID": projectId },
          body: JSON.stringify(userData),
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
            "X-Project-ID": credentials.projectId,
          },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        }
        return data;
      } catch (error) {
        console.error("Login error:", error);
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
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
        });
        return await response.json();
      } catch (error) {
        console.error("Get user info error:", error);
        throw error;
      }
    },
  };
};

export default $;
