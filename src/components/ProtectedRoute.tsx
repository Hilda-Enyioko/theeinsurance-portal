import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
 
interface ProtectedRouteProps {
   children: React.ReactNode;
   allowedRoles?: UserRole[];
}
 
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
   const { isAuthenticated, userRole, isLoading } = useAuth();
   const location = useLocation();
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
   }
 
   if (!isAuthenticated) {
     // Redirect to appropriate login page
     const loginPath = allowedRoles?.includes('admin') ? '/admin/login' : '/login';
     return <Navigate to={loginPath} state={{ from: location }} replace />;
   }
 
   if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
     // User doesn't have required role
     return <Navigate to="/" replace />;
   }
 
   return <>{children}</>;
}