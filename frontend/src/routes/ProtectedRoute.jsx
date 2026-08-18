// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuth } from '@/shared/utils/authUtils';

const ProtectedRoute = ({ allowedRoles, publicOnly = false }) => {
  const { token, role } = getAuth();
  const location = useLocation();

  // ✅ REDIRECT LOGGED-IN USERS AWAY FROM PUBLIC PAGES (Login, Register, Home, etc.)
  if (publicOnly && token) {
    const dashboardMap = {
      WORKER: "/worker/dashboard",
      CLIENT: "/client/dashboard",
      ORGANIZATION: "/organization/dashboard",
      ADMIN: "/admin/dashboard",
    };
    return <Navigate to={dashboardMap[role] || "/"} replace />;
  }

  // ✅ STANDARD PROTECTED ROUTE LOGIC
  if (!publicOnly && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!publicOnly && allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;