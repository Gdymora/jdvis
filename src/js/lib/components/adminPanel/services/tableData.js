/**
 * @file tableData.js
 * @module components/tableData
 */

import $ from "../../../core";

/**
 * Creates a component for working with project table data.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project table data operations.
 */
$.prototype.tableData = function (baseUrl) {
  const tokenKey = $.prototype.tokenKey;
  return {
    /**
     * Retrieves all table data for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<Array>} A promise that resolves to an array of table data.
     * @throws {Error} If there's an error fetching the table data.
     */
    getAll: async function (projectId, { page = 1, itemsPerPage = 15 }) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data?page=${page}&per_page=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table data:", error);
        throw error;
      }
    },

    /**
     * Creates new table data for a project.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {Object} tableData - The data to be created.
     * @returns {Promise<Object>} A promise that resolves to the created table data.
     * @throws {Error} If there's an error creating the table data.
     */
    create: async function (projectId, tableData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(tableData),
        });
        return await response.json();
      } catch (error) {
        console.error("Error creating table data:", error);
        throw error;
      }
    },

    /**
     * Retrieves specific table data by ID.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data.
     * @returns {Promise<Object>} A promise that resolves to the table data.
     * @throws {Error} If there's an error fetching the table data.
     */
    getById: async function (projectId, dataId) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data/${dataId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching table data:", error);
        throw error;
      }
    },
    
    /**
     * Updates specific table data.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data to update.
     * @param {Object} tableData - The updated data.
     * @returns {Promise<Object>} A promise that resolves to the updated table data.
     * @throws {Error} If there's an error updating the table data.
     */
    update: async function (projectId, dataId, tableData) {
      try {
        const response = await fetch(`${baseUrl}/project-table-data/${dataId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            "X-Project-ID": projectId,
          },
          body: JSON.stringify(tableData),
        });
        return await response.json();
      } catch (error) {
        console.error("Error updating table data:", error);
        throw error;
      }
    },

    /**
     * Deletes specific table data.
     * @async
     * @param {string} projectId - The ID of the project.
     * @param {string} dataId - The ID of the table data to delete.
     * @returns {Promise<void>} A promise that resolves when the table data is deleted.
     * @throws {Error} If there's an error deleting the table data.
     */
    delete: async function (projectId, dataId) {
      try {
        await fetch(`${baseUrl}/project-table-data/${dataId}`, {
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
