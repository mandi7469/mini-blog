import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Navbar component with links to the home page, new post page, and my posts page for authenticated users, and login/signup links for unauthenticated users,
// while also showing the username of the signed-in user and providing a logout button that clears authentication state and redirects to the login page
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
              <>
                <NavLink className="nav-link" to="/posts/new">
                  New Post
                </NavLink>
                <NavLink className="nav-link" to="/my-posts">
                  My Posts
                </NavLink>
              </>
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
