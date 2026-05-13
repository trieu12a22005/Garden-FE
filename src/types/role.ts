export type Permission = {
  permissionID: string;
  permissionName: string;
  code: string;
  description?: string;
};
export type RoleRow = {
  roleID: string;
  roleName: string;
  roleDescription: string;
  permissions: string[];
};
