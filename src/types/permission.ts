export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

// User permissions for the user management module
export const USER_PERMISSIONS = {
  LIST: 'user-list',
  CREATE: 'user-create',
  EDIT: 'user-edit',
  DELETE: 'user-delete',
  VIEW: 'user-view'
};

// Check if a user has a specific permission
export const hasPermission = (
  userPermissions: string[] | undefined, 
  permission: string
): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(permission) || userPermissions.includes('admin');
};
