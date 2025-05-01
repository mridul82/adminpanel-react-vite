import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/types/permission';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

/**
 * A component that guards routes based on user permissions
 * @param children The content to render if the user has the required permission
 * @param permission The permission required to access the route
 * @param fallback Optional content to render if the user doesn't have the required permission
 */
export default function PermissionGuard({ 
  children, 
  permission, 
  fallback 
}: PermissionGuardProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if the user has the required permission
  const userHasPermission = hasPermission(user?.permissions, permission);
  
  if (!userHasPermission) {
    // If a fallback is provided, render it
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Otherwise, redirect to the dashboard with a state indicating the user was denied access
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location,
          permissionDenied: true,
          requiredPermission: permission
        }} 
        replace 
      />
    );
  }
  
  // If the user has the permission, render the children
  return <>{children}</>;
}
