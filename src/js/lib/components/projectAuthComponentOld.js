/**
 * @file projectAuthComponent.js
 * @module components/projectAuthComponent
 */

import $ from '../core';

/**
 * Creates a component for project user authentication.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project user authentication.
 */
$.prototype.projectAuthComponent = function(baseUrl) {
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
        register: async function(userData) {
            try {
                const response = await fetch(`${baseUrl}/v1/project/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                return await response.json();
            } catch (error) {
                console.error('Registration error:', error);
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
        login: async function(credentials) {
            try {
                const response = await fetch(`${baseUrl}/v1/project/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                return await response.json();
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },

        /**
         * Logs out the current project user.
         * @async
         * @returns {Promise<Object>} A promise that resolves to the logout result.
         * @throws {Error} If there's an error during logout.
         */
        logout: async function() {
            try {
                const response = await fetch(`${baseUrl}/v1/project/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                return await response.json();
            } catch (error) {
                console.error('Logout error:', error);
                throw error;
            }
        },

        /**
         * Refreshes the authentication token.
         * @async
         * @returns {Promise<Object>} A promise that resolves to the refresh result.
         * @throws {Error} If there's an error during token refresh.
         */
        refreshToken: async function() {
            try {
                const response = await fetch(`${baseUrl}/v1/project/refresh`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                return await response.json();
            } catch (error) {
                console.error('Token refresh error:', error);
                throw error;
            }
        },

        /**
         * Gets the current authenticated user's information.
         * @async
         * @returns {Promise<Object>} A promise that resolves to the user's information.
         * @throws {Error} If there's an error fetching the user's information.
         */
        getMe: async function() {
            try {
                const response = await fetch(`${baseUrl}/v1/project/me`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                return await response.json();
            } catch (error) {
                console.error('Get user info error:', error);
                throw error;
            }
        }
    };
};

export default $;