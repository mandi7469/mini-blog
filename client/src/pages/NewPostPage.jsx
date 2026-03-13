import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postsApi";
import { useAuth } from "../context/AuthContext";

// NewPostPage component that provides a form for creating a new blog post, handling form state and submission, and displaying any errors
// that may occur during the API call to create the post, while navigating to the newly created post's detail page upon successful creation
function NewPostPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await createPost(formData, token);
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h1 className="mb-4">Create Post</h1>

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
            rows="5"
            value={formData.body}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100">Create Post</button>
      </form>
    </div>
  );
}

export default NewPostPage;
