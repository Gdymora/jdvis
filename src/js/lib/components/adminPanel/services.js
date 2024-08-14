/**
 * @file services.js
 * @description Service initialization for the admin panel
 * @module components/adminPanel/services
 */

import $ from "../../core";
import "./services/auth";
import "./services/user";
import "./services/role";
import "./services/permission";
import "./services/tableStructure";
import "./services/tableData";

export function initServices(apiBaseUrl, components = {}) {
  return {
    authService: components.auth || $().auth(apiBaseUrl),
    userService: components.user || $().user(apiBaseUrl),
    roleService: components.role || $().role(apiBaseUrl),
    permissionService: components.permission || $().permission(apiBaseUrl),
    tableStructureService: components.tableStructure || $().tableStructure(apiBaseUrl),
    tableDataService: components.tableData || $().tableData(apiBaseUrl),
  };
}
