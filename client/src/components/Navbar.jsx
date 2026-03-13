import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Navbar component that displays navigation links and user information based on authentication status and provides a logout button for
// authenticated users to log out and navigate back to the login page, while showing login and signup links for unauthenticated users
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Mini Blog
        </Link>

        <div className="collapse navbar-collapse show">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>

            {isAuthenticated && (
              <NavLink className="nav-link" to="/posts/new">
                New Post
              </NavLink>
            )}
          </div>

          <div className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <span className="navbar-text me-3">
                  Signed in as {user?.username}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-link" to="/signup">
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
