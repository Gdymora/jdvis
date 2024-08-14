/**
 * @file permission.js
 * @module components/permission
 */

import $ from '../../../core';

/**
 * Creates a component for working with project permissions.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project permission operations.
 */
$.prototype.permission = function(baseUrl) {
    return {
        /**
         * Retrieves all permissions.
         * @async
         * @param {string} projectId - The ID of the project.
         * @returns {Promise<Array>} A promise that resolves to an array of permissions.
         * @throws {Error} If there's an error fetching the permissions.
         */
        getAll: async function(projectId) {
            try {
                const response = await fetch(`${baseUrl}/v1/project-permissions`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Project-ID': projectId
                    }
                });
                return await response.json();
            } catch (error) {
                console.error('Error fetching permissions:', error);
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
        create: async function(projectId, permissionData) {
            try {
                const response = await fetch(`${baseUrl}/v1/project-permissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Project-ID': projectId
                    },
                    body: JSON.stringify(permissionData)
                });
                return await response.json();
            } catch (error) {
                console.error('Error creating permission:', error);
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
        getById: async function(projectId, permissionId) {
            try {
                const response = await fetch(`${baseUrl}/v1/project-permissions/${permissionId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Project-ID': projectId
                    }
                });
                return await response.json();
            } catch (error) {
                console.error('Error fetching permission:', error);
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
        update: async function(projectId, permissionId, permissionData) {
            try {
                const response = await fetch(`${baseUrl}/v1/project-permissions/${permissionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Project-ID': projectId
                    },
                    body: JSON.stringify(permissionData)
                });
                return await response.json();
            } catch (error) {
                console.error('Error updating permission:', error);
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
        delete: async function(projectId, permissionId) {
            try {
                await fetch(`${baseUrl}/v1/project-permissions/${permissionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Project-ID': projectId
                    }
                });
            } catch (error) {
                console.error('Error deleting permission:', error);
                throw error;
            }
        }
    };
};

export default $;