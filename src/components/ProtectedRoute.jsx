import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // If profile hasn't loaded yet but user exists, wait a bit or show loading
    // For simplicity, we assume profile loads quickly after user.
    if (!profile) {
       return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
       );
    }

    if (requiredRole === 'super_admin' && profile.role !== 'super_admin') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Add more role checks as needed
  }

  return children;
};

export default ProtectedRoute;