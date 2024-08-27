/**
 * @file adminPanelComponents.js
 * @description Component initialization for the admin panel
 * @module components/adminPanel/components
 */

import { createUserManagement } from "./components/userManagement";
import { createRoleManagement } from "./components/roleManagement";
import { createPermissionManagement } from "./components/permissionManagement";
import { createTableManagement } from "./components/tableManagement";
import { createPostManagement } from "./components/postManagement";

export function initComponents(options = {}) {
  return {
    userManagement: options.userManagement || createUserManagement(),
    roleManagement: options.roleManagement || createRoleManagement(),
    permissionManagement: options.permissionManagement || createPermissionManagement(),
    tableManagement: options.tableManagement || createTableManagement(),
    postManagement: options.postManagement || createPostManagement(),
  };
}
