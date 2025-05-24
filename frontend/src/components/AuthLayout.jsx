import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const authStatus = useSelector(state => state.user.status);
  
  useEffect(() => {
    // Only change loading state after auth is checked
    if (authStatus !== undefined) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Short delay to ensure auth state is stable
      
      return () => clearTimeout(timer);
    }
  }, [authStatus]);
  
  // Store current location in sessionStorage when navigating to a protected route
  useEffect(() => {
    if (authentication && location.pathname !== '/login' && location.pathname !== '/register') {
      sessionStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location, authentication]);
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If auth is required but user is not logged in
  if (authentication && !authStatus) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // If auth is not required but user is already logged in
  if (!authentication && authStatus) {
    // Try to go to previously visited page, or default to profile
    const lastVisitedPage = sessionStorage.getItem('lastVisitedPage') || '/profile';
    return <Navigate to={lastVisitedPage} />;
  }

  return children;
}

export default AuthLayout;

