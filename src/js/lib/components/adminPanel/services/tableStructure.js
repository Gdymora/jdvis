/**
 * @file tableStructure.js
 * @module components/adminPanel/services/tableStructure
 */

import $ from "../../../core";

/**
 * Creates a component for working with project table structures.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project table structure operations.
 */
$.prototype.tableStructure = function (baseUrl) {
  const tokenKey = $.prototype.tokenKey;
  return {
    /**
     * Retrieves all table structures for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of table structures.
     * @throws {Error} If there's an error fetching the table structures.
     */
    getAll: async function (projectId, { page = 1, itemsPerPage = 15 }) {
      try {
        const response = await fetch(`${baseUrl}/project-table-structures?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(structureData),
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
            "X-Project-ID": projectId,
          },
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
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(structureData),
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
            "X-Project-ID": projectId,
          },
        });
      } catch (error) {
        console.error("Error deleting table structure:", error);
        throw error;
      }
    },
  };
};

export default $;
