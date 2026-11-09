import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps routes that are only for guests (login / signup).
 * If the user IS logged in → redirect to /problems.
 */
export default function PublicOnlyRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return isLoggedIn ? <Navigate to="/problems" replace /> : <Outlet />;
}
