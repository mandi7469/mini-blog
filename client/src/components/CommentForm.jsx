import { useState } from "react";

// CommentForm component that provides a form for adding a new comment to a blog post, handling form state and submission,
// and displaying any errors that may occur during the submission process, while showing a loading state when the comment is being posted
function CommentForm({ onSubmit, loading }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!body.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await onSubmit({ body });
      setBody("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Add a Comment</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your comment..."
              disabled={loading}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentForm;
