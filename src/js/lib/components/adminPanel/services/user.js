/**
 * @file user.js
 * @module components/adminPanel/services/user
 */

import $ from '../../../core';

/**
 * Creates a component for working with project users.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user operations.
 */
$.prototype.user = function(baseUrl) {
    return {
        /**
         * Registers a new project user.
         * @async
         * @param {number} projectId - The ID of the project.
         * @param {Object} userData - The data for the new user.
         * @param {string} userData.name - The name of the user.
         * @param {string} userData.email - The email of the user.
         * @param {string} userData.password - The password of the user.
         * @param {string} userData.password_confirmation - The password confirmation.
         * @returns {Promise<Object>} A promise that resolves to the registration result.
         * @throws {Error} If there's an error during registration.
         * @example
         * const user = $().user('http://api.example.com');
         * const newUser = {
         *   name: 'John Doe',
         *   email: 'john@example.com',
         *   password: 'password123',
         *   password_confirmation: 'password123'
         * };
         * user.register(1, newUser)
         *   .then(result => console.log(result))
         *   .catch(error => console.error(error));
         */
        register: async function(projectId, userData) {
            try {
                const response = await fetch(`${baseUrl}/project/${projectId}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                return await response.json();
            } catch (error) {
                console.error('Error registering user:', error);
                throw error;
            }
        },

        /**
         * Logs in a project user.
         * @async
         * @param {number} projectId - The ID of the project.
         * @param {Object} credentials - The user's credentials.
         * @param {string} credentials.email - The user's email.
         * @param {string} credentials.password - The user's password.
         * @returns {Promise<Object>} A promise that resolves to the login result, including the token.
         * @throws {Error} If there's an error during login.
         * @example
         * const userComponent = $().projectUserComponent('http://api.example.com');
         * const credentials = {
         *   email: 'john@example.com',
         *   password: 'password123'
         * };
         * userComponent.login(1, credentials)
         *   .then(result => console.log(result))
         *   .catch(error => console.error(error));
         */
        login: async function(projectId, credentials) {
            try {
                const response = await fetch(`${baseUrl}/project/${projectId}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },

        /**
         * Logs out a project user.
         * @async
         * @param {number} projectId - The ID of the project.
         * @returns {Promise<Object>} A promise that resolves to the logout result.
         * @throws {Error} If there's an error during logout.
         * @example
         * const userComponent = $().projectUserComponent('http://api.example.com');
         * userComponent.logout(1)
         *   .then(result => console.log(result))
         *   .catch(error => console.error(error));
         */
        logout: async function(projectId) {
            try {
                const response = await fetch(`${baseUrl}/project/${projectId}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                localStorage.removeItem('token');
                return await response.json();
            } catch (error) {
                console.error('Logout error:', error);
                throw error;
            }
        },

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
        getCurrentUser: async function(projectId) {
            try {
                const response = await fetch(`${baseUrl}/project/${projectId}/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                return await response.json();
            } catch (error) {
                console.error('Error fetching current user:', error);
                throw error;
            }
        }
    };
};

export default $;