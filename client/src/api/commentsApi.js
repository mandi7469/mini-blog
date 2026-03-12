const API_URL = import.meta.env.VITE_API_URL;

// Helper function to fetch comments for a specific post by its ID
export const getCommentsByPost = async (postId) => {
  // Make a GET request to the /api/posts/:id/comments endpoint to fetch comments for a specific post by its ID
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`);
  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch comments");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to create a new comment for a specific post by its ID with authentication token for authorization
export const createComment = async (postId, commentData, token) => {
  // Make a POST request to the /api/posts/:id/comments endpoint with the comment data and the Authorization header containing the token
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to create comment");
  }
  // If the response is OK, return the data
  return data;
};
