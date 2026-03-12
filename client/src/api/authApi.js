const API_URL = import.meta.env.VITE_API_URL;

// Helper function to handle API responses for signup
export const signupUser = async (userData) => {
  // Make a POST request to the /api/auth/signup endpoint with the user's data
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to handle API responses for login
export const loginUser = async (credentials) => {
  // Make a POST request to the /api/auth/login endpoint with the user's credentials
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to fetch the current user's information using the token
export const getCurrentUser = async (token) => {
  // Make a GET request to the /api/auth/me endpoint with the Authorization header
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }
  // If the response is OK, return the data
  return data;
};
