import { createContext, useContext, useEffect, useState } from "react"; // Import necessary hooks and functions from React
import { getCurrentUser, loginUser, signupUser } from "../api/authApi"; // Import API functions for authentication from the authApi module

// Create a new context for authentication and export it for use in other components
const AuthContext = createContext();

// Create a provider component that will wrap the application and provide authentication state and functions to its children
export const AuthProvider = ({ children }) => {
  // Initialize state variables for token, user information, and loading status. The token is initialized from localStorage
  // to persist authentication across page reloads
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to handle successful authentication by storing the token and user information in state and localStorage
  const handleAuthSuccess = async (authData) => {
    localStorage.setItem("token", authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  // Function to handle user signup by calling the signupUser API function and then handling the authentication success
  const signup = async (formData) => {
    const data = await signupUser(formData);
    await handleAuthSuccess(data);
  };

  // Function to handle user login by calling the loginUser API function and then handling the authentication success
  const login = async (formData) => {
    const data = await loginUser(formData);
    await handleAuthSuccess(data);
  };

  // Function to handle user logout by clearing the token and user information from state and localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // useEffect hook to load the current user's information when the component mounts or when the token changes.
  // If a token exists, it attempts to fetch the current user's information using the getCurrentUser API function.
  // If the token is invalid or the request fails, it clears the token and user information from state and localStorage
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in other components, providing access to authentication state and functions
export const useAuth = () => useContext(AuthContext);
