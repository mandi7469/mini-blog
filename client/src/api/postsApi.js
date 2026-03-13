const API_URL = import.meta.env.VITE_API_URL;

// Helper function to fetch all posts, optionally filtered by author ID
export const getAllPosts = async (authorId = "") => {
  // Construct the URL for fetching posts, adding a query parameter for author ID if provided
  const url = authorId
    ? `${API_URL}/api/posts?author=${authorId}`
    : `${API_URL}/api/posts`;
  // Make a GET request to the constructed URL to fetch the posts
  const response = await fetch(url);
  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to fetch a single post by its ID
export const getPostById = async (postId) => {
  // Make a GET request to the /api/posts/:id endpoint to fetch a specific post by its ID
  const response = await fetch(`${API_URL}/api/posts/${postId}`);
  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to create a new post with authentication token for authorization
export const createPost = async (postData, token) => {
  // Make a POST request to the /api/posts endpoint with the post data and the Authorization header containing the token
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to update an existing post by its ID with authentication token for authorization
export const updatePost = async (postId, postData, token) => {
  // Make a PATCH request to the /api/posts/:id endpoint with the updated post data and the Authorization header containing the token
  const response = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to update post");
  }
  // If the response is OK, return the data
  return data;
};

// Helper function to delete a post by its ID with authentication token for authorization
export const deletePost = async (postId, token) => {
  // Make a DELETE request to the /api/posts/:id endpoint with the Authorization header containing the token
  const response = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // Check if the response is not OK (status code outside of 200-299)
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }
  // If the response is OK, return the data
  return data;
};
