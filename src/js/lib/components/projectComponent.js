/**
 * @file projectComponent.js
 * @module components/projectComponent
 */

import $ from '../core';

/**
 * Creates a component for working with projects.
 * @param {string} baseUrl - The base URL of the API.
 * @returns {Object} An object with methods for project operations.
 */
$.prototype.projectComponent = function(baseUrl) {
    return {
        /**
         * Retrieves a list of all projects.
         * @async
         * @returns {Promise<Array>} A promise that resolves to an array of projects.
         * @throws {Error} If there's an error fetching the projects.
         * @example
         * const projectComponent = $().projectComponent('http://api.example.com');
         * projectComponent.getProjects()
         *   .then(projects => console.log(projects))
         *   .catch(error => console.error(error));
         */
        getProjects: async function() {
            try {
                const response = await fetch(`${baseUrl}/projects`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                return await response.json();
            } catch (error) {
                console.error('Error fetching projects:', error);
                throw error;
            }
        },

        /**
         * Creates a new project.
         * @async
         * @param {Object} projectData - The data for the new project.
         * @param {string} projectData.name - The name of the project.
         * @param {Object} projectData.project_data - Additional project data.
         * @returns {Promise<Object>} A promise that resolves to the created project.
         * @throws {Error} If there's an error creating the project.
         * @example
         * const projectComponent = $().projectComponent('http://api.example.com');
         * const newProject = {
         *   name: 'New Project',
         *   project_data: { description: 'This is a new project' }
         * };
         * projectComponent.createProject(newProject)
         *   .then(project => console.log(project))
         *   .catch(error => console.error(error));
         */
        createProject: async function(projectData) {
            try {
                const response = await fetch(`${baseUrl}/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(projectData)
                });
                return await response.json();
            } catch (error) {
                console.error('Error creating project:', error);
                throw error;
            }
        },

        /**
         * Updates an existing project.
         * @async
         * @param {number} projectId - The ID of the project to update.
         * @param {Object} projectData - The new data for the project.
         * @returns {Promise<Object>} A promise that resolves to the updated project.
         * @throws {Error} If there's an error updating the project.
         * @example
         * const projectComponent = $().projectComponent('http://api.example.com');
         * const updatedData = {
         *   name: 'Updated Project Name',
         *   project_data: { description: 'This is an updated project' }
         * };
         * projectComponent.updateProject(1, updatedData)
         *   .then(project => console.log(project))
         *   .catch(error => console.error(error));
         */
        updateProject: async function(projectId, projectData) {
            try {
                const response = await fetch(`${baseUrl}/projects/${projectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(projectData)
                });
                return await response.json();
            } catch (error) {
                console.error('Error updating project:', error);
                throw error;
            }
        },

        /**
         * Deletes a project.
         * @async
         * @param {number} projectId - The ID of the project to delete.
         * @returns {Promise<Object>} A promise that resolves to the deletion result.
         * @throws {Error} If there's an error deleting the project.
         * @example
         * const projectComponent = $().projectComponent('http://api.example.com');
         * projectComponent.deleteProject(1)
         *   .then(result => console.log(result))
         *   .catch(error => console.error(error));
         */
        deleteProject: async function(projectId) {
            try {
                const response = await fetch(`${baseUrl}/projects/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                return await response.json();
            } catch (error) {
                console.error('Error deleting project:', error);
                throw error;
            }
        }
    };
};

export default $;