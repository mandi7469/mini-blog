import { Navigate } from "react-router-dom"; // Import the Navigate component from react-router-dom to handle redirection for unauthorized access
import { useAuth } from "../context/AuthContext"; // Import the custom useAuth hook from the AuthContext to access authentication state and functions

// ProtectedRoute component that checks if the user is authenticated before allowing access to the wrapped children components
// or redirects to the login page if not authenticated or shows a loading state while checking authentication status
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
