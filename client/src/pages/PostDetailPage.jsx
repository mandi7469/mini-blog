import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/postsApi";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../api/commentsApi";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

// PostDetailPage component that fetches and displays the details of a single blog post along with its comments, allowing authenticated users to add
// new comments and delete their own comments, while handling loading states and any errors that may occur during API calls for fetching post details,
// comments, creating comments, and deleting comments, providing a comprehensive view and interaction for a specific blog post.
function PostDetailPage() {
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState("");
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

  if (loadingPost) {
    return <div className="container">Loading post...</div>;
  }

  if (error && !post) {
    return <div className="container text-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1>{post.title}</h1>

      <p className="text-muted">By {post.author.username}</p>

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
