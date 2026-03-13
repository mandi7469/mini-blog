import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, getPostById } from "../api/postsApi";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../api/commentsApi";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

// PostDetailPage component that fetches and displays the details of a single blog post, including its comments, while allowing authenticated users to
// create new comments and delete their own comments, and allowing the post owner to edit or delete the post, while handling loading states and any errors
// that may occur during API calls. The component also includes confirmation before deleting a post and navigates back to the user's posts page upon deletion.
function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState("");
  const [postDeleting, setPostDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPostAndComments = async () => {
      setError("");

      try {
        const [postData, commentsData] = await Promise.all([
          getPostById(id),
          getCommentsByPost(id),
        ]);

        setPost(postData.post);
        setComments(commentsData.comments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPost(false);
        setLoadingComments(false);
      }
    };

    loadPostAndComments();
  }, [id]);

  const handleCreateComment = async (commentData) => {
    setCommentSubmitting(true);

    try {
      const data = await createComment(id, commentData, token);
      setComments((prevComments) => [data.comment, ...prevComments]);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeleteLoadingId(commentId);

    try {
      await deleteComment(commentId, token);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoadingId("");
    }
  };

  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    setPostDeleting(true);

    try {
      await deletePost(id, token);
      navigate("/my-posts");
    } catch (err) {
      setError(err.message);
      setPostDeleting(false);
    }
  };

  if (loadingPost) {
    return <div className="container">Loading post...</div>;
  }

  if (error && !post) {
    return <div className="container text-danger">{error}</div>;
  }

  const isOwner = user?._id === post.author?._id;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
        <div>
          <h1>{post.title}</h1>
          <p className="text-muted mb-0">By {post.author.username}</p>
        </div>

        {isOwner && (
          <div className="d-flex gap-2">
            <Link
              to={`/posts/${post._id}/edit`}
              className="btn btn-outline-primary"
            >
              Edit
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={handleDeletePost}
              disabled={postDeleting}
            >
              {postDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <hr />

      <p>{post.body}</p>

      <hr className="my-4" />

      {isAuthenticated ? (
        <CommentForm
          onSubmit={handleCreateComment}
          loading={commentSubmitting}
        />
      ) : (
        <div className="alert alert-secondary">Log in to leave a comment.</div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loadingComments ? (
        <p>Loading comments...</p>
      ) : (
        <CommentList
          comments={comments}
          currentUser={user}
          onDelete={handleDeleteComment}
          deleteLoadingId={deleteLoadingId}
        />
      )}
    </div>
  );
}

export default PostDetailPage;
