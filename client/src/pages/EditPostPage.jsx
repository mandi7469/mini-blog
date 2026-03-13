import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/postsApi";
import { useAuth } from "../context/AuthContext";

// EditPostPage component that allows authenticated users to edit their own blog posts, fetching the post data on mount, handling form state and
// submission, and displaying any errors that may occur during the API calls, while navigating back to the post detail page upon successful update
function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        const post = data.post;

        if (post.author._id !== user?._id) {
          setError("You are not allowed to edit this post.");
          setLoading(false);
          return;
        }

        setFormData({
          title: post.title,
          body: post.body,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, user]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await updatePost(id, formData, token);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading post...</div>;
  if (error && !formData.title && !formData.body) {
    return <div className="container text-danger">{error}</div>;
  }

  return (
    <div className="container" style={{ maxWidth: "700px" }}>
      <h1 className="mb-4">Edit Post</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea
            className="form-control"
            name="body"
            rows="6"
            value={formData.body}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditPostPage;
