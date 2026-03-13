import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../api/postsApi";

// HomePage component that fetches and displays a list of all blog posts, showing a loading state while fetching data and handling any errors
// that may occur during the API call, while providing links to individual post detail pages for each post
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div className="container">Loading posts...</div>;
  if (error) return <div className="container text-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="mb-4">All Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="list-group">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <h5>{post.title}</h5>
              <small>By {post.author.username}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
