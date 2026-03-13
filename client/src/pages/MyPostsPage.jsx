import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../api/postsApi";
import { useAuth } from "../context/AuthContext";

// MyPostsPage component that fetches and displays a list of blog posts created by the authenticated user, showing a loading state while fetching data
// and handling any errors that may occur during the API call, while providing links to individual post detail pages and edit pages for each post created
function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        const data = await getAllPosts(user._id);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadMyPosts();
    }
  }, [user]);

  if (loading) return <div className="container">Loading your posts...</div>;
  if (error) return <div className="container text-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="mb-4">My Posts</h1>

      {posts.length === 0 ? (
        <p>You haven’t created any posts yet.</p>
      ) : (
        <div className="list-group">
          {posts.map((post) => (
            <div
              key={post._id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <Link
                  to={`/posts/${post._id}`}
                  className="fw-bold text-decoration-none"
                >
                  {post.title}
                </Link>
                <div>
                  <small className="text-muted">
                    Created {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPostsPage;
