/**
 * @file role.js
 * @module components/projectRoleComponent
 */

import $ from "../../../core";

/**
 * Creates a component for working with project roles.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project role operations.
 */
$.prototype.role = function (baseUrl) {
  const tokenKey = $.prototype.tokenKey;
  return {
    /**
     * Retrieves all roles for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of roles.
     * @throws {Error} If there's an error fetching the roles.
     */
    getAll: async function (projectId) {
      try {
        const response = await fetch(`${baseUrl}/project-roles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
        });
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
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(roleData),
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
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(roleData),
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
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
          body: JSON.stringify({ permission_id: permissionId }),
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
            "X-Project-ID": projectId,
          },
        });
        return await response.json();
      } catch (error) {
        console.error("Error removing permission:", error);
        throw error;
      }
    },
  };
};

export default $;
